import Button from "@/components/ui/Button";
import CardGridPageShell from "@/components/features/CardGridPageShell";
import CardGrid from "@/components/ui/CardGrid";
import { getNamesOfFolderDataFiles } from "@/utils/getDataFoldersAndFiles";
import { formatFolderOrFileName } from "@/utils/formatFolderOrFileName";
import { CARD_VARIANTS } from "@/utils/constants";
import { DATA_FOLDERS } from "@/utils/constants";

export default async function VocabularySelectorPage() {
  const fileNames = await getNamesOfFolderDataFiles(DATA_FOLDERS.VOCABULARY);

  return (
    <CardGridPageShell
      title="Choose a vocabulary topic"
      icon="🧠"
      showBackButton
      backHref="/grammar-library/selector"
    >
      <section className="space-y-4">
        <CardGrid>
          {fileNames.map((fileName, index) => (
            <Button
              key={fileName}
              href={`/grammar-library/vocabulary?filename=${encodeURIComponent(fileName)}`}
              variant={CARD_VARIANTS[index % CARD_VARIANTS.length]}
              description={fileName}
              className="h-full min-h-[148px] items-start"
            >
              {formatFolderOrFileName(fileName)}
            </Button>
          ))}
        </CardGrid>
      </section>
    </CardGridPageShell>
  );
}
