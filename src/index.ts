import WebSocketImpl from "isomorphic-ws";

export type DritanClientOptions = {
  apiKey: string;
  baseUrl?: string;
  controlBaseUrl?: string;
  wsBaseUrl?: string;
  fetch?: typeof fetch;
  WebSocket?: typeof WebSocketImpl;
};

export type KnownDexStream =
  | "pumpamm"
  | "pumpfun"
  | "moonit"
  | "launchlab"
  | "amm"
  | "cpmm"
  | "clmm"
  | "orca"
  | "dlmm"
  | "damm2"
  | "damm1"
  | "dbc";

export type MeteoraThsClientOptions = {
  baseUrl?: string;
  fetch?: typeof fetch;
};

export type TokenSearchOptions = {
  limit?: number;
  cursor?: string;
  page?: number;
};

export type TokenSearchResult = {
  mint?: string;
  tokenAddress?: string;
  symbol?: string;
  name?: string;
  [k: string]: unknown;
};

export type TokenSearchResponse = {
  query?: string;
  data?: TokenSearchResult[];
  tokens?: TokenSearchResult[];
  results?: TokenSearchResult[];
  cursor?: string | null;
  nextCursor?: string | null;
  [k: string]: unknown;
};

export type X402PricingResponse = {
  chain: "solana";
  rateSolPerMinute: number;
  rateLamportsPerMinute: number;
  receiverWallet: string | null;
  quoteTtlSeconds: number;
  keyLimits: {
    maxRps: number;
    maxConnections: number;
  };
  formula: string;
};

export type X402ApiKeyQuoteRequest = {
  durationMinutes: number;
  name?: string;
  scopes?: string[];
  payerWallet?: string;
};

export type X402ApiKeyQuoteResponse = {
  status: "payment_required";
  quoteId: string;
  receiverWallet: string;
  durationMinutes: number;
  amountLamports: number;
  amountSol: number;
  rateSolPerMinute: number;
  expiresAt: string;
  chain: "solana";
  paymentMethod: "solana_transfer";
};

export type X402ApiKeyCreateRequest = {
  quoteId: string;
  paymentTxSignature: string;
  payerWallet?: string;
  name?: string;
  scopes?: string[];
};

export type X402ApiKeyCreateResponse = {
  ok: true;
  apiKeyId: string;
  apiKey: string;
  keyPrefix: string;
  expiresAt: string;
  durationMinutes: number;
  payment: {
    quoteId: string;
    txSignature: string;
    payerWallet: string;
    receiverWallet: string;
    amountLamportsCredited: number;
    amountSolCredited: number;
  };
  tenant: {
    id: string;
    name: string;
    limits: {
      maxRps: number;
      maxConnections: number;
    };
  };
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

export type TokenDeployerStatsResponse = {
  mint: string;
  deployer: string;
  total: number;
  deployed: number;
  bonded: number;
  nonBonded: number;
};

export type OhlcvBar = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type TokenOhlcvResponse = {
  mint: string;
  timeframe: string;
  bucketSizeSec: number;
  bondingPoolId: string | null;
  graduatedPoolId: string | null;
  closed: OhlcvBar[];
  active: OhlcvBar | null;
};

export type StreamLiquidity = {
  basePooled: number | null;
  quotePooled: number | null;
  totalLiquiditySolana: number | null;
  totalLiquidityUsdc: number | null;
};

export type StreamMintPair = {
  base: string;
  quote: string;
};

export type StreamDecimals = {
  base: number | null;
  quote: number | null;
};

export type StreamReserves = {
  base: number | null;
  quote: number | null;
};

export type DexStreamPoolPayload = {
  poolId: string;
  mints: StreamMintPair;
  decimals: StreamDecimals;
  marketCap: number | null;
  pricePerCoin: number | null;
  liquidity: StreamLiquidity;
  pricePerCoinUsd: number | null;
  tokenSupply: number | null;
  reserves: StreamReserves;
  slot: number;
  signature?: string;
  context?: string;
  curvePercentage?: number | null;
  complete?: boolean;
};

export type WalletPnlTokenStats = Record<string, unknown>;

export type WalletPnlResponse = {
  tokens?: Record<string, WalletPnlTokenStats>;
  summary?: Record<string, unknown>;
  [k: string]: unknown;
};

export type WalletPortfolioChartResponse = {
  wallet: string;
  total: number;
  totalInvested: number;
  totalWins: number;
  totalLosses: number;
  winPercentage: number;
  history: Record<string, number>;
};

export type BasicWalletInformationResponse = {
  wallet: string;
  totalSol: number;
  totalTokenValue: number;
  totalValue: number;
  holdings: number;
  totalHoldingValue: number;
};

export type WalletTradeToken = {
  tokenAddress: string;
  name: string;
  symbol: string;
  decimals: number;
  amount: number;
  [k: string]: unknown;
};

export type WalletTrade = {
  tx: string;
  wallet: string;
  from?: WalletTradeToken;
  to?: WalletTradeToken;
  program?: string;
  time?: number;
  type?: string;
  [k: string]: unknown;
};

export type WalletTradesResponse = {
  trades: WalletTrade[];
  nextCursor?: string;
  hasNextPage?: boolean;
};

export type WalletTokenInfo = {
  name: string;
  symbol: string;
  mint: string;
  decimals: number;
  [k: string]: unknown;
};

export type WalletTokenPosition = {
  token: WalletTokenInfo;
  balance: number;
  value: number;
  [k: string]: unknown;
};

export type WalletHoldingsResponse = {
  wallet: string;
  totalSol?: number;
  tokens: WalletTokenPosition[];
  total?: number;
  totalTokens?: number;
  hasNextPage?: boolean;
  [k: string]: unknown;
};

export type DritanStreamOptions<TMessage = unknown> = {
  query?: Record<string, string | number | boolean | undefined | null>;
  /**
   * When true, includes the api key as `?apiKey=...` in the websocket URL.
   * This is required when using native browser websockets (custom headers are not supported).
   */
  sendApiKeyInQuery?: boolean;
  onOpen?: () => void;
  onClose?: (ev: CloseEvent) => void;
  onError?: (ev: Event) => void;
  onMessage?: (data: TMessage) => void;
};

export type DritanStreamHandle = {
  socket: WebSocket;
  close: () => void;
};

export type WalletStreamMethod =
  | "subscribeWallets"
  | "unsubscribeWallets"
  | "listSubscriptions";

export type WalletStreamCommand = {
  method: WalletStreamMethod;
  wallets?: string[];
};

export type WalletStreamTokenDelta = {
  address: string;
  amount: number;
  decimals: number;
  raw: string;
};

export type WalletStreamSide = {
  address: string;
  amount: number;
  token: WalletStreamTokenDelta;
};

export type WalletStreamVolume = {
  usd?: number;
  sol?: number;
};

export type WalletStreamSolBalance = {
  pre: number;
  post: number;
  delta: number;
};

export type WalletStreamTokenBalance = {
  mint: string;
  tokenAccount: string;
  pre: number;
  post: number;
  delta: number;
};

export type WalletStreamBalances = {
  sol: WalletStreamSolBalance;
  tokens: WalletStreamTokenBalance[];
};

export type WalletStreamData = {
  tx: string;
  wallet: string;
  time: number;
  slot: number;
  type: string;
  solDelta: number;
  feeSol: number;
  from?: WalletStreamSide;
  to?: WalletStreamSide;
  tokenDeltas: WalletStreamTokenDelta[];
  volume?: WalletStreamVolume;
  balances: WalletStreamBalances;
};

export type WalletStreamEnvelope = {
  type: string;
  data?: WalletStreamData;
  wallets?: string[];
  invalidWallets?: string[];
  subscriptions?: string[];
  subscriptionCount?: number;
  limitHit?: boolean;
  methods?: string[];
  maxWallets?: number;
  message?: string;
};

export type WalletStreamOptions<TMessage = WalletStreamEnvelope> = DritanStreamOptions<TMessage> & {
  wallets?: string[];
};

export type WalletStreamHandle = DritanStreamHandle & {
  subscribeWallets: (wallets: string[]) => void;
  unsubscribeWallets: (wallets: string[]) => void;
  listSubscriptions: () => void;
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

export type ThsTopWalletsEntry = ThsResponse & {
  rank: number;
};

export type ThsTopWalletsResponse = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
  data: ThsTopWalletsEntry[];
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
  readonly controlBaseUrl: string;
  readonly wsBaseUrl: string;
  private readonly fetchImpl: typeof fetch;
  private readonly WebSocketCtor: typeof WebSocketImpl;

  constructor(options: DritanClientOptions) {
    this.apiKey = options.apiKey;
    this.baseUrl = options.baseUrl ?? "https://us-east.dritan.dev";
    this.controlBaseUrl = options.controlBaseUrl ?? "https://api.dritan.dev";
    this.wsBaseUrl = options.wsBaseUrl ?? "wss://us-east.dritan.dev";
    this.fetchImpl = options.fetch ?? fetch;
    this.WebSocketCtor = options.WebSocket ?? WebSocketImpl;
  }

  async getX402Pricing(): Promise<X402PricingResponse> {
    const url = buildUrl(this.controlBaseUrl, "/v1/x402/pricing");
    const res = await this.fetchImpl(url, { method: "GET" });
    const text = await res.text().catch(() => "");
    let payload: unknown;
    try {
      payload = text ? JSON.parse(text) : {};
    } catch {
      payload = { raw: text };
    }

    if (!res.ok) {
      throw new Error(`Dritan request failed (${res.status}): ${text || res.statusText}`);
    }

    return payload as X402PricingResponse;
  }

  async createX402ApiKeyQuote(
    input: X402ApiKeyQuoteRequest
  ): Promise<X402ApiKeyQuoteResponse> {
    const url = buildUrl(this.controlBaseUrl, "/v1/x402/api-keys/quote");
    const res = await this.fetchImpl(url, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(input ?? {})
    });
    const text = await res.text().catch(() => "");
    let payload: unknown;
    try {
      payload = text ? JSON.parse(text) : {};
    } catch {
      payload = { raw: text };
    }

    if (!res.ok) {
      throw new Error(`Dritan request failed (${res.status}): ${text || res.statusText}`);
    }

    return payload as X402ApiKeyQuoteResponse;
  }

  async createX402ApiKey(
    input: X402ApiKeyCreateRequest
  ): Promise<X402ApiKeyCreateResponse> {
    const url = buildUrl(this.controlBaseUrl, "/v1/x402/api-keys");
    const res = await this.fetchImpl(url, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(input ?? {})
    });
    const text = await res.text().catch(() => "");
    let payload: unknown;
    try {
      payload = text ? JSON.parse(text) : {};
    } catch {
      payload = { raw: text };
    }

    if (!res.ok) {
      throw new Error(`Dritan request failed (${res.status}): ${text || res.statusText}`);
    }

    return payload as X402ApiKeyCreateResponse;
  }

  async searchTokens(query: string, opts?: TokenSearchOptions): Promise<TokenSearchResponse> {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      throw new Error("query is required");
    }

    const url = new URL(buildUrl(this.baseUrl, "/token/search"));
    url.searchParams.set("query", trimmedQuery);

    if (opts?.limit != null && Number.isFinite(opts.limit)) {
      const clamped = Math.max(1, Math.min(50, Math.trunc(opts.limit)));
      url.searchParams.set("limit", String(clamped));
    }

    const cursor = opts?.cursor?.trim();
    if (cursor) {
      url.searchParams.set("cursor", cursor);
    } else if (opts?.page != null && Number.isFinite(opts.page)) {
      const page = Math.max(1, Math.trunc(opts.page));
      url.searchParams.set("page", String(page));
    }

    const res = await this.fetchImpl(url.toString(), {
      method: "GET",
      headers: {
        "x-api-key": this.apiKey
      }
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Dritan request failed (${res.status}): ${text || res.statusText}`);
    }

    return (await res.json()) as TokenSearchResponse;
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

  async getDeployerStats(mint: string): Promise<TokenDeployerStatsResponse> {
    const url = buildUrl(this.baseUrl, `/token/deployer-stats/${encodeURIComponent(mint)}`);
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

    return (await res.json()) as TokenDeployerStatsResponse;
  }

  async getTokenOhlcv(
    mint: string,
    timeframe: string,
    opts?: { timeTo?: number }
  ): Promise<TokenOhlcvResponse> {
    const search = new URLSearchParams();
    if (opts?.timeTo != null) search.set("time_to", String(opts.timeTo));
    const qs = search.toString();

    const url = buildUrl(
      this.baseUrl,
      `/token/ohlcv/${encodeURIComponent(mint)}/${encodeURIComponent(timeframe)}${qs ? `?${qs}` : ""}`
    );

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

    return (await res.json()) as TokenOhlcvResponse;
  }

  async getWalletPerformance(
    wallet: string,
    opts?: { showHistoricPnL?: boolean; holdingCheck?: boolean; hideDetails?: boolean }
  ): Promise<WalletPnlResponse> {
    const url = new URL(buildUrl(this.baseUrl, `/wallet/performance/${encodeURIComponent(wallet)}`));
    if (opts?.showHistoricPnL != null) {
      url.searchParams.set("showHistoricPnL", opts.showHistoricPnL ? "true" : "false");
    }
    if (opts?.holdingCheck != null) {
      url.searchParams.set("holdingCheck", opts.holdingCheck ? "true" : "false");
    }
    if (opts?.hideDetails != null) {
      url.searchParams.set("hideDetails", opts.hideDetails ? "true" : "false");
    }

    const res = await this.fetchImpl(url.toString(), {
      method: "GET",
      headers: {
        "x-api-key": this.apiKey
      }
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Dritan request failed (${res.status}): ${text || res.statusText}`);
    }

    return (await res.json()) as WalletPnlResponse;
  }

  async getWalletTokenPerformance(wallet: string, tokenMint: string): Promise<WalletPnlTokenStats> {
    const url = buildUrl(
      this.baseUrl,
      `/wallet/performance/${encodeURIComponent(wallet)}/${encodeURIComponent(tokenMint)}`
    );
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

    return (await res.json()) as WalletPnlTokenStats;
  }

  async getWalletPortfolioChart(
    wallet: string,
    opts?: { days?: number }
  ): Promise<WalletPortfolioChartResponse> {
    const url = new URL(buildUrl(this.baseUrl, `/wallet/portfolio-chart/${encodeURIComponent(wallet)}`));
    if (opts?.days != null) url.searchParams.set("days", String(opts.days));

    const res = await this.fetchImpl(url.toString(), {
      method: "GET",
      headers: {
        "x-api-key": this.apiKey
      }
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Dritan request failed (${res.status}): ${text || res.statusText}`);
    }

    return (await res.json()) as WalletPortfolioChartResponse;
  }

  async getBasicWalletInformation(wallet: string): Promise<BasicWalletInformationResponse> {
    const url = buildUrl(this.baseUrl, `/wallet/summary/${encodeURIComponent(wallet)}`);
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

    return (await res.json()) as BasicWalletInformationResponse;
  }

  async getWalletTradeHistory(
    wallet: string,
    opts?: { cursor?: string }
  ): Promise<WalletTradesResponse> {
    const url = new URL(buildUrl(this.baseUrl, `/wallet/trade-history/${encodeURIComponent(wallet)}`));
    if (opts?.cursor) url.searchParams.set("cursor", opts.cursor);

    const res = await this.fetchImpl(url.toString(), {
      method: "GET",
      headers: {
        "x-api-key": this.apiKey
      }
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Dritan request failed (${res.status}): ${text || res.statusText}`);
    }

    return (await res.json()) as WalletTradesResponse;
  }

  async getWalletHoldings(wallet: string): Promise<WalletHoldingsResponse> {
    const url = buildUrl(this.baseUrl, `/wallet/holdings/${encodeURIComponent(wallet)}`);
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

    return (await res.json()) as WalletHoldingsResponse;
  }

  async getWalletHoldingsPage(wallet: string, page: number): Promise<WalletHoldingsResponse> {
    const url = buildUrl(
      this.baseUrl,
      `/wallet/holdings/${encodeURIComponent(wallet)}/page/${encodeURIComponent(String(page))}`
    );
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

    return (await res.json()) as WalletHoldingsResponse;
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

  streamDex<TMessage = unknown>(
    dex: KnownDexStream,
    options?: DritanStreamOptions<TMessage>
  ): DritanStreamHandle;
  streamDex<TMessage = unknown>(
    dex: string,
    options?: DritanStreamOptions<TMessage>
  ): DritanStreamHandle;
  streamDex<TMessage = unknown>(
    dex: string,
    options: DritanStreamOptions<TMessage> = {}
  ): DritanStreamHandle {
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
      options.onMessage?.(data as TMessage);
    };

    return {
      socket: ws as unknown as WebSocket,
      close: () => ws.close()
    };
  }

  streamWallets<TMessage = WalletStreamEnvelope>(
    options: WalletStreamOptions<TMessage> = {}
  ): WalletStreamHandle {
    const initialWallets = (options.wallets ?? [])
      .map((wallet) => wallet.trim())
      .filter((wallet) => wallet.length > 0);

    const stream = this.streamDex<TMessage>("wallet-stream", {
      ...options,
      onOpen: () => {
        options.onOpen?.();
        if (initialWallets.length > 0) {
          try {
            (stream.socket as any).send(
              JSON.stringify({
                method: "subscribeWallets",
                wallets: initialWallets
              } as WalletStreamCommand)
            );
          } catch {
            // no-op
          }
        }
      }
    });

    const sendWalletCommand = (command: WalletStreamCommand) => {
      const payload = JSON.stringify(command);
      try {
        (stream.socket as any).send(payload);
      } catch {
        // no-op
      }
    };

    return {
      ...stream,
      subscribeWallets: (wallets: string[]) =>
        sendWalletCommand({
          method: "subscribeWallets",
          wallets
        }),
      unsubscribeWallets: (wallets: string[]) =>
        sendWalletCommand({
          method: "unsubscribeWallets",
          wallets
        }),
      listSubscriptions: () =>
        sendWalletCommand({
          method: "listSubscriptions"
        })
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

  async getTopWalletsByScore(
    options: { page?: number; limit?: number } = {}
  ): Promise<ThsTopWalletsResponse> {
    const url = new URL(buildUrl(this.baseUrl, "/ths/top-wallets"));
    if (options.page !== undefined) url.searchParams.set("page", String(options.page));
    if (options.limit !== undefined) url.searchParams.set("limit", String(options.limit));

    const res = await this.fetchImpl(url.toString(), { method: "GET" });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Meteora THS request failed (${res.status}): ${text || res.statusText}`);
    }

    return (await res.json()) as ThsTopWalletsResponse;
  }
}

export const createMeteoraThsClient = (options?: MeteoraThsClientOptions) =>
  new MeteoraThsClient(options);
