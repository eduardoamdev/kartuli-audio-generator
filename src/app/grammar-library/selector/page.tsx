import Button from "@/components/ui/Button";
import CardGrid from "@/components/ui/CardGrid";
import { getNamesOfDataFolders } from "@/utils/getDataFoldersAndFiles";
import { formatFolderName } from "@/utils/formatFolderName";

const CARD_VARIANTS = ["blue", "purple", "teal"] as const;

export default async function GrammarSelectorPage() {
  const folderNames = await getNamesOfDataFolders();

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(244,114,182,0.34),_transparent_34%),radial-gradient(circle_at_82%_16%,_rgba(196,132,252,0.28),_transparent_30%),radial-gradient(circle_at_bottom,_rgba(217,70,239,0.24),_transparent_38%)]" />
      <div className="absolute left-1/2 top-24 h-96 w-96 -translate-x-1/2 rounded-full bg-[rgba(244,114,182,0.22)] blur-3xl" />
      <div className="absolute right-[-4rem] top-20 h-72 w-72 rounded-full bg-[rgba(168,85,247,0.18)] blur-3xl" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl items-start px-5 pb-10 pt-3 sm:px-8 sm:pt-45 lg:px-10">
        <div className="w-full space-y-8 rounded-[2rem] border border-[rgba(255,220,240,0.18)] bg-[linear-gradient(180deg,rgba(59,10,49,0.92),rgba(71,15,59,0.8))] p-6 shadow-[0_30px_120px_rgba(36,2,24,0.68)] backdrop-blur-xl sm:p-8">
          <div className="inline-flex items-center gap-3 rounded-full border border-[rgba(255,220,240,0.2)] bg-[rgba(255,227,243,0.1)] px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[#ffd3ef] backdrop-blur-md">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(255,220,240,0.18)] bg-[rgba(255,232,245,0.12)] text-base text-[#fff3fd]">
              🔊
            </span>
            Choose a data section to browse the grammar library.
          </div>

          <CardGrid>
            {folderNames.map((folderName, index) => (
              <Button
                key={folderName}
                href={`?folder=${encodeURIComponent(folderName)}`}
                variant={CARD_VARIANTS[index % CARD_VARIANTS.length]}
                icon={String(index + 1).padStart(2, "0")}
                eyebrow="Data folder"
                description="Open this section and continue with the available cards."
                className="h-full min-h-[148px] items-start"
              >
                {formatFolderName(folderName)}
              </Button>
            ))}
          </CardGrid>
        </div>
      </div>
    </main>
  );
}
