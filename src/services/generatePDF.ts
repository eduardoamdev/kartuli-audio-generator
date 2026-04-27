import puppeteer from "puppeteer";

import type {
  GeneratedDialogueEntry,
  GeneratedMessage,
  GeneratedTextResult,
} from "@/types/audioGenerator";

const escapeHtml = (value: string): string =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const getMessageLines = (message: GeneratedMessage | undefined): string[] =>
  [message?.ka, message?.la, message?.en].filter(
    (value): value is string =>
      typeof value === "string" && value.trim().length > 0,
  );

const splitIntoParagraphs = (value: string | undefined): string[] => {
  if (typeof value !== "string") {
    return [];
  }

  return value
    .split(/\n\s*\n/u)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0);
};

const formatParagraphText = (value: string): string =>
  escapeHtml(value).replaceAll("\n", "<br />");

const buildPlainTextMarkup = (formattedText: string): string =>
  escapeHtml(formattedText).replaceAll("\n", "<br />");

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

const buildDialogueEntryMarkup = (entry: GeneratedDialogueEntry): string => {
  const lines = getMessageLines(entry.message);

  if (lines.length === 0) {
    return "";
  }

  const speaker = formatSpeakerLabel(entry.speaker);

  return `
					<article class="entry">
						<p class="speaker">${escapeHtml(speaker)}</p>
						<div class="turn">
							${lines.map((line) => `<p class="line">${escapeHtml(line)}</p>`).join("")}
						</div>
					</article>
				`;
};

const buildMonologueLanguageMarkup = (value: string | undefined): string => {
  const paragraphsMarkup = splitIntoParagraphs(value)
    .map(
      (paragraph) =>
        `<p class="line monologue-paragraph">${formatParagraphText(paragraph)}</p>`,
    )
    .join("");

  if (!paragraphsMarkup) {
    return "";
  }

  return `<section class="monologue-language">${paragraphsMarkup}</section>`;
};

const buildMonologueMarkup = (message: GeneratedMessage): string => {
  return [message.ka, message.la, message.en]
    .map(buildMonologueLanguageMarkup)
    .filter((sectionMarkup) => sectionMarkup.length > 0)
    .join("");
};

const buildStructuredMarkup = (
  formattedText: string,
  result: GeneratedTextResult | undefined,
): string => {
  if (Array.isArray(result?.conversation)) {
    const entriesMarkup = result.conversation
      .map(buildDialogueEntryMarkup)
      .filter((entryMarkup) => entryMarkup.length > 0)
      .join("");

    if (entriesMarkup) {
      return `<div class="conversation">${entriesMarkup}</div>`;
    }
  }

  if (result?.monologue?.message) {
    const monologueMarkup = buildMonologueMarkup(result.monologue.message);

    if (monologueMarkup) {
      return `<div class="monologue">${monologueMarkup}</div>`;
    }
  }

  return buildPlainTextMarkup(formattedText);
};

const buildPdfHtml = (
  formattedText: string,
  result: GeneratedTextResult | undefined,
): string => {
  const content = buildStructuredMarkup(formattedText, result);

  return `
		<!DOCTYPE html>
		<html lang="en">
			<head>
				<meta charset="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>Generated Audio Text</title>
				<style>
					:root {
						color-scheme: light;
					}

					* {
						box-sizing: border-box;
					}

					body {
						margin: 0;
						font-family: "Helvetica Neue", Arial, sans-serif;
						background: #fffaf5;
						color: #1f1720;
					}

					main {
						padding: 40px 44px 56px;
					}

					h1 {
						margin: 0 0 24px;
						font-size: 22px;
						letter-spacing: 0.02em;
					}

					.content {
						border: 1px solid #e7d8de;
						border-radius: 18px;
						padding: 24px;
						background: #ffffff;
						font-size: 14px;
						line-height: 1.7;
						white-space: normal;
						word-break: break-word;
					}

					.conversation {
						display: grid;
						gap: 18px;
					}

					.monologue {
						display: grid;
            gap: 40px;
					}

					.monologue-language {
						display: grid;
						gap: 14px;
					}

					.entry {
						padding-bottom: 18px;
						border-bottom: 1px solid #f1e5e9;
					}

					.entry:last-child {
						padding-bottom: 0;
						border-bottom: 0;
					}

					.speaker {
						margin: 0 0 8px;
						font-size: 12px;
						font-weight: 700;
						letter-spacing: 0.08em;
						text-transform: uppercase;
						color: #8b3f63;
					}

					.turn {
						display: grid;
						gap: 6px;
					}

					.line {
						margin: 0;
					}
				</style>
			</head>
			<body>
				<main>
					<section class="content">${content}</section>
				</main>
			</body>
		</html>
	`;
};

export async function generatePDF(
  formattedText: string,
  result?: GeneratedTextResult,
): Promise<Uint8Array<ArrayBuffer>> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();

    await page.setContent(buildPdfHtml(formattedText, result), {
      waitUntil: "networkidle0",
    });

    await page.emulateMediaType("screen");

    return Uint8Array.from(
      await page.pdf({
        format: "A4",
        printBackground: true,
        margin: {
          top: "20mm",
          right: "14mm",
          bottom: "20mm",
          left: "14mm",
        },
      }),
    );
  } finally {
    await browser.close();
  }
}
