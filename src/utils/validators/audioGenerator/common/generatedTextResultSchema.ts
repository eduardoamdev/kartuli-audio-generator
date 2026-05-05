import { z } from "zod";

import { generatedEntrySchema } from "./generatedEntrySchema";

export const generatedTextResultSchema = z.object({
  conversation: z.array(generatedEntrySchema).optional(),
  monologue: generatedEntrySchema.optional(),
});
