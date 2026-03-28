export type DataTextInfo = {
  ka: string;
  la: string;
  en: string;
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
  conjugation: DataTextInfo;
};

export type VerbData = {
  infinitive?: DataTextInfo;
  present: VerbTense;
  past: VerbTense;
  future: VerbTense;
  present_continuous: VerbTense;
  present_perfect: VerbTense;
};

export type VocalubaryAndFuncionWordsData = DataTextInfo[];
