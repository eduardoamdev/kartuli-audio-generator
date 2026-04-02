import path from "node:path";

export const SPEECH_TYPES = {
  dialogue: "dialogue",
  monologue: "monologue",
};

export const DATA_DIRECTORY = path.join(process.cwd(), "src", "data");

export const TEXT_FILE_ENCODING = "utf-8";

export const SITE_TITLE = "გამარჯობა";

export const DATA_FOLDERS = {
  VOCABULARY: "vocabulary",
  FUNCTION_WORDS: "function-words",
  VERBS: "verbs",
};
