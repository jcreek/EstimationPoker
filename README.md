# EstimationPoker
A web app to allow scrum teams to easily perform estimations quickly and without unnecessary effort.

There are two components to this:

1. Frontend, built using SvelteKit
2. Realtime server, built using PartyKit (WebSocket-compatible)

## Frontend

For full functionality, ensure there is a PartyKit server running.

### Environment variables

The frontend uses PartyKit defaults unless overridden:

- `PUBLIC_PARTYKIT_HOST`: PartyKit host (defaults to `localhost:1999` in dev, `websocket.jcreek.co.uk` in production)
- `PUBLIC_PARTYKIT_PARTY`: Party name (defaults to `main`)

### Developing

Once you've installed dependencies with `npm install`, start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

### Building

To create a production version:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

### Favicon

This favicon was [generated](https://favicon.io/favicon-generator/) using the following font:

- Font Title: Fuzzy Bubbles
- Font Author: Copyright 2005 The Fuzzy Bubbles Project Authors (https://github.com/googlefonts/fuzzy-bubbles)
- Font Source: http://fonts.gstatic.com/s/fuzzybubbles/v5/6qLbKZMbrgv9pwtjPEVNV0F2Ds_WQxMAZkM1pn4.ttf
- Font License: SIL Open Font License, 1.1 (http://scripts.sil.org/OFL))

## WebSockets Server

### Developing

Install dependencies in `src/server`, then run the PartyKit dev server:

```bash
cd src/server
npm install
npx partykit dev
```

### Deploying

See the README in `src/server` for PartyKit deployment details.
