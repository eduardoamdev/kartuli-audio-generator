import path from "node:path";

export const SPEECH_TYPES = {
  dialogue: "dialogue",
  monologue: "monologue",
} as const;

export const SPEECH_TYPE_VALUES = Object.values(
  SPEECH_TYPES,
) as (typeof SPEECH_TYPES)[keyof typeof SPEECH_TYPES][];

export const DATA_DIRECTORY = path.join(process.cwd(), "src", "data");

export const TEXT_FILE_ENCODING = "utf-8";

export const SITE_TITLE = "გამარჯობა";

export const DATA_FOLDERS = {
  VOCABULARY: "vocabulary",
  FUNCTION_WORDS: "function-words",
  VERBS: "verbs",
};

export const NON_CLICKABLE_BUTTON_SURFACES = [
  "bg-[linear-gradient(135deg,rgba(168,85,247,0.26),rgba(244,114,182,0.16))]",
  "bg-[linear-gradient(135deg,rgba(217,70,239,0.24),rgba(251,113,133,0.16))]",
  "bg-[linear-gradient(135deg,rgba(126,34,206,0.22),rgba(236,72,153,0.14))]",
] as const;

export const BUTTON_VARIANTS = ["blue", "purple", "teal"] as const;
