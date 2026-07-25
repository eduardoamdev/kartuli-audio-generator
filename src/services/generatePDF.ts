import puppeteer from "puppeteer";

import type {
  GeneratedMessage,
  GeneratedTextEntry,
} from "@/types/audioGenerator";

const escapeHtml = (value: string): string =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

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

const buildTextLanguageMarkup = (value: string | undefined): string => {
  const paragraphsMarkup = splitIntoParagraphs(value)
    .map(
      (paragraph) =>
        `<p class="line text-paragraph">${formatParagraphText(paragraph)}</p>`,
    )
    .join("");

  if (!paragraphsMarkup) {
    return "";
  }

  return `<section class="text-language">${paragraphsMarkup}</section>`;
};

const buildTextMarkup = (message: GeneratedMessage): string => {
  return [message.ka, message.la, message.en]
    .map(buildTextLanguageMarkup)
    .filter((sectionMarkup) => sectionMarkup.length > 0)
    .join("");
};

const buildStructuredMarkup = (
  result: GeneratedTextEntry | undefined,
): string => {
  if (result && result.message) {
    const textMarkup = buildTextMarkup(result.message);

    if (textMarkup) {
      return `<div class="text">${textMarkup}</div>`;
    }

    return buildPlainTextMarkup("");
  }

  return buildPlainTextMarkup("");
};

const buildPdfHtml = (text: GeneratedTextEntry | undefined): string => {
  const content = buildStructuredMarkup(text);

  return `
		<!DOCTYPE html>
		<html lang="en">
			<head>
				<meta charset="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>Generated Text</title>
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

					.text {
						display: grid;
            gap: 40px;
					}

					.text-language {
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
  texts?: GeneratedTextEntry,
): Promise<Uint8Array<ArrayBuffer>> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();

    await page.setContent(buildPdfHtml(texts), {
      waitUntil: "load",
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
