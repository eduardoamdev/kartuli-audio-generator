import Button from "@/components/ui/Button";
import ButtonGridPageShell from "@/components/features/ButtonGridPageShell";
import ButtonGrid from "@/components/ui/ButtonGrid";
import { getNamesOfFolderDataFiles } from "@/utils/getDataFoldersAndFiles";
import { formatFolderOrFileName } from "@/utils/formatFolderOrFileName";
import { BUTTON_VARIANTS } from "@/utils/constants";
import { DATA_FOLDERS } from "@/utils/constants";

export default async function VocabularySelectorPage() {
  const fileNames = await getNamesOfFolderDataFiles(DATA_FOLDERS.VOCABULARY);

  return (
    <ButtonGridPageShell
      title="Choose a vocabulary topic"
      icon="🧠"
      showBackButton
      backHref="/grammar-library/selector"
    >
      <section className="space-y-4">
        <ButtonGrid>
          {fileNames.map((fileName, index) => (
            <Button
              key={fileName}
              href={`/grammar-library/vocabulary?filename=${encodeURIComponent(fileName)}`}
              variant={BUTTON_VARIANTS[index % BUTTON_VARIANTS.length]}
              description={fileName}
              className="h-full min-h-[148px] items-start"
            >
              {formatFolderOrFileName(fileName)}
            </Button>
          ))}
        </ButtonGrid>
      </section>
    </ButtonGridPageShell>
  );
}
