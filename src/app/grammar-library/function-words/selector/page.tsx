import Button from "@/components/ui/Button";
import CardGridPageShell from "@/components/features/CardGridPageShell";
import CardGrid from "@/components/ui/CardGrid";
import { DATA_FOLDERS } from "@/utils/constants";
import { getNamesOfFolderDataFiles } from "@/utils/getDataFoldersAndFiles";
import { formatFolderOrFileName } from "@/utils/formatFolderOrFileName";

const CARD_VARIANTS = ["blue", "purple", "teal"] as const;

export default async function FunctionWordsSelectorPage() {
  const fileNames = await getNamesOfFolderDataFiles(
    DATA_FOLDERS.FUNCTION_WORDS,
  );

  return (
    <CardGridPageShell title="Choose a function words topic" icon="🧩">
      <section className="space-y-4">
        <CardGrid>
          {fileNames.map((fileName, index) => (
            <Button
              key={fileName}
              href={`/grammar-library/function-words?filename=${encodeURIComponent(fileName)}`}
              variant={CARD_VARIANTS[index % CARD_VARIANTS.length]}
              icon={String(index + 1).padStart(2, "0")}
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
