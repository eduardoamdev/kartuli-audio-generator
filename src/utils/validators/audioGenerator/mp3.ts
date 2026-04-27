import { z } from "zod";

const hasNonEmptyContent = (value: string | undefined): boolean =>
  typeof value === "string" && value.trim().length > 0;

const generatedMessageSchema = z.object({
  ka: z.string().optional(),
  la: z.string().optional(),
  en: z.string().optional(),
});

const generatedDialogueEntrySchema = z.object({
  speaker: z.string().optional(),
  gender: z.string().optional(),
  message: generatedMessageSchema.optional(),
});

const generatedMonologueEntrySchema = z.object({
  speaker: z.string().optional(),
  gender: z.string().optional(),
  message: generatedMessageSchema,
});

const generatedTextResultSchema = z
  .object({
    conversation: z.array(generatedDialogueEntrySchema).optional(),
    monologue: generatedMonologueEntrySchema.optional(),
  })
  .refine(
    (result) => {
      if (
        Array.isArray(result.conversation) &&
        result.conversation.some((entry) =>
          hasNonEmptyContent(entry.message?.ka),
        )
      ) {
        return true;
      }

      return hasNonEmptyContent(result.monologue?.message.ka);
    },
    {
      message:
        "A generated dialogue or monologue result with Georgian narration is required.",
    },
  );

const audioGeneratorMp3Schema = z.object({
  result: generatedTextResultSchema,
});

export type AudioGeneratorMp3RequestBody = z.infer<
  typeof audioGeneratorMp3Schema
>;

export const audioGeneratorMp3Validator = (payload: unknown) =>
  audioGeneratorMp3Schema.safeParse(payload);
