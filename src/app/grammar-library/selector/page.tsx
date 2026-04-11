import Button from "@/components/ui/Button";
import ButtonGridPageShell from "@/components/features/ButtonGridPageShell";
import ButtonGrid from "@/components/ui/ButtonGrid";
import { getNamesOfDataFolders } from "@/utils/getDataFoldersAndFiles";
import { formatFolderOrFileName } from "@/utils/formatFolderOrFileName";
import { BUTTON_VARIANTS } from "@/utils/constants";

const getFolderHref = (folderName: string) =>
  `/grammar-library/${encodeURIComponent(folderName)}/selector`;

export default async function GrammarSelectorPage() {
  const folderNames = await getNamesOfDataFolders();

  return (
    <ButtonGridPageShell
      title="Choose a data section to browse the grammar library."
      icon="🔊"
      showBackButton
      backHref="/"
    >
      <ButtonGrid>
        {folderNames.map((folderName, index) => (
          <Button
            key={folderName}
            href={getFolderHref(folderName)}
            variant={BUTTON_VARIANTS[index % BUTTON_VARIANTS.length]}
            className="h-full min-h-[148px] items-start"
          >
            {formatFolderOrFileName(folderName)}
          </Button>
        ))}
      </ButtonGrid>
    </ButtonGridPageShell>
  );
}
