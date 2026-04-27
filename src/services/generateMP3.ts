import type {
  GeneratedDialogueEntry,
  GeneratedMonologueEntry,
  GeneratedTextResult,
} from "@/types/audioGenerator";

const NARAKEET_MP3_ENDPOINT = "https://api.narakeet.com/text-to-speech/mp3";
const STREAMING_API_MAX_BYTES = 1024;
const POLL_INTERVAL_MS = 3000;
const MAX_POLL_ATTEMPTS = 60;

type NarakeetStartResponse = {
  statusUrl?: string;
  message?: string;
};

type NarakeetStatusResponse = {
  finished?: boolean;
  succeeded?: boolean;
  result?: string;
  message?: string;
};

const sleep = async (milliseconds: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });

const getApiKey = (): string => {
  const apiKey = process.env.NARAKEET_API_KEY ?? process.env.API_KEY;

  if (!apiKey) {
    throw new Error("Missing NARAKEET_API_KEY or API_KEY in your environment.");
  }

  return apiKey;
};

const normalizeNarrationText = (value: string | undefined): string =>
  (value ?? "").replace(/\s+/gu, " ").trim();

const getVoiceByGender = (gender: string | undefined): "tornike" | "nino" => {
  const normalizedGender = gender?.trim().toLowerCase();

  if (normalizedGender === "female" || normalizedGender === "feminine") {
    return "nino";
  }

  return "tornike";
};

const buildMonologueScript = (monologue: GeneratedMonologueEntry): string => {
  const message = normalizeNarrationText(monologue.message?.ka);

  if (!message) {
    throw new Error("The monologue does not contain Georgian narration.");
  }

  const voice = getVoiceByGender(monologue.gender);

  return [
    `---`,
    `voice: ${voice}`,
    `voice-volume: normalized`,
    `---`,
    message,
  ].join("\n");
};

const buildDialogueScript = (
  conversation: GeneratedDialogueEntry[],
): string => {
  const dialogueParagraphs = conversation.flatMap((entry) => {
    const message = normalizeNarrationText(entry.message?.ka);

    if (!message) {
      return [];
    }

    return [`(voice: ${getVoiceByGender(entry.gender)})`, message];
  });

  if (dialogueParagraphs.length === 0) {
    throw new Error("The dialogue does not contain Georgian narration.");
  }

  return [`---\nvoice-volume: normalized\n---`, ...dialogueParagraphs].join(
    "\n\n",
  );
};

const buildNarakeetScript = (result: GeneratedTextResult): string => {
  if (Array.isArray(result.conversation) && result.conversation.length > 0) {
    return buildDialogueScript(result.conversation);
  }

  if (result.monologue) {
    return buildMonologueScript(result.monologue);
  }

  throw new Error(
    "No dialogue or monologue content is available for MP3 generation.",
  );
};

const readErrorMessage = async (response: Response): Promise<string> => {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const data = (await response.json()) as { message?: string };

    return data.message ?? `Narakeet API error: ${response.status}`;
  }

  const text = await response.text();

  return text || `Narakeet API error: ${response.status}`;
};

const requestStreamingMp3 = async (
  script: string,
  apiKey: string,
): Promise<Uint8Array<ArrayBuffer>> => {
  const response = await fetch(NARAKEET_MP3_ENDPOINT, {
    method: "POST",
    headers: {
      Accept: "application/octet-stream",
      "Content-Type": "text/plain",
      "x-api-key": apiKey,
    },
    body: script,
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  return new Uint8Array(await response.arrayBuffer());
};

const requestPollingJob = async (
  script: string,
  apiKey: string,
): Promise<string> => {
  const response = await fetch(NARAKEET_MP3_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain",
      "x-api-key": apiKey,
    },
    body: script,
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  const data = (await response.json()) as NarakeetStartResponse;

  if (!data.statusUrl) {
    throw new Error(data.message || "Narakeet did not return a status URL.");
  }

  return data.statusUrl;
};

const waitForPollingResult = async (statusUrl: string): Promise<string> => {
  for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt += 1) {
    const response = await fetch(statusUrl);

    if (!response.ok) {
      throw new Error(await readErrorMessage(response));
    }

    const data = (await response.json()) as NarakeetStatusResponse;

    if (data.finished) {
      if (data.succeeded && data.result) {
        return data.result;
      }

      throw new Error(
        data.message || "Narakeet failed to generate the audio file.",
      );
    }

    await sleep(POLL_INTERVAL_MS);
  }

  throw new Error("Narakeet audio generation timed out.");
};

const downloadPollingResult = async (
  resultUrl: string,
): Promise<Uint8Array<ArrayBuffer>> => {
  const response = await fetch(resultUrl);

  if (!response.ok) {
    throw new Error(`Failed to download the generated MP3: ${response.status}`);
  }

  return new Uint8Array(await response.arrayBuffer());
};

export async function generateMP3(
  result: GeneratedTextResult,
): Promise<Uint8Array<ArrayBuffer>> {
  const script = buildNarakeetScript(result);
  const apiKey = getApiKey();
  const scriptSize = new TextEncoder().encode(script).byteLength;

  if (scriptSize <= STREAMING_API_MAX_BYTES) {
    return requestStreamingMp3(script, apiKey);
  }

  const statusUrl = await requestPollingJob(script, apiKey);
  const resultUrl = await waitForPollingResult(statusUrl);

  return downloadPollingResult(resultUrl);
}
