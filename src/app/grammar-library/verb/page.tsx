import { promises as fs } from "node:fs";
import path from "node:path";
import { DATA_DIRECTORY } from "@/utils/constants";
import CardGridPageShell from "@/components/features/CardGridPageShell";
import { notFound } from "next/navigation";

type LocalizedString = {
  ka: string;
  la: string;
  en: string;
};

type TenseData = {
  name: LocalizedString;
  conjugation: Record<string, LocalizedString>;
};

type VerbData = Record<string, TenseData>;

const PERSON_LABELS: Record<string, string> = {
  "1sg": "1st Person Singular",
  "2sg": "2nd Person Singular",
  "3sg": "3rd Person Singular",
  "1pl": "1st Person Plural",
  "2pl": "2nd Person Plural (Formal)",
  "3pl": "3rd Person Plural",
};

interface VerbPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function VerbPage({ searchParams }: VerbPageProps) {
  const resolvedParams = await searchParams;

  const nameParam = resolvedParams.name;

  const verbName = Array.isArray(nameParam) ? nameParam[0] : nameParam;

  if (!verbName || typeof verbName !== "string") {
    return notFound();
  }

  const fileName = verbName.endsWith(".json") ? verbName : `${verbName}.json`;

  const filePath = path.join(DATA_DIRECTORY, "verbs", fileName);

  const fileContent = await fs.readFile(filePath, "utf-8");

  const verbData: VerbData = JSON.parse(fileContent);

  const infinitiveEn = verbData["infinitive"]?.name?.en;

  const title = infinitiveEn ? `Verb: ${infinitiveEn}` : `Verb: ${verbName}`;

  return (
    <CardGridPageShell
      title={title.toUpperCase()}
      icon="📖"
      showBackButton={true}
      backHref="/grammar-library/verb/selector"
      backLabel="Back to selector"
    >
      <div className="space-y-12 pb-8">
        {Object.entries(verbData).map(([tenseKey, tenseObj]) => {
          if (
            !tenseObj.conjugation ||
            Object.keys(tenseObj.conjugation).length === 0
          ) {
            return null; // Skip non-conjugated entries like infinitive
          }

          return (
            <section key={tenseKey} className="space-y-5">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-[#fff3fd]">
                  {tenseObj.name.ka}
                </h2>
                <h3 className="text-sm font-medium text-[rgba(255,211,239,0.8)] tracking-wider uppercase">
                  {tenseObj.name.en}{" "}
                  <span className="opacity-60 lowercase italic">
                    ({tenseObj.name.la})
                  </span>
                </h3>
              </div>

              <div className="overflow-x-auto rounded-[1.5rem] border border-[rgba(255,220,240,0.18)] bg-[rgba(255,232,245,0.03)] shadow-xl backdrop-blur-md">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead className="bg-[rgba(255,232,245,0.06)] border-b border-[rgba(255,220,240,0.18)]">
                    <tr>
                      <th className="px-6 py-5 text-xs font-semibold text-[#ffd3ef] uppercase tracking-wider w-[20%]">
                        Person
                      </th>
                      <th className="px-6 py-5 text-xs font-semibold text-[#ffd3ef] uppercase tracking-wider w-[25%]">
                        Kartuli
                      </th>
                      <th className="px-6 py-5 text-xs font-semibold text-[#ffd3ef] uppercase tracking-wider w-[25%]">
                        Pronunciation
                      </th>
                      <th className="px-6 py-5 text-xs font-semibold text-[#ffd3ef] uppercase tracking-wider w-[30%]">
                        English
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[rgba(255,220,240,0.1)]">
                    {Object.entries(tenseObj.conjugation).map(
                      ([personKey, conj]) => (
                        <tr
                          key={personKey}
                          className="hover:bg-[rgba(255,232,245,0.06)] transition-colors"
                        >
                          <td className="px-6 py-4 text-sm font-medium text-[#ffd3ef]/80 whitespace-nowrap">
                            {PERSON_LABELS[personKey] || personKey}
                          </td>
                          <td className="px-6 py-4 text-lg font-bold text-[#fff3fd]">
                            {conj.ka}
                          </td>
                          <td className="px-6 py-4 text-sm text-[#ffd3ef]/90 italic font-light">
                            {conj.la}
                          </td>
                          <td className="px-6 py-4 text-sm text-[#fff3fd]">
                            {conj.en}
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          );
        })}
      </div>
    </CardGridPageShell>
  );
}
