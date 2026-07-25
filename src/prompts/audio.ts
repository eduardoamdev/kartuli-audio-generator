export const buildPrompt = (text: string) =>
  `Generate a text in Georgian language translating the information contained in the TEXT section of this prompt.
- The Georgian must include Latin transcription. 
- Include English translation for each message.
- The output must be strictly in JSON format.
- Include paragraph endings in the message to make it easier to transcribe.

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
