"use client";

import { useEffect, useState } from "react";

import Button from "@/components/ui/Button";
import CardGridPageShell from "@/components/features/CardGridPageShell";
import { formatFolderOrFileName } from "@/utils/formatFolderOrFileName";

type FolderWithFiles = {
  folderName: string;
  fileNames: string[];
};

type AudioGeneratorFormState = {
  age: string;
  level: string;
  details: string;
  selectedFilesByFolder: Record<string, string[]>;
};

type SavedAudioBrief = AudioGeneratorFormState & {
  totalSelectedFiles: number;
};

type AudioGeneratorOptionsResponse = {
  foldersWithFiles: FolderWithFiles[];
  message?: string;
};

const buildEmptySelections = (
  foldersWithFiles: FolderWithFiles[],
): Record<string, string[]> =>
  Object.fromEntries(
    foldersWithFiles.map(({ folderName }) => [folderName, []]),
  );

const sanitizeSelections = (
  foldersWithFiles: FolderWithFiles[],
  selectedFilesByFolder: Record<string, string[]>,
): Record<string, string[]> =>
  Object.fromEntries(
    foldersWithFiles.map(({ folderName, fileNames }) => [
      folderName,
      (selectedFilesByFolder[folderName] ?? []).filter((fileName) =>
        fileNames.includes(fileName),
      ),
    ]),
  );

const buildSavedBrief = (
  formState: AudioGeneratorFormState,
  foldersWithFiles: FolderWithFiles[],
): SavedAudioBrief => {
  const selectedFilesByFolder = sanitizeSelections(
    foldersWithFiles,
    formState.selectedFilesByFolder,
  );
  const totalSelectedFiles = Object.values(selectedFilesByFolder).reduce(
    (count, selectedFiles) => count + selectedFiles.length,
    0,
  );

  return {
    age: formState.age,
    level: formState.level,
    details: formState.details,
    selectedFilesByFolder,
    totalSelectedFiles,
  };
};

const defaultFormState: AudioGeneratorFormState = {
  age: "",
  level: "",
  details: "",
  selectedFilesByFolder: {},
};

export default function AudioGeneratorPage() {
  const [foldersWithFiles, setFoldersWithFiles] = useState<FolderWithFiles[]>(
    [],
  );
  const [formState, setFormState] =
    useState<AudioGeneratorFormState>(defaultFormState);
  const [savedBrief, setSavedBrief] = useState<SavedAudioBrief | null>(null);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const loadOptions = async () => {
      try {
        const response = await fetch("/api/audio-generator/options");

        if (!response.ok) {
          throw new Error("Failed to load audio generator data sources.");
        }

        const data = (await response.json()) as AudioGeneratorOptionsResponse;

        if (isCancelled) {
          return;
        }

        setFoldersWithFiles(data.foldersWithFiles);
        setFormState((current) => ({
          ...current,
          selectedFilesByFolder: sanitizeSelections(
            data.foldersWithFiles,
            Object.keys(current.selectedFilesByFolder).length > 0
              ? current.selectedFilesByFolder
              : buildEmptySelections(data.foldersWithFiles),
          ),
        }));
        setLoadError(null);
      } catch (error) {
        if (isCancelled) {
          return;
        }

        setLoadError(
          error instanceof Error
            ? error.message
            : "Failed to load audio generator data sources.",
        );
      } finally {
        if (!isCancelled) {
          setIsLoadingOptions(false);
        }
      }
    };

    void loadOptions();

    return () => {
      isCancelled = true;
    };
  }, []);

  const handleAgeChange = (value: string) => {
    setFormState((current) => ({
      ...current,
      age: value.replace(/\D+/gu, ""),
    }));
  };

  const handleLevelChange = (value: string) => {
    setFormState((current) => ({
      ...current,
      level: value,
    }));
  };

  const handleDetailsChange = (value: string) => {
    setFormState((current) => ({
      ...current,
      details: value,
    }));
  };

  const handleFolderSelectionChange = (
    folderName: string,
    selectedFileNames: string[],
  ) => {
    setFormState((current) => ({
      ...current,
      selectedFilesByFolder: {
        ...current.selectedFilesByFolder,
        [folderName]: selectedFileNames,
      },
    }));
  };

  const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextSavedBrief = buildSavedBrief(formState, foldersWithFiles);
    setSavedBrief(nextSavedBrief);
    console.log(nextSavedBrief);
  };

  const handleClear = () => {
    setFormState({
      ...defaultFormState,
      selectedFilesByFolder: buildEmptySelections(foldersWithFiles),
    });
    setSavedBrief(null);
  };

  const hasSavedBrief =
    savedBrief !== null &&
    (Boolean(savedBrief.age) ||
      Boolean(savedBrief.level) ||
      Boolean(savedBrief.details) ||
      savedBrief.totalSelectedFiles > 0);

  const totalSelectedFiles = savedBrief?.totalSelectedFiles ?? 0;

  return (
    <CardGridPageShell
      title="Build an audio generation brief"
      icon="🤖"
      showBackButton
      backHref="/"
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.75fr)]">
        <section className="rounded-[1.8rem] border border-[rgba(255,220,240,0.16)] bg-[rgba(33,6,27,0.5)] p-5 shadow-[0_24px_70px_rgba(24,2,19,0.36)] backdrop-blur-xl sm:p-6">
          <form className="space-y-6" onSubmit={handleSave}>
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#ffbde4]">
                Conversation setup
              </p>
              <p className="max-w-2xl text-sm leading-6 text-[rgba(255,232,245,0.82)]">
                Add learner details, describe the scenario, and choose the data
                files that should feed the generated conversation. Saving keeps
                everything in local component state and logs the same payload to
                the console.
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
                  value={formState.age}
                  onChange={(event) => handleAgeChange(event.target.value)}
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
                  value={formState.level}
                  onChange={(event) => handleLevelChange(event.target.value)}
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
                value={formState.details}
                onChange={(event) => handleDetailsChange(event.target.value)}
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

              {loadError ? (
                <div className="rounded-[1.4rem] border border-[rgba(255,140,174,0.28)] bg-[rgba(90,15,43,0.34)] p-4 text-sm leading-6 text-[#ffd7e7]">
                  {loadError}
                </div>
              ) : null}

              <div className="grid gap-4 lg:grid-cols-2">
                {foldersWithFiles.map(({ folderName, fileNames }) => (
                  <label
                    key={folderName}
                    className="block space-y-2 rounded-[1.4rem] border border-[rgba(255,220,240,0.14)] bg-[rgba(255,255,255,0.04)] p-4"
                  >
                    {(() => {
                      const selectedFileNames =
                        formState.selectedFilesByFolder[folderName] ?? [];

                      return (
                        <>
                          <span className="flex items-center justify-between gap-3 text-sm font-medium text-[#fff0fb]">
                            <span>{formatFolderOrFileName(folderName)}</span>
                            <span className="rounded-full border border-[rgba(255,220,240,0.18)] bg-[rgba(255,232,245,0.08)] px-2.5 py-1 text-[0.68rem] uppercase tracking-[0.18em] text-[#ffc6e8]">
                              {selectedFileNames.length} selected
                            </span>
                          </span>
                          <select
                            name={folderName}
                            multiple
                            value={selectedFileNames}
                            onChange={(event) =>
                              handleFolderSelectionChange(
                                folderName,
                                Array.from(
                                  event.currentTarget.selectedOptions,
                                  (option) => option.value,
                                ),
                              )
                            }
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
                        </>
                      );
                    })()}
                  </label>
                ))}
              </div>

              {isLoadingOptions ? (
                <p className="text-sm leading-6 text-[rgba(255,232,245,0.72)]">
                  Loading available data folders...
                </p>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                type="submit"
                variant="gradient"
                fullWidth={false}
                disabled={isLoadingOptions || Boolean(loadError)}
                className="disabled:cursor-not-allowed disabled:opacity-60"
              >
                Save brief
              </Button>
              <Button
                type="button"
                variant="outline"
                fullWidth={false}
                onClick={handleClear}
              >
                Clear form
              </Button>
            </div>
          </form>
        </section>

        <aside className="space-y-4 rounded-[1.8rem] border border-[rgba(255,220,240,0.16)] bg-[linear-gradient(180deg,rgba(66,14,54,0.72),rgba(39,7,31,0.64))] p-5 shadow-[0_24px_70px_rgba(24,2,19,0.36)] backdrop-blur-xl sm:p-6">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#ffbde4]">
              Saved brief
            </p>
            <h2 className="text-2xl font-semibold text-[#fff4fc]">
              {hasSavedBrief ? "Ready to generate" : "Nothing saved yet"}
            </h2>
            <p className="text-sm leading-6 text-[rgba(255,232,245,0.82)]">
              {hasSavedBrief
                ? "These are the values saved from the form and logged to the console on the last save action."
                : "Fill out the form and press Save brief to store the payload in component state."}
            </p>
          </div>

          <div className="space-y-3 text-sm text-[rgba(255,240,248,0.9)]">
            <div className="rounded-[1.2rem] border border-[rgba(255,220,240,0.14)] bg-[rgba(255,255,255,0.04)] p-4">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-[#ffbde4]">
                Learner
              </p>
              <p className="mt-2 text-base text-[#fff7fd]">
                {savedBrief?.age || "No age provided"}
              </p>
              <p className="mt-1 text-base text-[#fff7fd]">
                {savedBrief?.level || "No level provided"}
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
                {foldersWithFiles.map(({ folderName }) => {
                  const selectedFileNames =
                    savedBrief?.selectedFilesByFolder[folderName] ?? [];

                  return (
                    <div key={`summary-${folderName}`} className="space-y-1.5">
                      <p className="text-sm font-medium text-[#ffe6f5]">
                        {formatFolderOrFileName(folderName)}
                      </p>
                      <p className="text-sm leading-6 text-[rgba(255,232,245,0.82)]">
                        {selectedFileNames.length > 0
                          ? selectedFileNames
                              .map((fileName) =>
                                formatFolderOrFileName(fileName),
                              )
                              .join(", ")
                          : "No files selected."}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </CardGridPageShell>
  );
}
