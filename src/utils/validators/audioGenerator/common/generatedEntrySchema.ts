import { z } from "zod";

import { generatedMessageSchema } from "./generatedMessageSchema";

export const generatedEntrySchema = z.object({
  speaker: z.string().optional(),
  gender: z.string().optional(),
  message: generatedMessageSchema.optional(),
});
