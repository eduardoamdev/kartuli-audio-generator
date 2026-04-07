export const buildPrompt = (
  words: string,
  age: string,
  level: string,
  conversationDescription: string,
  typeOfSpeech: "dialogue" | "monologue",
) =>
  `You are a Georgian language teacher and a native speaker. Generate a conversation in Georgian using the words provided in this document.
- Use the words provided. You are going to receive a big set of words but due to the size of the conversation you are not going to be able to use all of them, so choose the most common ones and make sure to use them in a natural way. 
- If you think you have to include some extra words that are not in the list to make the conversation more natural, you can include them but make sure to include as many words from the list as possible.
- Create a natural coversation. 
- The Georgian must include Latin transcription. 
- Include English translation for each message.
- The output must be strictly in JSON format.
- If the speech is a dialogue, each speaker should alternate naturally.
- Keep messages realistic (for listening repetition).
- If there is a contradiction between the conversation description and the information provided in  words, age, level or type of speech, prioritize the conversation description.
- If there is a contradiction between the conversation description and the rest of the instrucitions in this prompt not included in the previous point, prioritize the instructions.
- It the type of speech is a monologue, please, include paragraph endings in the message to make it easier to transcribe.

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
