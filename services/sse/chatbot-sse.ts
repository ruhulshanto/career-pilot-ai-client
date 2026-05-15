import { chatbotApi } from "../api/chatbot";
import { refreshAccessToken } from "../api/client";
import { useAuthStore } from "@/shared/store/auth-store";

export interface SSEOptions {
  onMessage: (data: any) => void;
  onOpen?: () => void;
  onError?: (error: any) => void;
  onDone?: (data: any) => void;
  onEnd?: (data?: any) => void;
}

const parseEventData = (event: MessageEvent) => {
  try {
    return JSON.parse(event.data);
  } catch {
    return null;
  }
};

const dispatchSseEvent = (rawEvent: string, options: SSEOptions) => {
  const lines = rawEvent.split(/\r?\n/);
  let eventName = "message";
  const dataLines: string[] = [];

  for (const line of lines) {
    if (line.startsWith("event:")) {
      eventName = line.slice("event:".length).trim() || "message";
    }

    if (line.startsWith("data:")) {
      dataLines.push(line.slice("data:".length).trimStart());
    }
  }

  if (!dataLines.length) return;

  const data = parseEventData({ data: dataLines.join("\n") } as MessageEvent);
  if (!data) return;

  if (eventName === "done") {
    options.onDone?.(data);
    return;
  }

  if (eventName === "end") {
    options.onEnd?.(data);
    return;
  }

  options.onMessage(data);
};

const getAccessToken = async () =>
  useAuthStore.getState().accessToken || (await refreshAccessToken());

const openStream = async (
  streamUrl: string,
  options: SSEOptions,
  signal: AbortSignal,
  retryAfterRefresh = true,
) => {
  const token = await getAccessToken();

  if (!token) {
    throw new Error("Authentication required");
  }

  const response = await fetch(streamUrl, {
    credentials: "include",
    headers: {
      Accept: "text/event-stream",
      Authorization: `Bearer ${token}`,
    },
    signal,
  });

  if (response.status === 401 && retryAfterRefresh) {
    useAuthStore.getState().clearSession();
    const refreshedToken = await refreshAccessToken();
    if (refreshedToken) {
      return openStream(streamUrl, options, signal, false);
    }
  }

  if (!response.ok || !response.body) {
    throw new Error(`SSE connection failed with status ${response.status}`);
  }

  options.onOpen?.();

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (!signal.aborted) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const events = buffer.split(/\r?\n\r?\n/);
    buffer = events.pop() ?? "";

    for (const event of events) {
      dispatchSseEvent(event, options);
    }
  }

  buffer += decoder.decode();
  if (buffer.trim()) {
    dispatchSseEvent(buffer, options);
  }
};

export const chatbotSSE = {
  connect: (sessionId: string, options: SSEOptions) => {
    const streamUrl = chatbotApi.getStreamUrl(sessionId);
    const controller = new AbortController();

    void openStream(streamUrl, options, controller.signal).catch((error) => {
      if (controller.signal.aborted) return;
      options.onError?.(error);
    });

    return () => {
      controller.abort();
    };
  },
};
