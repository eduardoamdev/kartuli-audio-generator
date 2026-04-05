export const buildPrompt = (
  words: string,
  age: string,
  level: string,
  conversationDescription: string,
  typeOfSpeech: "dialogue" | "monologue",
) =>
  `You are a Georgian language teacher and a native speaker. Generate a conversation in Georgian using the words provided in this document.
- Use the words provided. 
- Create a natural coversation. 
- The Georgian must include Latin transcription. 
- Include English translation for each message.
- The output must be strictly in JSON format.
- If the speech is a dialogue, each speaker should alternate naturally.
- Keep messages realistic (for listening repetition).

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
}`;
