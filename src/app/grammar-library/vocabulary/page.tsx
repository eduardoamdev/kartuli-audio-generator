import ButtonGridPageShell from "@/components/features/ButtonGridPageShell";
import NonClickableButton from "@/components/features/NonClickableButton";
import ButtonGrid from "@/components/ui/ButtonGrid";
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
    <ButtonGridPageShell
      title={pageTitle}
      icon="🧠"
      showBackButton
      backHref="/grammar-library/vocabulary/selector"
    >
      {selectedFileName ? (
        <section className="space-y-4">
          <ButtonGrid>
            {vocabularyEntries.map((entry, index) => (
              <NonClickableButton
                key={`${selectedFileName}-${entry.ka}-${index}`}
                entry={entry}
                index={index}
              />
            ))}
          </ButtonGrid>
        </section>
      ) : null}
    </ButtonGridPageShell>
  );
}
