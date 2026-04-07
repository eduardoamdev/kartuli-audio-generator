"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import CardGridPageShell from "@/components/features/CardGridPageShell";
import type {
  GeneratedDialogueEntry,
  GeneratedMessage,
  GeneratedTextResult,
} from "@/types/audioGenerator";
import { SPEECH_TYPES } from "@/utils/constants";
import { formatFolderOrFileName } from "@/utils/formatFolderOrFileName";

type FolderWithFiles = {
  folderName: string;
  fileNames: string[];
};

type SpeechType = (typeof SPEECH_TYPES)[keyof typeof SPEECH_TYPES];

type AudioGeneratorFormState = {
  age: string;
  level: string;
  typeOfSpeech: SpeechType | "";
  details: string;
  selectedFilesByFolder: Record<string, string[]>;
};

type AudioGeneratorOptionsResponse = {
  foldersWithFiles: FolderWithFiles[];
  message?: string;
};

type AudioGeneratorResponse = {
  success: boolean;
  message?: string;
  result?: GeneratedTextResult;
};

type AudioGeneratorPdfResponse = {
  success: boolean;
  message?: string;
};

const LEVEL_OPTIONS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;

const SPEECH_TYPE_OPTIONS = Object.values(SPEECH_TYPES);

const buildEmptySelections = (
  foldersWithFiles: FolderWithFiles[],
): Record<string, string[]> =>
  Object.fromEntries(
    foldersWithFiles.map(({ folderName }) => [folderName, []]),
  );

const buildGenerationPayload = (
  formState: AudioGeneratorFormState,
): AudioGeneratorFormState => {
  return {
    age: formState.age,
    level: formState.level,
    typeOfSpeech: formState.typeOfSpeech,
    details: formState.details,
    selectedFilesByFolder: formState.selectedFilesByFolder,
  };
};

const defaultFormState: AudioGeneratorFormState = {
  age: "",
  level: "",
  typeOfSpeech: "",
  details: "",
  selectedFilesByFolder: {},
};

const formatGeneratedMessage = (
  message: GeneratedMessage | undefined,
): string => {
  return [message?.ka, message?.la, message?.en]
    .filter(
      (value): value is string =>
        typeof value === "string" && value.trim().length > 0,
    )
    .join("\n\n");
};

const getGeneratedMessageSections = (
  message: GeneratedMessage | undefined,
): string[] => {
  return [message?.ka, message?.la, message?.en].filter(
    (value): value is string =>
      typeof value === "string" && value.trim().length > 0,
  );
};

const formatSpeakerLabel = (speaker: string | undefined): string => {
  const normalizedSpeaker = speaker?.trim();

  if (!normalizedSpeaker) {
    return "Speaker";
  }

  if (/^speaker\b/iu.test(normalizedSpeaker)) {
    return normalizedSpeaker;
  }

  return `Speaker ${normalizedSpeaker}`;
};

const formatDialogueEntry = (entry: GeneratedDialogueEntry): string => {
  const formattedMessage = formatGeneratedMessage(entry.message);

  if (!formattedMessage) {
    return "";
  }

  return `${formatSpeakerLabel(entry.speaker)}\n\n${formattedMessage}`;
};

const formatGeneratedResultForDisplay = (
  result: GeneratedTextResult | null | undefined,
): string => {
  if (Array.isArray(result?.conversation)) {
    return result.conversation
      .map(formatDialogueEntry)
      .filter((entry) => entry.length > 0)
      .join("\n\n\n");
  }

  if (result?.monologue) {
    return formatGeneratedMessage(result.monologue.message);
  }

  return "";
};

export default function AudioGeneratorPage() {
  const [hasMounted, setHasMounted] = useState(false);
  const [foldersWithFiles, setFoldersWithFiles] = useState<FolderWithFiles[]>(
    [],
  );
  const [formState, setFormState] =
    useState<AudioGeneratorFormState>(defaultFormState);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloadingMp3, setIsDownloadingMp3] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [generationMessage, setGenerationMessage] = useState<string | null>(
    null,
  );
  const [generatedResult, setGeneratedResult] =
    useState<GeneratedTextResult | null>(null);
  const [hasSuccessfulResponse, setHasSuccessfulResponse] = useState(false);
  const monologueMessageSections = getGeneratedMessageSections(
    generatedResult?.monologue?.message,
  );

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    let isCancelled = false;

    const loadOptions = async () => {
      try {
        const response = await fetch("/api/audio/options");

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
          selectedFilesByFolder:
            Object.keys(current.selectedFilesByFolder).length > 0
              ? current.selectedFilesByFolder
              : buildEmptySelections(data.foldersWithFiles),
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
    setGenerationError(null);
    setGenerationMessage(null);
    setGeneratedResult(null);
    setHasSuccessfulResponse(false);
  };

  const handleLevelChange = (value: string) => {
    setFormState((current) => ({
      ...current,
      level: value,
    }));
    setGenerationError(null);
    setGenerationMessage(null);
    setGeneratedResult(null);
    setHasSuccessfulResponse(false);
  };

  const handleTypeOfSpeechChange = (value: SpeechType | "") => {
    setFormState((current) => ({
      ...current,
      typeOfSpeech: value,
    }));
    setGenerationError(null);
    setGenerationMessage(null);
    setGeneratedResult(null);
    setHasSuccessfulResponse(false);
  };

  const handleDetailsChange = (value: string) => {
    setFormState((current) => ({
      ...current,
      details: value,
    }));
    setGenerationError(null);
    setGenerationMessage(null);
    setGeneratedResult(null);
    setHasSuccessfulResponse(false);
  };

  const handleFolderFileToggle = (
    folderName: string,
    fileName: string,
    folderFileNames: string[],
    isSelected: boolean,
  ) => {
    setFormState((current) => {
      const selectedFileNames = current.selectedFilesByFolder[folderName] ?? [];

      const nextSelectedFileNames = new Set(selectedFileNames);

      if (isSelected) {
        nextSelectedFileNames.add(fileName);
      } else {
        nextSelectedFileNames.delete(fileName);
      }

      return {
        ...current,
        selectedFilesByFolder: {
          ...current.selectedFilesByFolder,
          [folderName]: folderFileNames.filter((candidateFileName) =>
            nextSelectedFileNames.has(candidateFileName),
          ),
        },
      };
    });

    setGenerationError(null);

    setGenerationMessage(null);

    setGeneratedResult(null);

    setHasSuccessfulResponse(false);
  };

  const handleDownloadMp3 = async () => {
    if (!generatedResult) {
      setGenerationError("No generated text is available for MP3 generation.");
      return;
    }

    setGenerationError(null);
    setIsDownloadingMp3(true);

    try {
      const response = await fetch("/api/audio/generator/mp3", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          result: generatedResult,
        }),
      });

      if (!response.ok) {
        const data = (await response.json()) as AudioGeneratorPdfResponse;

        throw new Error(data.message || "Failed to generate MP3.");
      }

      const mp3Blob = await response.blob();
      const mp3Url = window.URL.createObjectURL(mp3Blob);
      const downloadLink = document.createElement("a");

      downloadLink.href = mp3Url;
      downloadLink.download = "audio-generator.mp3";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.remove();
      window.URL.revokeObjectURL(mp3Url);
    } catch (error) {
      setGenerationError(
        error instanceof Error ? error.message : "Failed to generate MP3.",
      );
    } finally {
      setIsDownloadingMp3(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!generationMessage && !generatedResult) {
      setGenerationError("No generated text is available for PDF generation.");
      return;
    }

    setGenerationError(null);
    setIsDownloadingPdf(true);

    try {
      const response = await fetch("/api/audio/generator/pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formattedText: generationMessage,
          result: generatedResult,
        }),
      });

      if (!response.ok) {
        const data = (await response.json()) as AudioGeneratorPdfResponse;

        throw new Error(data.message || "Failed to generate PDF.");
      }

      const pdfBlob = await response.blob();
      const pdfUrl = window.URL.createObjectURL(pdfBlob);
      const downloadLink = document.createElement("a");

      downloadLink.href = pdfUrl;
      downloadLink.download = "audio-generator.pdf";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.remove();
      window.URL.revokeObjectURL(pdfUrl);
    } catch (error) {
      setGenerationError(
        error instanceof Error ? error.message : "Failed to generate PDF.",
      );
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handleGenerateText = async (
    event: React.SubmitEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setIsGenerating(true);

    setGenerationError(null);

    setGenerationMessage(null);

    setGeneratedResult(null);

    setHasSuccessfulResponse(false);

    try {
      const generationPayload = buildGenerationPayload(formState);

      const response = await fetch("/api/audio/generator/text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(generationPayload),
      });

      const data = (await response.json()) as AudioGeneratorResponse;

      console.log("Audio generator route response", {
        status: response.status,
        ok: response.ok,
        data,
      });

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to send audio generation request.",
        );
      }
      setGeneratedResult(data.result ?? null);
      setGenerationMessage(
        formatGeneratedResultForDisplay(data.result) ||
          data.message ||
          "Audio generation request sent.",
      );
      setHasSuccessfulResponse(true);
    } catch (error) {
      setGenerationError(
        error instanceof Error
          ? error.message
          : "Failed to send audio generation request.",
      );
      setHasSuccessfulResponse(false);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClear = () => {
    setFormState({
      ...defaultFormState,
      selectedFilesByFolder: buildEmptySelections(foldersWithFiles),
    });

    setGenerationError(null);

    setGenerationMessage(null);

    setGeneratedResult(null);

    setHasSuccessfulResponse(false);
  };

  if (!hasMounted) {
    return (
      <CardGridPageShell
        title="Build an audio generation brief"
        icon="🤖"
        showBackButton
        backHref="/"
      >
        <div className="rounded-[1.8rem] border border-[rgba(255,220,240,0.16)] bg-[rgba(33,6,27,0.5)] p-6 text-sm leading-6 text-[rgba(255,232,245,0.82)] shadow-[0_24px_70px_rgba(24,2,19,0.36)] backdrop-blur-xl sm:p-8">
          Loading audio generator...
        </div>
      </CardGridPageShell>
    );
  }

  return (
    <CardGridPageShell
      title="Build an audio generation brief"
      icon="🤖"
      showBackButton
      backHref="/"
    >
      <section className="rounded-[1.8rem] border border-[rgba(255,220,240,0.16)] bg-[rgba(33,6,27,0.5)] p-5 shadow-[0_24px_70px_rgba(24,2,19,0.36)] backdrop-blur-xl sm:p-6">
        <form className="space-y-6" onSubmit={handleGenerateText}>
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#ffbde4]">
              Conversation setup
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="flex flex-col gap-5">
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

            <label className="flex flex-col gap-5">
              <span className="text-sm font-medium text-[#fff0fb]">Level</span>
              <div className="relative">
                <select
                  name="level"
                  value={formState.level}
                  onChange={(event) => handleLevelChange(event.target.value)}
                  className="min-h-12 w-full appearance-none rounded-[1rem] border border-[rgba(255,196,232,0.24)] bg-[rgba(255,232,245,0.08)] px-4 py-3 pr-12 text-base text-[#fff7fd] outline-none transition focus:border-[rgba(255,215,239,0.46)] focus:bg-[rgba(255,232,245,0.12)]"
                >
                  <option value="" className="bg-[#411134] text-[#fff7fd]">
                    Select a level
                  </option>
                  {LEVEL_OPTIONS.map((levelOption) => (
                    <option
                      key={levelOption}
                      value={levelOption}
                      className="bg-[#411134] text-[#fff7fd]"
                    >
                      {levelOption}
                    </option>
                  ))}
                </select>

                <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[#ffc6e8]">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 20 20"
                    fill="none"
                    className="h-4 w-4"
                  >
                    <path
                      d="M5 7.5L10 12.5L15 7.5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
            </label>

            <label className="flex flex-col gap-5">
              <span className="text-sm font-medium text-[#fff0fb]">
                Type of speech
              </span>
              <div className="relative">
                <select
                  name="typeOfSpeech"
                  value={formState.typeOfSpeech}
                  onChange={(event) =>
                    handleTypeOfSpeechChange(
                      event.target.value as SpeechType | "",
                    )
                  }
                  className="min-h-12 w-full appearance-none rounded-[1rem] border border-[rgba(255,196,232,0.24)] bg-[rgba(255,232,245,0.08)] px-4 py-3 pr-12 text-base text-[#fff7fd] outline-none transition focus:border-[rgba(255,215,239,0.46)] focus:bg-[rgba(255,232,245,0.12)]"
                >
                  <option value="" className="bg-[#411134] text-[#fff7fd]">
                    Select a type
                  </option>
                  {SPEECH_TYPE_OPTIONS.map((speechType) => (
                    <option
                      key={speechType}
                      value={speechType}
                      className="bg-[#411134] text-[#fff7fd]"
                    >
                      {speechType === SPEECH_TYPES.dialogue
                        ? "Dialogue"
                        : "Monologue"}
                    </option>
                  ))}
                </select>

                <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[#ffc6e8]">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 20 20"
                    fill="none"
                    className="h-4 w-4"
                  >
                    <path
                      d="M5 7.5L10 12.5L15 7.5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
            </label>
          </div>

          <label className="flex flex-col gap-5">
            <span className="text-sm font-medium text-[#fff0fb]">
              Open information about the material
            </span>
            <textarea
              name="details"
              value={formState.details}
              onChange={(event) => handleDetailsChange(event.target.value)}
              rows={5}
              placeholder="Describe the situation, tone, goal, speakers, or any constraints."
              className="min-h-36 w-full rounded-[1rem] border border-[rgba(255,196,232,0.24)] bg-[rgba(255,232,245,0.08)] px-4 py-3 text-base leading-6 text-[#fff7fd] outline-none transition focus:border-[rgba(255,215,239,0.46)] focus:bg-[rgba(255,232,245,0.12)]"
            />
          </label>

          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#ffbde4]">
                Data sources
              </p>
              <p className="text-sm leading-6 text-[rgba(255,232,245,0.82)]">
                Tick the files you want from each folder. Checked items stay
                selected while you move between folders.
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
                  className="block rounded-[1.4rem] border border-[rgba(255,220,240,0.14)] bg-[rgba(255,255,255,0.04)] p-4"
                >
                  {(() => {
                    const selectedFileNames =
                      formState.selectedFilesByFolder[folderName] ?? [];

                    return (
                      <>
                        <span className="mb-4 block text-sm font-medium text-[#fff0fb]">
                          {formatFolderOrFileName(folderName)}
                        </span>
                        <div
                          className="space-y-2 rounded-[1rem] border border-[rgba(255,196,232,0.24)] bg-[rgba(255,232,245,0.08)] p-3"
                          role="group"
                          aria-label={`${formatFolderOrFileName(folderName)} data files`}
                        >
                          {fileNames.map((fileName) => {
                            const isSelected =
                              selectedFileNames.includes(fileName);

                            return (
                              <label
                                key={`${folderName}-${fileName}`}
                                className="flex cursor-pointer items-center gap-3 rounded-[0.9rem] border border-[rgba(255,220,240,0.14)] bg-[rgba(255,255,255,0.04)] px-3 py-2.5 text-sm text-[#fff7fd] transition hover:border-[rgba(255,215,239,0.28)] hover:bg-[rgba(255,232,245,0.1)]"
                              >
                                <input
                                  type="checkbox"
                                  name={`${folderName}-${fileName}`}
                                  checked={isSelected}
                                  onChange={(event) =>
                                    handleFolderFileToggle(
                                      folderName,
                                      fileName,
                                      fileNames,
                                      event.target.checked,
                                    )
                                  }
                                  className="h-4 w-4 rounded border-[rgba(255,196,232,0.34)] bg-transparent text-[#ff8fc8] accent-[#ff8fc8]"
                                />
                                <span className="leading-6 text-[rgba(255,244,251,0.92)]">
                                  {formatFolderOrFileName(fileName)}
                                </span>
                              </label>
                            );
                          })}
                        </div>
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
              variant="blue"
              fullWidth={false}
              disabled={isLoadingOptions || Boolean(loadError) || isGenerating}
              className="disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isGenerating ? "Generating text..." : "Generate text"}
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

          {generationError ? (
            <div className="rounded-[1.4rem] border border-[rgba(255,140,174,0.28)] bg-[rgba(90,15,43,0.34)] p-4 text-sm leading-6 text-[#ffd7e7]">
              {generationError}
            </div>
          ) : null}

          {generationMessage ? (
            generatedResult?.monologue &&
            monologueMessageSections.length > 0 ? (
              <div className="rounded-[1.4rem] border border-[rgba(140,234,202,0.28)] bg-[rgba(16,67,54,0.3)] p-4 text-sm text-[#d9fff2]">
                <div className="grid gap-12">
                  {monologueMessageSections.map((section, index) => (
                    <div
                      key={`${index}-${section}`}
                      className="whitespace-pre-wrap leading-6"
                    >
                      {section}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="whitespace-pre-wrap rounded-[1.4rem] border border-[rgba(140,234,202,0.28)] bg-[rgba(16,67,54,0.3)] p-4 text-sm leading-6 text-[#d9fff2]">
                {generationMessage}
              </div>
            )
          ) : null}

          {hasSuccessfulResponse ? (
            <div className="flex flex-wrap gap-3">
              <Button
                type="button"
                variant="teal"
                fullWidth={false}
                onClick={handleDownloadMp3}
                disabled={isDownloadingMp3 || !generatedResult}
              >
                {isDownloadingMp3 ? "Downloading MP3..." : "Download MP3"}
              </Button>
              <Button
                type="button"
                variant="outline"
                fullWidth={false}
                onClick={handleDownloadPdf}
                disabled={isDownloadingPdf}
              >
                {isDownloadingPdf ? "Downloading PDF..." : "Download PDF"}
              </Button>
            </div>
          ) : null}
        </form>
      </section>
    </CardGridPageShell>
  );
}
