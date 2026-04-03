import CardGridPageShell from "@/components/features/CardGridPageShell";
import NonClickableCard from "@/components/features/NonClickableCard";
import CardGrid from "@/components/ui/CardGrid";
import type {
  FilenameSearchParams,
  SearchParamsPageProps,
} from "@/types/searchParams";
import { extractVocabularyEntriesFromDataFile } from "@/utils/extractVocabularyEntriesFromDataFile";
import { DATA_FOLDERS } from "@/utils/constants";
import { formatFolderOrFileName } from "@/utils/formatFolderOrFileName";
import { getNamesOfFolderDataFiles } from "@/utils/getDataFoldersAndFiles";
import { getSingleSearchParam } from "@/utils/getSingleSearchParam";

export default async function FunctionWordsPage({
  searchParams,
}: SearchParamsPageProps<FilenameSearchParams>) {
  const fileNames = await getNamesOfFolderDataFiles(
    DATA_FOLDERS.FUNCTION_WORDS,
  );

  const resolvedSearchParams = await searchParams;

  const requestedFileName = getSingleSearchParam(resolvedSearchParams.filename);

  const selectedFileName =
    requestedFileName && fileNames.includes(requestedFileName)
      ? requestedFileName
      : null;

  const functionWordEntries = selectedFileName
    ? await extractVocabularyEntriesFromDataFile({
        folder: DATA_FOLDERS.FUNCTION_WORDS,
        filename: selectedFileName,
      })
    : [];

  const pageTitle = selectedFileName
    ? `Words in ${formatFolderOrFileName(selectedFileName)}`
    : "Choose a function words file";

  return (
    <CardGridPageShell
      title={pageTitle}
      icon="🧩"
      showBackButton
      backHref="/grammar-library/function-words/selector"
    >
      {selectedFileName ? (
        <section className="space-y-4">
          <CardGrid>
            {functionWordEntries.map((entry, index) => (
              <NonClickableCard
                key={`${selectedFileName}-${entry.ka}-${index}`}
                entry={entry}
                index={index}
              />
            ))}
          </CardGrid>
        </section>
      ) : null}
    </CardGridPageShell>
  );
}
