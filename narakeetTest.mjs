import { dirname } from "path";
import { writeFile } from "fs/promises";
import { fileURLToPath } from "url";

import nextEnv from "@next/env";

const { loadEnvConfig } = nextEnv;

const projectDir = dirname(fileURLToPath(import.meta.url));

loadEnvConfig(projectDir);

const main = async () => {
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    throw new Error(
      "Missing NARAKEET_API_KEY or API_KEY in your .env.local file.",
    );
  }

  const voice = "tornike";
  const text = "გამარჯობა";

  const response = await fetch(
    `https://api.narakeet.com/text-to-speech/mp3?voice=${voice}`,
    {
      method: "POST",
      headers: {
        Accept: "application/octet-stream",
        "Content-Type": "text/plain",
        "x-api-key": apiKey,
      },
      body: text,
    },
  );

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  await writeFile("result.mp3", buffer);
};

main();
