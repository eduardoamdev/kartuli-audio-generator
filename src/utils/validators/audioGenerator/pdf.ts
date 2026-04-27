import { z } from "zod";

const hasNonEmptyContent = (value: string | undefined): boolean =>
  typeof value === "string" && value.trim().length > 0;

const generatedMessageSchema = z
  .object({
    ka: z.string().optional(),
    la: z.string().optional(),
    en: z.string().optional(),
  })
  .refine(
    ({ ka, la, en }) =>
      hasNonEmptyContent(ka) ||
      hasNonEmptyContent(la) ||
      hasNonEmptyContent(en),
    {
      message: "A message must include at least one non-empty language value.",
    },
  );

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

const generatedTextResultSchema = z.object({
  conversation: z.array(generatedDialogueEntrySchema).optional(),
  monologue: generatedMonologueEntrySchema.optional(),
});

const audioGeneratorPdfSchema = z
  .object({
    formattedText: z.string().optional(),
    result: generatedTextResultSchema.optional(),
  })
  .refine(
    ({ formattedText, result }) => {
      if (hasNonEmptyContent(formattedText)) {
        return true;
      }

      if (
        Array.isArray(result?.conversation) &&
        result.conversation.some((entry) => entry.message)
      ) {
        return true;
      }

      return Boolean(result?.monologue?.message);
    },
    {
      message: "formattedText or a generated result is required.",
    },
  );

export type AudioGeneratorPdfRequestBody = z.infer<
  typeof audioGeneratorPdfSchema
>;

export const audioGeneratorPdfValidator = (payload: unknown) =>
  audioGeneratorPdfSchema.safeParse(payload);
