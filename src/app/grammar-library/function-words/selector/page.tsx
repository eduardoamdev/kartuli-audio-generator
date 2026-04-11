import Button from "@/components/ui/Button";
import ButtonGridPageShell from "@/components/features/ButtonGridPageShell";
import ButtonGrid from "@/components/ui/ButtonGrid";
import { DATA_FOLDERS, BUTTON_VARIANTS } from "@/utils/constants";
import { getNamesOfFolderDataFiles } from "@/utils/getDataFoldersAndFiles";
import { formatFolderOrFileName } from "@/utils/formatFolderOrFileName";

export default async function FunctionWordsSelectorPage() {
  const fileNames = await getNamesOfFolderDataFiles(
    DATA_FOLDERS.FUNCTION_WORDS,
  );

  return (
    <ButtonGridPageShell
      title="Choose a function words topic"
      icon="🧩"
      showBackButton
      backHref="/grammar-library/selector"
    >
      <section className="space-y-4">
        <ButtonGrid>
          {fileNames.map((fileName, index) => (
            <Button
              key={fileName}
              href={`/grammar-library/function-words?filename=${encodeURIComponent(fileName)}`}
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
