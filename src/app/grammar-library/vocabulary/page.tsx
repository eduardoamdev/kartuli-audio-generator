import CardGridPageShell from "@/components/features/CardGridPageShell";
import NonClickableCard from "@/components/features/NonClickableCard";
import CardGrid from "@/components/ui/CardGrid";
import type {
  FilenameSearchParams,
  SearchParamsPageProps,
} from "@/types/searchParams";
import { DATA_FOLDERS } from "@/utils/constants";
import { getSelectedWordEntries } from "@/utils/getSelectedWordEntries";
import { composePageTitle } from "@/utils/composePageTitle";

export default async function VocabularyPage({
  searchParams,
}: SearchParamsPageProps<FilenameSearchParams>) {
  const { entries: vocabularyEntries, selectedFileName } =
    await getSelectedWordEntries({
      folder: DATA_FOLDERS.VOCABULARY,
      searchParams,
    });

  const pageTitle = composePageTitle(selectedFileName);

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
