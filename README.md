# Scrumlord
## Behold, the world's only story point estimation tool
May your development team be unshackled from the burden of counting fingers or ad-bloated nonsense tools dredged from the recesses of the internet.

Experience the real thing at https://s.crumlord.com

## Press
Scrumlord is a lightweight, ad-free story point estimation tool featuring:
* Private and public team rooms
* Lurker mode
* Real-time voting and reactions
* Flexible voting schemes
* Kick-ass animated backgrounds
* Voting timer
* Fireworks

<img width="1418" alt="image" src="https://github.com/nbpeth/scrum-lord/assets/10249534/ca9c1fc5-9c4a-4b4e-88bc-47fe26765039">
<img width="1433" alt="image" src="https://github.com/nbpeth/scrum-lord/assets/10249534/a40d5be8-4824-474d-900e-9b929f583aaf">

## What's inside
Scrumlord is as simple as I could think to make it. It's a monorepo with two pieces:

* **UI** (repo root) — a React app built with [Vite](https://vitejs.dev/). MUI for
  components, tsParticles for the animated backgrounds, and a WebSocket connection
  to the API for all the real-time voting/reactions.
* **API** (`./api`) — an Express + [`ws`](https://github.com/websockets/ws)
  WebSocket server backed by Postgres. All room state lives in a single
  `communities` table as JSON.

The browser talks to the API over a single WebSocket; there is no REST layer.

You can deploy your own scrumlord with docker-compose, see below.

## Running locally
Two ways: all-in-one with Docker Compose, or running each piece natively.

### With Docker Compose (recommended)
One command brings up Postgres (schema auto-applied on first boot), the API, and the
UI — all on a single port, with hot reload:
```sh
docker compose up
```
Then open http://localhost:8080.

* Everything is served from `:8080`, single-origin like production; the UI's
  WebSocket is proxied through to the API, so there's nothing to configure.
* Editing anything under `src/` hot-reloads the browser — the source is bind-mounted
  into the UI container.
* First run installs dependencies into Docker volumes (a minute or two); later starts
  are fast. Stop with `Ctrl-C` or `docker compose down` (add `-v` to also wipe the
  database and cached dependencies).

### Without Docker
Run each piece yourself: Postgres, the API server (`:8080`), and the Vite dev server
(`:3000`). Note the UI is on `:3000` here and talks to the API on `:8080` directly —
unlike the Compose setup, which serves everything from `:8080`.

**Prerequisites:** Node 20+, Yarn, and Docker (for Postgres).

1. **Install dependencies** (root and API):
   ```sh
   yarn install
   yarn --cwd api install
   ```

2. **Start Postgres.** The compose file launches a pre-configured instance and
   auto-applies the schema from `./api/db-ddl.sql` on first boot:
   ```sh
   docker-compose up -d postgres
   ```
   (Prefer your own Postgres on `:5432`? Match the credentials in
   `docker-compose.yaml` and run `./api/db-ddl.sql` by hand.)

3. **Start the API server** (Express + WebSocket on `:8080`):
   ```sh
   yarn start:api:local
   ```

4. **Start the UI** (Vite dev server on `:3000`):
   ```sh
   yarn start:ui
   ```

Then open http://localhost:3000.

The local scripts bake in a dev API key (`key123`) so there's no env setup to do —
WebSocket auth is only enforced in production anyway.

## Testing
* **UI unit tests** (Vitest): `yarn test`
* **API unit tests** (Jest): `yarn --cwd api test`
* **End-to-end** (Cypress) — start the full stack above, then:
  * `yarn cy:run` headless, or `yarn cy:open` for the interactive runner.
  * Cypress defaults to the native UI on `:3000`. To point it at the Docker stack,
    add `--config baseUrl=http://localhost:8080`.

CI runs all three on every push (`.github/workflows/cypress.yml`).

## Project structure
```
├── index.html            # Vite entry
├── vite.config.js
├── src/
│   ├── main.jsx          # app bootstrap
│   ├── App.jsx           # theme + router
│   ├── pages/            # Dashboard (room list) and Community (a room)
│   ├── components/       # UI; each has a sibling *.styles.js for its styles
│   ├── hooks/            # useCommunity / useDashboard (WebSocket) + useSettings
│   └── util/             # socket config, vote options, reactions
├── api/
│   ├── server.js         # WebSocket wiring + connection lifecycle
│   ├── lib/              # message handlers, auth, broadcast, hotdog alert
│   ├── communityClient.js / postgresClient.js  # data access
│   └── db-ddl.sql        # schema
└── cypress/e2e/          # dashboard / room-voting / room-management specs
```

### Environment variables
In production these must be set (Heroku config vars); locally the scripts provide them:

| Variable | Used by | Purpose |
| --- | --- | --- |
| `VITE_API_KEY` | UI (build time) | Shared secret sent on the WebSocket connection |
| `VITE_SERVER_PORT` | UI | API port to connect to (omit to use the page's own host) |
| `API_KEY` | API | Must match `VITE_API_KEY`; validated in production |
| `ALLOWED_ORIGINS` | API | Comma-separated origin allowlist (production) |
| `DATABASE_URL` | API | Postgres connection string |


## Disclaimer
Scrumlord is a hobby project. It's a delightful hot mess developed in stolen moments between the myriad of other things that one spends their life doing. If you find an issue, please report it here. https://github.com/nbpeth/scrum-lord/issues

If you want to add features or make changes, yeah sure, pop open a PR - I'd be happy to see some flow through.

Happy pointing!
