import CardGridPageShell from "@/components/features/CardGridPageShell";
import CardGrid from "@/components/ui/CardGrid";
import type {
  FilenameSearchParams,
  SearchParamsPageProps,
} from "@/types/searchParams";
import { extractVocabularyEntriesFromDataFile } from "@/utils/extractVocabularyEntriesFromDataFile";
import { getNamesOfFolderDataFiles } from "@/utils/getDataFoldersAndFiles";
import { formatFolderOrFileName } from "@/utils/formatFolderOrFileName";
import { getSingleSearchParam } from "@/utils/getSingleSearchParam";
import { DATA_FOLDERS, CARD_SURFACES } from "@/utils/constants";

export default async function VocabularyPage({
  searchParams,
}: SearchParamsPageProps<FilenameSearchParams>) {
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

  const pageTitle = selectedFileName
    ? `Words in ${formatFolderOrFileName(selectedFileName)}`
    : "Choose a vocabulary file";

  return (
    <CardGridPageShell
      title={pageTitle}
      icon="🧠"
      showBackButton
      backHref="/grammar-library/vocabulary/selector"
    >
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
    </CardGridPageShell>
  );
}
