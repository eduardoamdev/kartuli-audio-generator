import { z } from "zod";
import { SPEECH_TYPE_VALUES } from "@/utils/constants";

const audioGeneratorTextSchema = z.object({
  age: z.string().optional(),
  level: z.string().optional(),
  details: z.string().optional(),
  typeOfSpeech: z.enum(SPEECH_TYPE_VALUES),
  selectedFilesByFolder: z.record(z.string(), z.array(z.string())).optional(),
});

export type AudioGeneratorTextRequestBody = z.infer<
  typeof audioGeneratorTextSchema
>;

export const audioGeneratorTextValidator = (payload: unknown) =>
  audioGeneratorTextSchema.safeParse(payload);
