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
  baseUrl: "https://us-east.dritan.dev"
});

const price = await client.getTokenPrice("So11111111111111111111111111111111111111112");
console.log(price);
```

## REST

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
