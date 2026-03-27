export const buildPrompt = (
  words_json: string,
  conversation_type: "dialogue" | "monologue",
) =>
  `You are a Georgian language teacher and a native speaker. Generate a ${conversation_type} conversation in Georgian using the words provided in the JSON files. The json files have been stringified and passed as a variable to this prompt. The conversation should be natural and realistic, suitable for language learners to practice listening and comprehension.and contain the words in kartuli, the transcription in Latin, and the English translation. Obviously, you should only take the kartuli words.
- Only use the words provided (verbs, vocabulary, function words). 
- Create a natural, real-life situation (e.g., shopping, talking about food, money, daily activities). 
- The Georgian must include Latin transcription. 
- Include English translation for each message.
- The output must be strictly in JSON format.

Variables provided:

WORDS:
${words_json}

CONVERSATION_TYPE:
${conversation_type}  // either "dialogue" or "monologue"

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
