# Realtime Server (PartyKit)

This folder contains the PartyKit server that powers realtime estimation.

## Developing locally

```bash
cd src/server
npm install
npx partykit dev
```

By default the PartyKit dev server runs on `localhost:1999`. The frontend connects to that host when `PUBLIC_PARTYKIT_HOST` is not set.

## Deploying

PartyKit manages the server deployment. From this folder:

```bash
cd src/server
npx partykit deploy
```

You will be prompted to authenticate on first deploy. The PartyKit app name is defined in `partykit.json`.

## Frontend configuration

Set the following env vars in Netlify:

- `PUBLIC_PARTYKIT_HOST`: the PartyKit host (for example `websocket-server-party.jcreek.partykit.dev`)
- `PUBLIC_PARTYKIT_PARTY`: optional party name (defaults to `main`)
