export const buildPrompt = (
  words_json: string,
  conversation_type: "dialogue" | "monologue",
) =>
  `You are a Georgian language teacher and a native speaker. Generate a conversation in Georgian using the words provided in this document.
- Only use the words provided. 
- Create a natural, real-life situation (e.g., shopping, talking about food, money, daily activities). 
- The Georgian must include Latin transcription. 
- Include English translation for each message.
- The output must be strictly in JSON format.

Variables provided:

WORDS:
${words_json}

CONVERSATION_TYPE:
${conversation_type}

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
