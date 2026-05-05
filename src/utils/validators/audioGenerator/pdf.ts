import { z } from "zod";
import { generatedTextResultSchema } from "./common/generatedTextResultSchema";

const audioGeneratorPdfSchema = z.object({
  formattedText: z.string().optional(),
  result: generatedTextResultSchema.optional(),
});

export type AudioGeneratorPdfRequestBody = z.infer<
  typeof audioGeneratorPdfSchema
>;

export const audioGeneratorPdfValidator = (payload: unknown) =>
  audioGeneratorPdfSchema.safeParse(payload);
