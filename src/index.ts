import WebSocketImpl from "isomorphic-ws";

export type DritanClientOptions = {
  apiKey: string;
  baseUrl?: string;
  wsBaseUrl?: string;
  fetch?: typeof fetch;
  WebSocket?: typeof WebSocketImpl;
};

export type TokenPriceResponse = {
  mint: string;
  quoteMint: string;
  price: number;
  pool: {
    dex: string;
    poolAddress: string;
    liquidityUsd?: number | null;
  };
  slot?: number | null;
  ts?: string;
};

export type TokenMetadataResponse = {
  mint: string;
  programId: string;
  name: string;
  symbol: string;
  uri: string;
  decimals: number;
  supply: string;
};

export type DritanStreamOptions = {
  query?: Record<string, string | number | boolean | undefined | null>;
  /**
   * When true, includes the api key as `?apiKey=...` in the websocket URL.
   * This is required when using native browser websockets (custom headers are not supported).
   */
  sendApiKeyInQuery?: boolean;
  onOpen?: () => void;
  onClose?: (ev: CloseEvent) => void;
  onError?: (ev: Event) => void;
  onMessage?: (data: unknown) => void;
};

export type DritanStreamHandle = {
  socket: WebSocket;
  close: () => void;
};

function buildUrl(baseUrl: string, path: string): string {
  return `${baseUrl.replace(/\/+$/, "")}${path.startsWith("/") ? "" : "/"}${path}`;
}

function buildWsUrl(
  wsBaseUrl: string,
  path: string,
  query?: Record<string, string | number | boolean | undefined | null>
): string {
  const url = new URL(buildUrl(wsBaseUrl, path));
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v === undefined || v === null) continue;
      url.searchParams.set(k, String(v));
    }
  }
  return url.toString();
}

function safeJsonParse(payload: string): unknown {
  try {
    return JSON.parse(payload) as unknown;
  } catch {
    return payload;
  }
}

function isNodeRuntime(): boolean {
  return (
    typeof process !== "undefined" &&
    typeof (process as any).versions?.node === "string"
  );
}

function messageToString(data: unknown): string | null {
  if (typeof data === "string") return data;

  // ws (node) can emit Buffer
  if (typeof Buffer !== "undefined" && Buffer.isBuffer(data)) {
    return data.toString("utf8");
  }

  // browser ws can emit ArrayBuffer
  if (data instanceof ArrayBuffer) {
    return new TextDecoder().decode(new Uint8Array(data));
  }

  return null;
}

export class DritanClient {
  readonly apiKey: string;
  readonly baseUrl: string;
  readonly wsBaseUrl: string;
  private readonly fetchImpl: typeof fetch;
  private readonly WebSocketCtor: typeof WebSocketImpl;

  constructor(options: DritanClientOptions) {
    this.apiKey = options.apiKey;
    this.baseUrl = options.baseUrl ?? "https://us-east.dritan.dev";
    this.wsBaseUrl = options.wsBaseUrl ?? "wss://us-east.dritan.dev";
    this.fetchImpl = options.fetch ?? fetch;
    this.WebSocketCtor = options.WebSocket ?? WebSocketImpl;
  }

  async getTokenPrice(mint: string): Promise<TokenPriceResponse> {
    const url = buildUrl(this.baseUrl, `/token/price/${encodeURIComponent(mint)}`);
    const res = await this.fetchImpl(url, {
      method: "GET",
      headers: {
        "x-api-key": this.apiKey
      }
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Dritan request failed (${res.status}): ${text || res.statusText}`);
    }

    return (await res.json()) as TokenPriceResponse;
  }

  async getTokenMetadata(mint: string): Promise<TokenMetadataResponse> {
    const url = buildUrl(this.baseUrl, `/token/metadata/${encodeURIComponent(mint)}`);
    const res = await this.fetchImpl(url, {
      method: "GET",
      headers: {
        "x-api-key": this.apiKey
      }
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Dritan request failed (${res.status}): ${text || res.statusText}`);
    }

    return (await res.json()) as TokenMetadataResponse;
  }

  streamDex(dex: string, options: DritanStreamOptions = {}): DritanStreamHandle {
    const shouldSendKeyInQuery = options.sendApiKeyInQuery ?? !isNodeRuntime();
    const query = { ...(options.query ?? {}) } as Record<
      string,
      string | number | boolean | undefined | null
    >;
    if (shouldSendKeyInQuery && query.apiKey == null) {
      query.apiKey = this.apiKey;
    }

    const url = buildWsUrl(this.wsBaseUrl, `/${dex}`, query);
    const ws = shouldSendKeyInQuery
      ? new this.WebSocketCtor(url)
      : new this.WebSocketCtor(
          url,
          {
            headers: {
              "x-api-key": this.apiKey
            }
          } as any
        );

    ws.onopen = () => options.onOpen?.();
    ws.onclose = (ev: any) => options.onClose?.(ev as CloseEvent);
    ws.onerror = (ev: any) => options.onError?.(ev as Event);
    ws.onmessage = (msg: any) => {
      const raw = messageToString(msg.data);
      const data = raw ? safeJsonParse(raw) : msg.data;
      options.onMessage?.(data);
    };

    return {
      socket: ws as unknown as WebSocket,
      close: () => ws.close()
    };
  }
}

export const createClient = (options: DritanClientOptions) => new DritanClient(options);
