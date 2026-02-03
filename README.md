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
```

### Token metadata

```ts
const md = await client.getTokenMetadata("So11111111111111111111111111111111111111112");
console.log(md.name, md.symbol, md.decimals);
```

## Websocket streams

Connect to a dex stream (for example `pumpamm`, `dlmm`, `damm2`, `damm1`).

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
