import Button from "@/components/ui/Button";
import CardGridPageShell from "@/components/features/CardGridPageShell";
import type {
  SearchParamValue,
  SearchParamsPageProps,
} from "@/types/searchParams";
import { formatFolderOrFileName } from "@/utils/formatFolderOrFileName";
import {
  getNamesOfDataFolders,
  getNamesOfFolderDataFiles,
} from "@/utils/getDataFoldersAndFiles";
import { getSingleSearchParam } from "@/utils/getSingleSearchParam";

type AudioGeneratorSearchParams = {
  age?: SearchParamValue;
  level?: SearchParamValue;
  details?: SearchParamValue;
} & Record<string, SearchParamValue | undefined>;

const getMultiValueSearchParam = (
  value: SearchParamValue | undefined,
): string[] => {
  if (typeof value === "string") {
    return value ? [value] : [];
  }

  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  return [];
};

export default async function AudioGeneratorPage({
  searchParams,
}: SearchParamsPageProps<AudioGeneratorSearchParams>) {
  const resolvedSearchParams = await searchParams;
  const folderNames = await getNamesOfDataFolders();
  const age = getSingleSearchParam(resolvedSearchParams.age) ?? "";
  const level = getSingleSearchParam(resolvedSearchParams.level) ?? "";
  const details = getSingleSearchParam(resolvedSearchParams.details) ?? "";

  const foldersWithFiles = await Promise.all(
    folderNames.map(async (folderName) => {
      const fileNames = await getNamesOfFolderDataFiles(folderName);
      const selectedFileNames = getMultiValueSearchParam(
        resolvedSearchParams[folderName],
      ).filter((fileName) => fileNames.includes(fileName));

      return {
        folderName,
        fileNames,
        selectedFileNames,
      };
    }),
  );

  const totalSelectedFiles = foldersWithFiles.reduce(
    (count, folder) => count + folder.selectedFileNames.length,
    0,
  );

  const hasConfiguredBrief =
    Boolean(age) ||
    Boolean(level) ||
    Boolean(details) ||
    totalSelectedFiles > 0;

  return (
    <CardGridPageShell
      title="Build an audio generation brief"
      icon="🤖"
      showBackButton
      backHref="/"
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.75fr)]">
        <section className="rounded-[1.8rem] border border-[rgba(255,220,240,0.16)] bg-[rgba(33,6,27,0.5)] p-5 shadow-[0_24px_70px_rgba(24,2,19,0.36)] backdrop-blur-xl sm:p-6">
          <form className="space-y-6" method="get">
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#ffbde4]">
                Conversation setup
              </p>
              <p className="max-w-2xl text-sm leading-6 text-[rgba(255,232,245,0.82)]">
                Add learner details, describe the scenario, and choose the data
                files that should feed the generated conversation.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium text-[#fff0fb]">Age</span>
                <input
                  type="text"
                  name="age"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="off"
                  defaultValue={age}
                  placeholder="e.g. 12"
                  className="min-h-12 w-full rounded-[1rem] border border-[rgba(255,196,232,0.24)] bg-[rgba(255,232,245,0.08)] px-4 py-3 text-base text-[#fff7fd] outline-none transition focus:border-[rgba(255,215,239,0.46)] focus:bg-[rgba(255,232,245,0.12)]"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-[#fff0fb]">
                  Level
                </span>
                <input
                  type="text"
                  name="level"
                  defaultValue={level}
                  placeholder="e.g. beginner, A2, intermediate"
                  className="min-h-12 w-full rounded-[1rem] border border-[rgba(255,196,232,0.24)] bg-[rgba(255,232,245,0.08)] px-4 py-3 text-base text-[#fff7fd] outline-none transition focus:border-[rgba(255,215,239,0.46)] focus:bg-[rgba(255,232,245,0.12)]"
                />
              </label>
            </div>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-[#fff0fb]">
                Open information about the conversation
              </span>
              <textarea
                name="details"
                defaultValue={details}
                rows={5}
                placeholder="Describe the situation, tone, goal, speakers, or any constraints for the generated conversation."
                className="min-h-36 w-full rounded-[1rem] border border-[rgba(255,196,232,0.24)] bg-[rgba(255,232,245,0.08)] px-4 py-3 text-base leading-6 text-[#fff7fd] outline-none transition focus:border-[rgba(255,215,239,0.46)] focus:bg-[rgba(255,232,245,0.12)]"
              />
            </label>

            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#ffbde4]">
                  Data sources
                </p>
                <p className="text-sm leading-6 text-[rgba(255,232,245,0.82)]">
                  Each folder gets its own multi-select. Use Ctrl or Cmd while
                  clicking to keep multiple files selected.
                </p>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                {foldersWithFiles.map(
                  ({ folderName, fileNames, selectedFileNames }) => (
                    <label
                      key={folderName}
                      className="block space-y-2 rounded-[1.4rem] border border-[rgba(255,220,240,0.14)] bg-[rgba(255,255,255,0.04)] p-4"
                    >
                      <span className="flex items-center justify-between gap-3 text-sm font-medium text-[#fff0fb]">
                        <span>{formatFolderOrFileName(folderName)}</span>
                        <span className="rounded-full border border-[rgba(255,220,240,0.18)] bg-[rgba(255,232,245,0.08)] px-2.5 py-1 text-[0.68rem] uppercase tracking-[0.18em] text-[#ffc6e8]">
                          {selectedFileNames.length} selected
                        </span>
                      </span>
                      <select
                        name={folderName}
                        multiple
                        defaultValue={selectedFileNames}
                        size={Math.min(Math.max(fileNames.length, 4), 8)}
                        className="w-full rounded-[1rem] border border-[rgba(255,196,232,0.24)] bg-[rgba(255,232,245,0.08)] px-3 py-3 text-sm text-[#fff7fd] outline-none transition focus:border-[rgba(255,215,239,0.46)] focus:bg-[rgba(255,232,245,0.12)]"
                      >
                        {fileNames.map((fileName) => (
                          <option
                            key={`${folderName}-${fileName}`}
                            value={fileName}
                            className="bg-[#411134] text-[#fff7fd]"
                          >
                            {formatFolderOrFileName(fileName)}
                          </option>
                        ))}
                      </select>
                    </label>
                  ),
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button type="submit" variant="gradient" fullWidth={false}>
                Save brief
              </Button>
              <Button
                href="/audio-generator"
                variant="outline"
                fullWidth={false}
              >
                Clear form
              </Button>
            </div>
          </form>
        </section>

        <aside className="space-y-4 rounded-[1.8rem] border border-[rgba(255,220,240,0.16)] bg-[linear-gradient(180deg,rgba(66,14,54,0.72),rgba(39,7,31,0.64))] p-5 shadow-[0_24px_70px_rgba(24,2,19,0.36)] backdrop-blur-xl sm:p-6">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#ffbde4]">
              Current brief
            </p>
            <h2 className="text-2xl font-semibold text-[#fff4fc]">
              {hasConfiguredBrief
                ? "Ready to generate"
                : "Nothing selected yet"}
            </h2>
            <p className="text-sm leading-6 text-[rgba(255,232,245,0.82)]">
              {hasConfiguredBrief
                ? "These are the values currently stored in the page URL and ready for the next generation step."
                : "Fill out the form and save it to keep the request state in the URL."}
            </p>
          </div>

          <div className="space-y-3 text-sm text-[rgba(255,240,248,0.9)]">
            <div className="rounded-[1.2rem] border border-[rgba(255,220,240,0.14)] bg-[rgba(255,255,255,0.04)] p-4">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-[#ffbde4]">
                Learner
              </p>
              <p className="mt-2 text-base text-[#fff7fd]">
                {age || "No age provided"}
              </p>
              <p className="mt-1 text-base text-[#fff7fd]">
                {level || "No level provided"}
              </p>
            </div>

            <div className="rounded-[1.2rem] border border-[rgba(255,220,240,0.14)] bg-[rgba(255,255,255,0.04)] p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-[#ffbde4]">
                  Selected files
                </p>
                <span className="rounded-full border border-[rgba(255,220,240,0.18)] bg-[rgba(255,232,245,0.08)] px-2.5 py-1 text-[0.68rem] uppercase tracking-[0.18em] text-[#ffc6e8]">
                  {totalSelectedFiles} total
                </span>
              </div>

              <div className="mt-3 space-y-3">
                {foldersWithFiles.map(({ folderName, selectedFileNames }) => (
                  <div key={`summary-${folderName}`} className="space-y-1.5">
                    <p className="text-sm font-medium text-[#ffe6f5]">
                      {formatFolderOrFileName(folderName)}
                    </p>
                    <p className="text-sm leading-6 text-[rgba(255,232,245,0.82)]">
                      {selectedFileNames.length > 0
                        ? selectedFileNames
                            .map((fileName) => formatFolderOrFileName(fileName))
                            .join(", ")
                        : "No files selected."}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </CardGridPageShell>
  );
}
