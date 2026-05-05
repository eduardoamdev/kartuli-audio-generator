import { z } from "zod";
import { generatedTextResultSchema } from "./common/generatedTextResultSchema";

const audioGeneratorMp3Schema = z.object({
  result: generatedTextResultSchema,
});

export type AudioGeneratorMp3RequestBody = z.infer<
  typeof audioGeneratorMp3Schema
>;

export const audioGeneratorMp3Validator = (payload: unknown) =>
  audioGeneratorMp3Schema.safeParse(payload);
