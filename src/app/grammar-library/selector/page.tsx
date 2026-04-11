import Button from "@/components/ui/Button";
import CardGridPageShell from "@/components/features/CardGridPageShell";
import CardGrid from "@/components/ui/CardGrid";
import { getNamesOfDataFolders } from "@/utils/getDataFoldersAndFiles";
import { formatFolderOrFileName } from "@/utils/formatFolderOrFileName";
import { CARD_VARIANTS } from "@/utils/constants";

const getFolderHref = (folderName: string) =>
  `/grammar-library/${encodeURIComponent(folderName)}/selector`;

export default async function GrammarSelectorPage() {
  const folderNames = await getNamesOfDataFolders();

  return (
    <CardGridPageShell
      title="Choose a data section to browse the grammar library."
      icon="🔊"
    >
      <CardGrid>
        {folderNames.map((folderName, index) => (
          <Button
            key={folderName}
            href={getFolderHref(folderName)}
            variant={CARD_VARIANTS[index % CARD_VARIANTS.length]}
            description="Open this section and continue with the available cards."
            className="h-full min-h-[148px] items-start"
          >
            {formatFolderOrFileName(folderName)}
          </Button>
        ))}
      </CardGrid>
    </CardGridPageShell>
  );
}
