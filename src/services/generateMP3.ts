import type { GeneratedMessage } from "@/types/audioGenerator";

const NARAKEET_MP3_ENDPOINT = "https://api.narakeet.com/text-to-speech/mp3";
const DEFAULT_NARAKEET_VOICE = "tornike";
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
  const apiKey = process.env.MP3_GENERATOR_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Missing MP3_GENERATOR_API_KEY or API_KEY in your environment.",
    );
  }

  return apiKey;
};

const getMp3Endpoint = (): string => {
  const configuredEndpoint = process.env.MP3_GENERATOR_ENDPOINT?.trim();
  const configuredVoice = process.env.MP3_GENERATOR_VOICE?.trim();
  const endpoint = configuredEndpoint || NARAKEET_MP3_ENDPOINT;

  let url: URL;

  try {
    url = new URL(endpoint);
  } catch {
    throw new Error(
      "MP3_GENERATOR_ENDPOINT is not a valid URL. Check your environment configuration.",
    );
  }

  if (!url.searchParams.has("voice")) {
    url.searchParams.set("voice", configuredVoice || DEFAULT_NARAKEET_VOICE);
  }

  return url.toString();
};

const normalizeNarrationText = (value: string | undefined): string =>
  (value ?? "").replace(/\s+/gu, " ").trim();

const buildTextScript = (message: GeneratedMessage): string => {
  const messageKa = normalizeNarrationText(message.ka);

  if (!messageKa) {
    throw new Error("The text does not contain Georgian narration.");
  }

  const voice = "male";

  return [
    `---`,
    `voice: ${voice}`,
    `voice-volume: normalized`,
    `---`,
    messageKa,
  ].join("\n");
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
  const endpoint = getMp3Endpoint();

  const response = await fetch(endpoint, {
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
  const endpoint = getMp3Endpoint();
  const response = await fetch(endpoint, {
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
  message: GeneratedMessage,
): Promise<Uint8Array<ArrayBuffer>> {
  const script = buildTextScript(message);
  const apiKey = getApiKey();
  const scriptSize = new TextEncoder().encode(script).byteLength;

  if (scriptSize <= STREAMING_API_MAX_BYTES) {
    return requestStreamingMp3(script, apiKey);
  }

  const statusUrl = await requestPollingJob(script, apiKey);
  const resultUrl = await waitForPollingResult(statusUrl);

  return downloadPollingResult(resultUrl);
}
