import puppeteer from "puppeteer";
import type { VerbData } from "@/types/data";
import { readDataFile } from "@/utils/readDataFile";
import { PERSON_LABELS } from "@/utils/constants";
import { escapeHtml } from "@/utils/escapeHtml";

const buildVerbPdfHtml = (verbName: string, verbData: VerbData): string => {
  const displayVerbName = verbName.charAt(0).toUpperCase() + verbName.slice(1);

  const sectionsMarkup = Object.entries(verbData)
    .map(([, tenseData]) => {
      const rowsMarkup = Object.entries(tenseData.conjugation)
        .map(([personKey, form]) => {
          const personLabel = PERSON_LABELS[personKey] || personKey;

          return `
            <tr>
              <td>${escapeHtml(personLabel)}</td>
              <td>${escapeHtml(form.ka)}</td>
              <td>${escapeHtml(form.la)}</td>
              <td>${escapeHtml(form.en)}</td>
            </tr>
          `;
        })
        .join("");

      return `
        <section class="tense-section">
          <h2>${escapeHtml(tenseData.name.ka)}</h2>
          <h3>${escapeHtml(tenseData.name.en)} <span>(${escapeHtml(tenseData.name.la)})</span></h3>
          <table>
            <thead>
              <tr>
                <th>Person</th>
                <th>Kartuli</th>
                <th>Pronunciation</th>
                <th>English</th>
              </tr>
            </thead>
            <tbody>${rowsMarkup}</tbody>
          </table>
        </section>
      `;
    })
    .join("");

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Verb Conjugation: ${escapeHtml(displayVerbName)}</title>
        <style>
          * { box-sizing: border-box; }
          body {
            margin: 0;
            font-family: Arial, Helvetica, sans-serif;
            background: #fffafc;
            color: #1f1720;
          }
          main {
            padding: 28px 24px 40px;
          }
          h1 {
            margin: 0 0 10px;
            font-size: 26px;
            color: #4b1639;
          }
          .subtitle {
            margin: 0 0 28px;
            color: #7b3b5c;
            font-size: 14px;
            letter-spacing: 0.08em;
            text-transform: uppercase;
          }
          .tense-section {
            margin-bottom: 28px;
            page-break-inside: avoid;
          }
          h2 {
            margin: 0 0 4px;
            font-size: 20px;
            color: #2d1228;
          }
          h3 {
            margin: 0 0 14px;
            font-size: 14px;
            color: #7b3b5c;
            font-weight: 600;
          }
          h3 span {
            font-style: italic;
            opacity: 0.7;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            border: 1px solid #ead5e2;
            background: #fff;
          }
          th, td {
            padding: 10px 12px;
            border-bottom: 1px solid #f0e2ea;
            text-align: left;
            vertical-align: top;
          }
          th {
            background: #fdf0f7;
            font-size: 12px;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            color: #6b2854;
          }
          td {
            font-size: 13px;
            color: #2f172a;
          }
        </style>
      </head>
      <body>
        <main>
          <h1>${escapeHtml(displayVerbName)}</h1>
          <p class="subtitle">Verb conjugation</p>
          ${sectionsMarkup}
        </main>
      </body>
    </html>
  `;
};

export const generateVerbPDF = async (
  verbName: string,
): Promise<Uint8Array> => {
  const normalizedName = verbName.endsWith(".json")
    ? verbName.slice(0, -5)
    : verbName;

  const verbData = (await readDataFile({
    folder: "verbs",
    filename: `${normalizedName}.json`,
  })) as VerbData;

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();

    await page.setContent(buildVerbPdfHtml(normalizedName, verbData), {
      waitUntil: "load",
    });

    await page.emulateMediaType("screen");

    return Uint8Array.from(
      await page.pdf({
        format: "A4",
        printBackground: true,
        margin: {
          top: "18mm",
          right: "12mm",
          bottom: "18mm",
          left: "12mm",
        },
      }),
    );
  } finally {
    await browser.close();
  }
};
