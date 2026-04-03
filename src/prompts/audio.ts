export const buildPrompt = (
  words: string,
  age: string,
  level: string,
  conversationDescription: string,
  typeOfSpeech: "dialogue" | "monologue",
) =>
  `You are a Georgian language teacher and a native speaker. Generate a conversation in Georgian using the words provided in this document.
- Only use the words provided. 
- Create a natural coversation. 
- The Georgian must include Latin transcription. 
- Include English translation for each message.
- The output must be strictly in JSON format.

Variables provided:

WORDS:
${words}

AGE:
${age}

LEVEL:
${level}

CONVERSATION_DESCRIPTION:
${conversationDescription}

TYPE_OF_SPEECH:
${typeOfSpeech}

Output structure:

If dialogue:
{
  "conversation": [
    {
      "speaker": "A",
      "gender": "female",
      "message": {
        "ka": "<text in Georgian>",
        "la": "<Latin transcription>",
        "en": "<English translation>"
      }
    },
    {
      "speaker": "B",
      "gender": "male",
      "message": {
        "ka": "<text in Georgian>",
        "la": "<Latin transcription>",
        "en": "<English translation>"
      }
    },
    ...
  ]
}

If monologue:
{
  "monologue": {
    "speaker": "A",
    "gender": "female",
    "message": {
      "ka": "<text in Georgian>",
      "la": "<Latin transcription>",
      "en": "<English translation>"
    }
  }
}

Constraints:
- Each speaker in dialogue should alternate naturally.
- Keep messages short and realistic (for listening repetition).
- Do not add any content outside the JSON structure.
- Use only the words from the provided WORDS JSON, but you can combine them to make natural sentences.`;
