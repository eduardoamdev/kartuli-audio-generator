import Button from "@/components/ui/Button";
import CardGridPageShell from "@/components/features/CardGridPageShell";
import CardGrid from "@/components/ui/CardGrid";
import { DATA_FOLDERS } from "@/utils/constants";
import { getNamesOfFolderDataFiles } from "@/utils/getDataFoldersAndFiles";
import { formatFolderOrFileName } from "@/utils/formatFolderOrFileName";
import { CARD_VARIANTS } from "@/utils/constants";

export default async function VerbsSelectorPage() {
  const fileNames = await getNamesOfFolderDataFiles(DATA_FOLDERS.VERBS);

  return (
    <CardGridPageShell
      title="Choose a verbs topic"
      icon="🗣️"
      showBackButton
      backHref="/grammar-library/selector"
    >
      <section className="space-y-4">
        <CardGrid>
          {fileNames.map((fileName, index) => (
            <Button
              key={fileName}
              type="button"
              href={`/grammar-library/verbs?name=${fileName}`}
              variant={CARD_VARIANTS[index % CARD_VARIANTS.length]}
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
