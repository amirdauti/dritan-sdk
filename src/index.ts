import WebSocketImpl from "isomorphic-ws";

export type DritanClientOptions = {
  apiKey: string;
  baseUrl?: string;
  wsBaseUrl?: string;
  fetch?: typeof fetch;
  WebSocket?: typeof WebSocketImpl;
};

export type KnownDexStream =
  | "pumpamm"
  | "pumpfun"
  | "launchlab"
  | "dlmm"
  | "damm2"
  | "damm1"
  | "dbc";

export type MeteoraThsClientOptions = {
  baseUrl?: string;
  fetch?: typeof fetch;
};

export type TokenPriceResponse = {
  mint: string;
  dex: string;
  priceUsd: number;
  marketCap: number | null;
  liquiditySol: number | null;
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

export type RiskGroup = {
  count: number;
  totalPercentage: number;
};

export type TokenRiskResponse = {
  mint: string;
  globalFeesPaid: number;
  bundlers: RiskGroup;
  insiders: RiskGroup;
  snipers: RiskGroup;
  top10: number;
  devPercentage: number | null;
};

export type TokenFirstBuyersResponse = {
  mint: string;
  buyers: unknown;
};

export type TokenAggregatedResponse = {
  mint: string;
  price: TokenPriceResponse;
  metadata: TokenMetadataResponse | null;
  risk: TokenRiskResponse | null;
  bondingCurvePercent: number | null;
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

export type SwapBuildRequest = {
  userPublicKey: string;
  inputMint: string;
  outputMint: string;
  amount: number | string;
  slippageBps?: number;
  swapType?: string;
  feeWallet?: string;
  feeBps?: number;
  feePercent?: number;
};

export type SwapBuildFees = {
  platformFeeBps: number;
  platformFeeLamports: number;
  userFeeBps: number;
  userFeeLamports: number;
  tipLamports: number;
};

export type SwapBuildResponse = {
  transactionBase64: string;
  fees: SwapBuildFees;
  quote: unknown;
};

export type SwapBroadcastResponse = {
  signature: string;
};

export type ThsTotals = {
  buys: number;
  sells: number;
};

export type ThsResponse = {
  wallet: string;
  score: number;
  realizedPnLUsd: number;
  realizedPnLWeightedUsd: number;
  totals: ThsTotals;
  analyzedTxns: number;
  matchedTxCount: number;
  unmatchedTxCount: number;
  avgHoldTimeDays: number;
  avgHoldTimeHours: number;
  avgHoldTimeMinutes: number;
  avgHoldTimeSeconds: number;
  avgHoldTimePretty: string;
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

  async getTokenRisk(mint: string): Promise<TokenRiskResponse> {
    const url = buildUrl(this.baseUrl, `/token/risk/${encodeURIComponent(mint)}`);
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

    return (await res.json()) as TokenRiskResponse;
  }

  async getFirstBuyers(mint: string): Promise<TokenFirstBuyersResponse> {
    const url = buildUrl(this.baseUrl, `/token/first-buyers/${encodeURIComponent(mint)}`);
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

    return (await res.json()) as TokenFirstBuyersResponse;
  }

  async getTokenAggregated(mint: string): Promise<TokenAggregatedResponse> {
    const url = buildUrl(this.baseUrl, `/token/aggregated/${encodeURIComponent(mint)}`);
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

    const raw = (await res.json()) as any;
    return {
      mint: String(raw?.mint ?? mint),
      price: raw?.price as TokenPriceResponse,
      metadata: raw?.metadata ?? null,
      risk: raw?.risk ?? null,
      bondingCurvePercent:
        raw?.bondingCurvePercent === undefined ? null : (raw?.bondingCurvePercent ?? null)
    };
  }

  async buildSwap(body: SwapBuildRequest): Promise<SwapBuildResponse> {
    const url = buildUrl(this.baseUrl, "/swap/build");
    const res = await this.fetchImpl(url, {
      method: "POST",
      headers: {
        "x-api-key": this.apiKey,
        "content-type": "application/json"
      },
      body: JSON.stringify(body ?? {})
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Dritan request failed (${res.status}): ${text || res.statusText}`);
    }

    return (await res.json()) as SwapBuildResponse;
  }

  async broadcastSwap(signedTransactionBase64: string): Promise<SwapBroadcastResponse> {
    const url = buildUrl(this.baseUrl, "/swap/broadcast");
    const res = await this.fetchImpl(url, {
      method: "POST",
      headers: {
        "x-api-key": this.apiKey,
        "content-type": "application/json"
      },
      body: JSON.stringify({ signedTransactionBase64 })
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Dritan request failed (${res.status}): ${text || res.statusText}`);
    }

    return (await res.json()) as SwapBroadcastResponse;
  }

  streamDex(dex: KnownDexStream, options?: DritanStreamOptions): DritanStreamHandle;
  streamDex(dex: string, options?: DritanStreamOptions): DritanStreamHandle;
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

export class MeteoraThsClient {
  readonly baseUrl: string;
  private readonly fetchImpl: typeof fetch;

  constructor(options: MeteoraThsClientOptions = {}) {
    this.baseUrl = options.baseUrl ?? "https://ths.dritan.dev";
    this.fetchImpl = options.fetch ?? fetch;
  }

  async health(): Promise<boolean> {
    const url = buildUrl(this.baseUrl, "/health");
    const res = await this.fetchImpl(url, { method: "GET" });
    return res.ok;
  }

  async getThsScore(
    wallet: string,
    options: { debug?: boolean; breakdown?: boolean } = {}
  ): Promise<ThsResponse> {
    const url = new URL(buildUrl(this.baseUrl, `/ths/${encodeURIComponent(wallet)}`));
    if (options.debug) url.searchParams.set("debug", "1");
    if (options.breakdown) url.searchParams.set("breakdown", "1");

    const res = await this.fetchImpl(url.toString(), { method: "GET" });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Meteora THS request failed (${res.status}): ${text || res.statusText}`);
    }

    return (await res.json()) as ThsResponse;
  }

  async getThsScoreForTokens(
    wallet: string,
    tokenMints: string[],
    options: { debug?: boolean; breakdown?: boolean } = {}
  ): Promise<ThsResponse> {
    const url = new URL(buildUrl(this.baseUrl, `/ths/${encodeURIComponent(wallet)}/tokens`));
    for (const mint of tokenMints ?? []) {
      url.searchParams.append("tokenMints", mint);
    }
    if (options.debug) url.searchParams.set("debug", "1");
    if (options.breakdown) url.searchParams.set("breakdown", "1");

    const res = await this.fetchImpl(url.toString(), { method: "GET" });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Meteora THS request failed (${res.status}): ${text || res.statusText}`);
    }

    return (await res.json()) as ThsResponse;
  }

  async postThsScoreForTokens(
    wallet: string,
    tokenMints: string[],
    options: { debug?: boolean; breakdown?: boolean } = {}
  ): Promise<ThsResponse> {
    const url = new URL(buildUrl(this.baseUrl, `/ths/${encodeURIComponent(wallet)}/tokens`));
    if (options.debug) url.searchParams.set("debug", "1");
    if (options.breakdown) url.searchParams.set("breakdown", "1");

    const res = await this.fetchImpl(url.toString(), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ tokenMints: tokenMints ?? [] })
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Meteora THS request failed (${res.status}): ${text || res.statusText}`);
    }

    return (await res.json()) as ThsResponse;
  }
}

export const createMeteoraThsClient = (options?: MeteoraThsClientOptions) =>
  new MeteoraThsClient(options);
