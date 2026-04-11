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

export default async function FunctionWordsPage({
  searchParams,
}: SearchParamsPageProps<FilenameSearchParams>) {
  const { entries: functionWordEntries, selectedFileName } =
    await getSelectedWordEntries({
      folder: DATA_FOLDERS.FUNCTION_WORDS,
      searchParams,
    });

  const pageTitle = composePageTitle(selectedFileName);

  return (
    <ButtonGridPageShell
      title={pageTitle}
      icon="🧩"
      showBackButton
      backHref="/grammar-library/function-words/selector"
    >
      {selectedFileName ? (
        <section className="space-y-4">
          <ButtonGrid>
            {functionWordEntries.map((entry, index) => (
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
