import puppeteer from "puppeteer";

const escapeHtml = (value: string): string =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const buildPdfHtml = (formattedText: string): string => {
  const content = escapeHtml(formattedText).replaceAll("\n", "<br />");

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

export async function generatePDF(formattedText: string): Promise<Uint8Array> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();

    await page.setContent(buildPdfHtml(formattedText), {
      waitUntil: "networkidle0",
    });

    await page.emulateMediaType("screen");

    return await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20mm",
        right: "14mm",
        bottom: "20mm",
        left: "14mm",
      },
    });
  } finally {
    await browser.close();
  }
}
