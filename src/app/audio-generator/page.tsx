"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import ButtonGridPageShell from "@/components/features/ButtonGridPageShell";
import type {
  GeneratedMessage,
  GeneratedTextEntry,
} from "@/types/audioGenerator";

type AudioGeneratorResponse = {
  success: boolean;
  message?: string;
  result?: GeneratedTextEntry;
};

type AudioGeneratorPdfResponse = {
  success: boolean;
  message?: string;
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

const formatGeneratedResultForDisplay = (
  result: GeneratedTextEntry | null | undefined,
): string => {
  if (result && result?.message) {
    return formatGeneratedMessage(result.message);
  }
  return "";
};

export default function AudioGeneratorPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloadingMp3, setIsDownloadingMp3] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [generationMessage, setGenerationMessage] = useState<string | null>(
    null,
  );
  const [generatedResult, setGeneratedResult] =
    useState<GeneratedTextEntry | null>(null);
  const [hasSuccessfulResponse, setHasSuccessfulResponse] = useState(false);
  const [textareaState, setTextareaState] = useState("");

  const messageSections = getGeneratedMessageSections(generatedResult?.message);

  const handleTextChange = (value: string) => {
    setTextareaState(value);
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
      const response = await fetch("/api/audio-generator/mp3", {
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
    if (!generatedResult) {
      setGenerationError("No generated text is available for PDF generation.");
      return;
    }

    setGenerationError(null);
    setIsDownloadingPdf(true);

    try {
      const response = await fetch("/api/audio-generator/pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(generatedResult),
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
      const response = await fetch("/api/audio-generator/text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(textareaState),
      });

      const data = (await response.json()) as AudioGeneratorResponse;

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

  return (
    <ButtonGridPageShell
      title="Build an audio generation brief"
      icon="🤖"
      showBackButton
      backHref="/"
    >
      <section>
        <form className="space-y-6" onSubmit={handleGenerateText}>
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#ffbde4]">
              Audio setup
            </p>
          </div>

          <label className="flex flex-col gap-5">
            <span className="text-sm font-medium text-[#fff0fb]">
              Open text to be translated into Georgian.
            </span>
            <textarea
              name="details"
              value={textareaState}
              onChange={(event) => handleTextChange(event.target.value)}
              rows={5}
              className="min-h-36 w-full rounded-[1rem] border border-[rgba(255,196,232,0.24)] bg-[rgba(255,232,245,0.08)] px-4 py-3 text-base leading-6 text-[#fff7fd] outline-none transition focus:border-[rgba(255,215,239,0.46)] focus:bg-[rgba(255,232,245,0.12)]"
            />
          </label>

          <div className="flex flex-wrap gap-3">
            <Button
              type="submit"
              variant="blue"
              fullWidth={false}
              disabled={isGenerating}
              className="disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isGenerating ? "Generating text..." : "Generate text"}
            </Button>
          </div>

          {generationError ? (
            <div className="rounded-[1.4rem] border border-[rgba(255,140,174,0.28)] bg-[rgba(90,15,43,0.34)] p-4 text-sm leading-6 text-[#ffd7e7]">
              {generationError}
            </div>
          ) : null}

          {generationMessage ? (
            generatedResult && messageSections.length > 0 ? (
              <div className="rounded-[1.4rem] border border-[rgba(140,234,202,0.28)] bg-[rgba(16,67,54,0.3)] p-4 text-sm text-[#d9fff2]">
                <div className="grid gap-12">
                  {messageSections.map((section, index) => (
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
    </ButtonGridPageShell>
  );
}
