import Button from "@/components/ui/Button";
import CardGridPageShell from "@/components/features/CardGridPageShell";
import CardGrid from "@/components/ui/CardGrid";
import { DATA_FOLDERS, CARD_VARIANTS } from "@/utils/constants";
import { getNamesOfFolderDataFiles } from "@/utils/getDataFoldersAndFiles";
import { formatFolderOrFileName } from "@/utils/formatFolderOrFileName";

export default async function FunctionWordsSelectorPage() {
  const fileNames = await getNamesOfFolderDataFiles(
    DATA_FOLDERS.FUNCTION_WORDS,
  );

  return (
    <CardGridPageShell
      title="Choose a function words topic"
      icon="🧩"
      showBackButton
      backHref="/grammar-library/selector"
    >
      <section className="space-y-4">
        <CardGrid>
          {fileNames.map((fileName, index) => (
            <Button
              key={fileName}
              href={`/grammar-library/function-words?filename=${encodeURIComponent(fileName)}`}
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
