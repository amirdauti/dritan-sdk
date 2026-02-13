# dritan-sdk

TypeScript SDK for Dritan's data plane REST API and websocket streams.

## Install

```bash
npm i dritan-sdk
```

## Quickstart

```ts
import { DritanClient } from "dritan-sdk";

const client = new DritanClient({
  apiKey: process.env.DRITAN_API_KEY!,
  baseUrl: "https://us-east.dritan.dev",
  controlBaseUrl: "https://api.dritan.dev"
});

const price = await client.getTokenPrice("So11111111111111111111111111111111111111112");
console.log(price);
```

## REST

### x402 Agent API key flow (time-limited keys)

Use this flow when an agent needs to provision a temporary Dritan key after a Solana payment.

Pricing is fixed at **0.00085 SOL per minute**.

```ts
const pricing = await client.getX402Pricing();
console.log(pricing.rateSolPerMinute); // 0.00085

// 1) Create quote (duration -> exact SOL amount + receiver wallet)
const quote = await client.createX402ApiKeyQuote({
  durationMinutes: 120,
  name: "agent-session-2h",
});

console.log(quote.receiverWallet, quote.amountSol, quote.quoteId);

// 2) User sends SOL to quote.receiverWallet, then submit tx signature
const created = await client.createX402ApiKey({
  quoteId: quote.quoteId,
  paymentTxSignature: "5K8Hv...ConfirmedTransferSignature",
});

console.log(created.apiKey, created.expiresAt);
```

### Token search (ticker -> mint)

Use this when users give symbols like `$WIF` and you need the mint before requesting price/candles.

```ts
const search = await client.searchTokens("WIF", { limit: 10 });
const first = search.data?.[0] ?? search.results?.[0] ?? search.tokens?.[0];
const mint = String(first?.mint ?? first?.tokenAddress ?? "");
console.log(mint);
```

### Token price

```ts
const price = await client.getTokenPrice("So11111111111111111111111111111111111111112");
console.log(price.priceUsd);
```

### Token metadata

```ts
const md = await client.getTokenMetadata("So11111111111111111111111111111111111111112");
console.log(md.name, md.symbol, md.decimals);
```

### Token risk

```ts
const risk = await client.getTokenRisk("So11111111111111111111111111111111111111112");
console.log(risk.globalFeesPaid, risk.top10);
```

### First buyers (up to 100)

```ts
const res = await client.getFirstBuyers("So11111111111111111111111111111111111111112");
console.log(res.buyers);
```

### Aggregated token data

```ts
const agg = await client.getTokenAggregated("So11111111111111111111111111111111111111112");
console.log(agg.price.priceUsd, agg.metadata?.name, agg.risk?.top10, agg.bondingCurvePercent);
```

### Deployer stats

Given a token mint, returns the deployer/creator wallet along with how many tokens they've launched that have completed bonding (often called "graduated").

```ts
const stats = await client.getDeployerStats("So11111111111111111111111111111111111111112");
console.log(stats.deployer, stats.bonded, stats.nonBonded);
```

### OHLCV candles

Fetch OHLCV candles at a given interval. Candles are combined across bonding + graduated pools when possible.

```ts
const candles = await client.getTokenOhlcv("So11111111111111111111111111111111111111112", "1m");
console.log(candles.closed.length, candles.active?.close);
```

Ticker-first chart flow:

```ts
const search = await client.searchTokens("WIF", { limit: 1 });
const mint = String(
  search.data?.[0]?.mint ??
    search.data?.[0]?.tokenAddress ??
    search.results?.[0]?.mint ??
    search.results?.[0]?.tokenAddress ??
    ""
);
const candles = await client.getTokenOhlcv(mint, "1m");
console.log(mint, candles.closed.length);
```

## Wallet Analytics

### Wallet performance (PnL)

```ts
const pnl = await client.getWalletPerformance("YourWalletPubkeyHere", {
  // all optional
  showHistoricPnL: true,
  holdingCheck: false,
  hideDetails: false
});
console.log(pnl);
```

### Token-specific performance (PnL)

```ts
const tokenPnl = await client.getWalletTokenPerformance(
  "YourWalletPubkeyHere",
  "So11111111111111111111111111111111111111112"
);
console.log(tokenPnl);
```

### Portfolio chart

```ts
const chart = await client.getWalletPortfolioChart("YourWalletPubkeyHere", { days: 30 });
console.log(chart.total, Object.keys(chart.history).length);
```

### Basic wallet information

```ts
const info = await client.getBasicWalletInformation("YourWalletPubkeyHere");
console.log(info.totalSol, info.totalValue, info.holdings);
```

### Trade history (no `image` field)

```ts
const trades = await client.getWalletTradeHistory("YourWalletPubkeyHere");
console.log(trades.trades.length, trades.hasNextPage);
```

### Holdings (no `image` field)

```ts
const holdings = await client.getWalletHoldings("YourWalletPubkeyHere");
console.log(holdings.totalSol, holdings.tokens.length);

const holdingsPage1 = await client.getWalletHoldingsPage("YourWalletPubkeyHere", 1);
console.log(holdingsPage1.tokens.length);
```

## Swap

Dritan can build an unsigned swap transaction (base64) for you to sign, then you broadcast the signed transaction.

```ts
import { Connection, VersionedTransaction } from "@solana/web3.js";

const build = await client.buildSwap({
  userPublicKey: wallet.publicKey.toBase58(),
  inputMint: "So11111111111111111111111111111111111111112",
  outputMint: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
  amount: 100_000_000, // lamports
  slippageBps: 500,
  swapType: "buy",
  // Optional: monetize swaps for your own users
  feeWallet: "YourFeeWalletPubkeyHere",
  feePercent: 0.5
});

const tx = VersionedTransaction.deserialize(Buffer.from(build.transactionBase64, "base64"));
const signed = await wallet.signTransaction(tx);
const signedBase64 = Buffer.from(signed.serialize()).toString("base64");

const sent = await client.broadcastSwap(signedBase64);
console.log(sent.signature);
```

## Websocket streams

Connect to a dex stream (for example `pumpamm` (PumpSwap), `pumpfun` (Pump.fun), `moonit` (Moonit), `launchlab` (Raydium LaunchLab), `amm`, `cpmm`, `clmm`, `orca` (Orca Whirlpools), `dbc` (Meteora DBC), `dlmm`, `damm2`, `damm1`).

```ts
import type { DexStreamPoolPayload } from "dritan-sdk";

const stream = client.streamDex<DexStreamPoolPayload>("amm", {
  onMessage: (event) => {
    console.log(
      event.poolId,
      event.pricePerCoinUsd,
      event.liquidity.totalLiquiditySolana,
      event.liquidity.totalLiquidityUsdc
    );
  }
});

setTimeout(() => stream.close(), 10_000);
```

### Wallet stream

Wallet monitoring uses `/wallet-stream` and supports runtime subscription methods.

```ts
import { DritanClient, type WalletStreamEnvelope } from "dritan-sdk";

const client = new DritanClient({ apiKey: "YOUR_KEY" });
const walletStream = client.streamWallets<WalletStreamEnvelope>({
  wallets: ["FV1r15rbNKkJanXLheoJA7fXEq6NDuMJ3bukXuhJWyV1"],
  onMessage: (event) => {
    if (event.type === "message" && event.data) {
      console.log(event.data.wallet, event.data.type, event.data.tx);
    }
  }
});

walletStream.subscribeWallets(["7Y...AnotherWallet"]);
walletStream.unsubscribeWallets(["7Y...AnotherWallet"]);
walletStream.listSubscriptions();
```

Example wallet event payload:

```json
{
  "type": "message",
  "data": {
    "tx": "5K8Hv...",
    "wallet": "FV1r15rbNKkJanXLheoJA7fXEq6NDuMJ3bukXuhJWyV1",
    "time": 1760272205000,
    "slot": 398134973,
    "type": "swap",
    "solDelta": -0.00001,
    "feeSol": 0.00001,
    "balances": {
      "sol": {
        "pre": 14.221,
        "post": 14.22099,
        "delta": -0.00001
      },
      "tokens": [
        {
          "mint": "2zMMhcVQEXDtdE6vsFS7S7D5oUodfJHE8vd1gnBouauv",
          "tokenAccount": "8Jf6JxqWDW1JpGbAWf6E6cXJY22gNbEzM7r4rZn3rP8Q",
          "pre": 33320.37,
          "post": 0,
          "delta": -33320.37
        },
        {
          "mint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
          "tokenAccount": "5Q544fKrFoe6tsEb4QmQxjvCZXFv6TkxMVTscgt2hN6E",
          "pre": 0,
          "post": 751.75,
          "delta": 751.75
        }
      ]
    },
    "from": {
      "address": "2zMMhcVQEXDtdE6vsFS7S7D5oUodfJHE8vd1gnBouauv",
      "amount": 33320.37,
      "token": {
        "address": "2zMMhcVQEXDtdE6vsFS7S7D5oUodfJHE8vd1gnBouauv",
        "amount": -33320.37,
        "decimals": 6,
        "raw": "-33320371522"
      }
    },
    "to": {
      "address": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      "amount": 751.75,
      "token": {
        "address": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        "amount": 751.75,
        "decimals": 6,
        "raw": "751752741"
      }
    },
    "tokenDeltas": [
      {
        "address": "2zMMhcVQEXDtdE6vsFS7S7D5oUodfJHE8vd1gnBouauv",
        "amount": -33320.37,
        "decimals": 6,
        "raw": "-33320371522"
      },
      {
        "address": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        "amount": 751.75,
        "decimals": 6,
        "raw": "751752741"
      }
    ],
    "volume": {
      "usd": 751.75
    }
  }
}
```

Note: browser websockets cannot send custom headers. If you use this SDK in the browser, pass `sendApiKeyInQuery: true` (this puts your API key in the websocket URL).

## Configuration

`DritanClient` options:

- `apiKey` (required): API key to send as `x-api-key`
- `baseUrl` (optional): REST base URL (default `https://us-east.dritan.dev`)
- `wsBaseUrl` (optional): WS base URL (default `wss://us-east.dritan.dev`)

## Meteora THS (No API Key)

Meteora THS is a public REST API hosted at `https://ths.dritan.dev`.

```ts
import { MeteoraThsClient } from "dritan-sdk";

const ths = new MeteoraThsClient();

const score = await ths.getThsScore("7Y...Wallet");
console.log(score.score, score.realizedPnLUsd);

const tokensOnly = await ths.getThsScoreForTokens("7Y...Wallet", [
  "So11111111111111111111111111111111111111112",
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
]);
console.log(tokensOnly.score);
```
