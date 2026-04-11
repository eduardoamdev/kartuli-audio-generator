import Button from "@/components/ui/Button";
import ButtonGridPageShell from "@/components/features/ButtonGridPageShell";
import ButtonGrid from "@/components/ui/ButtonGrid";
import { DATA_FOLDERS } from "@/utils/constants";
import { getNamesOfFolderDataFiles } from "@/utils/getDataFoldersAndFiles";
import { formatFolderOrFileName } from "@/utils/formatFolderOrFileName";
import { BUTTON_VARIANTS } from "@/utils/constants";

export default async function VerbsSelectorPage() {
  const fileNames = await getNamesOfFolderDataFiles(DATA_FOLDERS.VERBS);

  return (
    <ButtonGridPageShell
      title="Choose a verbs topic"
      icon="🗣️"
      showBackButton
      backHref="/grammar-library/selector"
    >
      <section className="space-y-4">
        <ButtonGrid>
          {fileNames.map((fileName, index) => (
            <Button
              key={fileName}
              type="button"
              href={`/grammar-library/verbs?name=${fileName}`}
              variant={BUTTON_VARIANTS[index % BUTTON_VARIANTS.length]}
              description={fileName}
              className="h-full min-h-[148px] items-start opacity-80"
            >
              {formatFolderOrFileName(fileName)}
            </Button>
          ))}
        </ButtonGrid>
      </section>
    </ButtonGridPageShell>
  );
}
