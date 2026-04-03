import CardGridPageShell from "@/components/features/CardGridPageShell";
import NonClickableCard from "@/components/features/NonClickableCard";
import CardGrid from "@/components/ui/CardGrid";
import type {
  FilenameSearchParams,
  SearchParamsPageProps,
} from "@/types/searchParams";
import { extractVocabularyEntriesFromDataFile } from "@/utils/extractVocabularyEntriesFromDataFile";
import { getNamesOfFolderDataFiles } from "@/utils/getDataFoldersAndFiles";
import { formatFolderOrFileName } from "@/utils/formatFolderOrFileName";
import { getSingleSearchParam } from "@/utils/getSingleSearchParam";
import { DATA_FOLDERS } from "@/utils/constants";

export default async function VocabularyPage({
  searchParams,
}: SearchParamsPageProps<FilenameSearchParams>) {
  const fileNames = await getNamesOfFolderDataFiles(DATA_FOLDERS.VOCABULARY);
  const resolvedSearchParams = await searchParams;
  const requestedFileName = getSingleSearchParam(resolvedSearchParams.filename);
  const selectedFileName =
    requestedFileName && fileNames.includes(requestedFileName)
      ? requestedFileName
      : null;

  const vocabularyEntries = selectedFileName
    ? await extractVocabularyEntriesFromDataFile({
        folder: DATA_FOLDERS.VOCABULARY,
        filename: selectedFileName,
      })
    : [];

  const pageTitle = selectedFileName
    ? `Words in ${formatFolderOrFileName(selectedFileName)}`
    : "Choose a vocabulary file";

  return (
    <CardGridPageShell
      title={pageTitle}
      icon="🧠"
      showBackButton
      backHref="/grammar-library/vocabulary/selector"
    >
      {selectedFileName ? (
        <section className="space-y-4">
          <CardGrid>
            {vocabularyEntries.map((entry, index) => (
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
