import { getAllInfinitives } from "../utils/getAllInfinitives";

export const buildPrompt = (text: string) =>
  `Generate a text in Georgian language translating the information contained in the TEXT section of this prompt.
- The Georgian must include Latin transcription. 
- Include English translation for each message.
- The output must be strictly in JSON format.
- In want you to use only the following Georgian verbs (I provide you a list of infinitives for your record but you must use the proper tense and conjugation for each verb in the Georgian text): ${getAllInfinitives()}

Variables provided:

TEXT:
${text}

Output structure:

{
    "message": {
      "ka": "<Text in Georgian>",
      "la": "<Latin transcription>",
      "en": "<English translation>"
    }
}`;
