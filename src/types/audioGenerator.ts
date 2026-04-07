export type GeneratedMessage = {
  ka?: string;
  la?: string;
  en?: string;
};

export type GeneratedGender = "male" | "female" | "masculine" | "feminine";

export type GeneratedDialogueEntry = {
  speaker?: string;
  gender?: GeneratedGender | string;
  message?: GeneratedMessage;
};

export type GeneratedMonologueEntry = {
  speaker?: string;
  gender?: GeneratedGender | string;
  message?: GeneratedMessage;
};

export type GeneratedTextResult = {
  conversation?: GeneratedDialogueEntry[];
  monologue?: GeneratedMonologueEntry;
};
