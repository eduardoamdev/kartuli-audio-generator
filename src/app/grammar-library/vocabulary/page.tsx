import Button from "@/components/ui/Button";
import CardGrid from "@/components/ui/CardGrid";
import { extractVocabularyEntriesFromDataFile } from "@/utils/extractVocabularyEntriesFromDataFile";
import { getNamesOfFolderDataFiles } from "@/utils/getDataFoldersAndFiles";
import { formatFolderOrFileName } from "@/utils/formatFolderOrFileName";
import { getSingleSearchParam } from "@/utils/getSingleSearchParam";
import { DATA_FOLDERS } from "@/utils/constants";

const CARD_SURFACES = [
  "bg-[linear-gradient(135deg,rgba(168,85,247,0.26),rgba(244,114,182,0.16))]",
  "bg-[linear-gradient(135deg,rgba(217,70,239,0.24),rgba(251,113,133,0.16))]",
  "bg-[linear-gradient(135deg,rgba(126,34,206,0.22),rgba(236,72,153,0.14))]",
] as const;

type VocabularyPageProps = {
  searchParams: Promise<{
    filename?: string | string[];
  }>;
};

export default async function VocabularyPage({
  searchParams,
}: VocabularyPageProps) {
  const fileNames = await getNamesOfFolderDataFiles(DATA_FOLDERS.VOCABULARY);
  const resolvedSearchParams = await searchParams;
  const requestedFileName = getSingleSearchParam(resolvedSearchParams.filename);
  const selectedFileName =
    requestedFileName && fileNames.includes(requestedFileName)
      ? requestedFileName
      : null;

  const vocabularyEntries = selectedFileName
    ? await extractVocabularyEntriesFromDataFile({
        folder: DATA_FOLDERS.VOCABULARY,
        filename: selectedFileName,
      })
    : [];

  return (
    <main className="relative flex flex-1 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(244,114,182,0.34),_transparent_34%),radial-gradient(circle_at_82%_16%,_rgba(196,132,252,0.28),_transparent_30%),radial-gradient(circle_at_bottom,_rgba(217,70,239,0.24),_transparent_38%)]" />
      <div className="absolute left-1/2 top-24 h-96 w-96 -translate-x-1/2 rounded-full bg-[rgba(244,114,182,0.22)] blur-3xl" />
      <div className="absolute right-[-4rem] top-20 h-72 w-72 rounded-full bg-[rgba(168,85,247,0.18)] blur-3xl" />

      <div className="relative mx-auto flex w-full max-w-6xl flex-1 items-start px-5 pb-10 pt-3 sm:px-8 sm:pt-45 lg:px-10">
        <div className="w-full space-y-8 rounded-[2rem] border border-[rgba(255,220,240,0.18)] bg-[linear-gradient(180deg,rgba(59,10,49,0.92),rgba(71,15,59,0.8))] p-6 shadow-[0_30px_120px_rgba(36,2,24,0.68)] backdrop-blur-xl sm:p-8">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="inline-flex items-center gap-3 rounded-full border border-[rgba(255,220,240,0.2)] bg-[rgba(255,227,243,0.1)] px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[#ffd3ef] backdrop-blur-md">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(255,220,240,0.18)] bg-[rgba(255,232,245,0.12)] text-base text-[#fff3fd]">
                  🧠
                </span>
                {selectedFileName
                  ? `Words in ${formatFolderOrFileName(selectedFileName)}`
                  : "Choose a vocabulary file"}
              </div>

              <Button
                href="/grammar-library/vocabulary/selector"
                variant="outline"
                fullWidth={false}
                className="rounded-full px-4 py-2 text-sm"
              >
                Back
              </Button>
            </div>
          </div>

          {selectedFileName ? (
            <section className="space-y-4">
              <CardGrid>
                {vocabularyEntries.map((entry, index) => (
                  <article
                    key={`${selectedFileName}-${entry.ka}-${index}`}
                    className={[
                      "min-h-[168px] rounded-[1.4rem] border border-[rgba(255,196,232,0.2)] p-5 shadow-[0_24px_62px_-26px_rgba(36,4,28,0.94)] backdrop-blur-[18px]",
                      CARD_SURFACES[index % CARD_SURFACES.length],
                    ].join(" ")}
                  >
                    <div className="space-y-3 text-left">
                      <p className="text-2xl font-bold leading-tight text-[#fff0fb]">
                        {entry.ka}
                      </p>
                      <p className="text-base font-medium text-[rgba(255,232,245,0.9)]">
                        {entry.la}
                      </p>
                      <p className="text-sm leading-relaxed text-[rgba(255,211,239,0.9)]">
                        {entry.en}
                      </p>
                    </div>
                  </article>
                ))}
              </CardGrid>
            </section>
          ) : null}
        </div>
      </div>
    </main>
  );
}
