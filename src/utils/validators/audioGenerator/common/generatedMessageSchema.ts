import { z } from "zod";

export const generatedMessageSchema = z.object({
  ka: z.string().optional(),
  la: z.string().optional(),
  en: z.string().optional(),
});
