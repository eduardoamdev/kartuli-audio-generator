export type GeneratedMessage = {
  ka?: string;
  la?: string;
  en?: string;
};

export type GeneratedGender = "male" | "female" | "masculine" | "feminine";

export type GeneratedTextEntry = {
  speaker?: string;
  gender?: GeneratedGender | string;
  message?: GeneratedMessage;
};
