export type DataTextInfo = {
  ka: string;
  la: string;
  en: string;
};

export type DataNames = {
  folderNames: string[];
  fileNames: string[];
};

export type DataFileRequest = {
  folder: string;
  filename: string;
};

export type VerbConjugation = {
  "1sg": DataTextInfo;
  "2sg": DataTextInfo;
  "3sg": DataTextInfo;
  "1pl": DataTextInfo;
  "2pl": DataTextInfo;
  "3pl": DataTextInfo;
};

export type VerbTense = {
  name: DataTextInfo;
  conjugation: VerbConjugation;
};

export type VerbData = {
  infinitive?: VerbTense;
  present: VerbTense;
  past: VerbTense;
  future: VerbTense;
  present_continuous: VerbTense;
  present_perfect: VerbTense;
};

export type VocabularyAndFunctionWordsData = DataTextInfo[];

export type SupportedDataFile = VerbData | VocabularyAndFunctionWordsData;

export type LanguageCode = keyof DataTextInfo;
