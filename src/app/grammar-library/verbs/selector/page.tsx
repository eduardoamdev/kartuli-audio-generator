import Button from "@/components/ui/Button";
import CardGridPageShell from "@/components/features/CardGridPageShell";
import CardGrid from "@/components/ui/CardGrid";
import { DATA_FOLDERS } from "@/utils/constants";
import { getNamesOfFolderDataFiles } from "@/utils/getDataFoldersAndFiles";
import { formatFolderOrFileName } from "@/utils/formatFolderOrFileName";

const CARD_VARIANTS = ["blue", "purple", "teal"] as const;

export default async function VerbsSelectorPage() {
  const fileNames = await getNamesOfFolderDataFiles(DATA_FOLDERS.VERBS);

  return (
    <CardGridPageShell title="Choose a verbs topic" icon="🗣️">
      <section className="space-y-4">
        <CardGrid>
          {fileNames.map((fileName, index) => (
            <Button
              key={fileName}
              type="button"
              disabled
              variant={CARD_VARIANTS[index % CARD_VARIANTS.length]}
              icon={String(index + 1).padStart(2, "0")}
              eyebrow="Data file"
              description={fileName}
              className="h-full min-h-[148px] items-start opacity-80"
            >
              {formatFolderOrFileName(fileName)}
            </Button>
          ))}
        </CardGrid>
      </section>
    </CardGridPageShell>
  );
}
