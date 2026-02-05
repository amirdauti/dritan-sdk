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

Connect to a dex stream (for example `pumpamm`, `pumpfun`, `dbc`, `dlmm`, `damm2`, `damm1`).

```ts
const stream = client.streamDex("pumpamm", {
  onMessage: (event) => {
    // `event` is parsed JSON when possible, otherwise raw string.
    console.log(event);
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
