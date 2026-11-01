# LarpedIn

LarpedIn is a personal-brand workspace for looking the part and finding
something worth saying. It combines a headshot studio with calendar-driven
content ideas so users can create a professional portrait, spot meaningful
events, and turn those events into ready-to-edit social posts.

## What the app does

- **Portrait studio** — Compose a studio-style headshot by choosing a portrait,
  outfit, and backdrop. The studio is available publicly at `/studio`, so a
  user can create a portrait before signing in.
- **Overview** — See the current portrait, post queue, content signals, and
  upcoming events in one place.
- **Calendar signals** — Connect Google Calendar, review upcoming events, and
  choose whether LarpedIn should use those events for suggestions, reminders,
  and LinkedIn content.
- **Content workspace** — Review signals and create drafts for LinkedIn or X.
  The post generator uses the selected event, tone, industry, and platform to
  produce a focused first-person draft without inventing details.
- **Authentication** — Sign up, sign in, reset a password, and use the
  OAuth callback flow through Base44.
- **Theme support** — Switch between the app’s light and dark themes from the
  shared shell.

The main app routes are:

| Route | Purpose |
| --- | --- |
| `/studio` | Public headshot studio |
| `/overview` | Personalized dashboard |
| `/calendar` | Calendar connection and event signals |
| `/content` | Content signals, drafts, and post generation |

## Tech stack

- React 18 and Vite
- React Router
- Tailwind CSS and Radix UI components
- TanStack Query
- Base44 SDK and Base44 Vite plugin
- Base44 Core AI integration for post generation
- Google OAuth for calendar access

## Repository layout

```text
src/
  api/          Base44 SDK client and API helpers
  components/   Shared layout, UI, calendar, content, and studio components
  lib/          Authentication, calendar, image, theme, and generator helpers
  pages/        Landing, auth, overview, studio, calendar, and content routes
base44/
  entities/     Base44 data definitions
  functions/    Server-side Base44 functions
  config.json   Local install, build, serve, and output configuration
```

The repository also contains `larpedin-ai/` and `render-workflow/` for related
experiments and rendering workflows. The main app described above is the
Vite application in the repository root.

## Prerequisites

- Node.js and npm
- A linked Base44 app
- [Deno](https://docs.deno.com/runtime/getting_started/installation/) for the
  local Base44 backend
- The Base44 CLI:

  ```bash
  npm install -g base44@latest
  ```

## Run locally

From the repository root:

```bash
npm install
base44 login   # one-time per machine
base44 link    # one-time per clone
base44 dev
```

Open the frontend URL printed by `base44 dev` (typically
`http://localhost:5173`).

### Important local-development details

- Every fresh clone needs `base44 link`. It writes
  `base44/.app.jsonc`, which is intentionally gitignored. The app ID is
  available in the Builder URL (`app.base44.com/apps/<id>/...`).
- `base44 dev` starts the local Base44 backend and the frontend together. Do
  not run `npm run dev` alongside it; that starts a second Vite server without
  the local backend proxy.
- The app must have been published at least once before the UI can load its
  hosted public settings under `base44 dev`. The local API itself remains
  available.
- Local entities, functions, and auth data are in memory and are cleared when
  `base44 dev` restarts. Core integrations and OAuth flows are forwarded to
  the deployed app.

For frontend-only work against the hosted Base44 backend, run:

```bash
base44 dev --remote
```

In remote mode, writes use production data. Use the normal `base44 dev` mode
when you need isolated local data.

## Useful commands

```bash
npm run build       # Create a production build
npm run lint        # Check ESLint rules
npm run typecheck   # Run the configured TypeScript check
npm run preview     # Preview the production build locally
```

## Publish changes

Changes pushed to this repository are synced to the Base44 Builder. After
pushing, open the dashboard and publish the app:

```bash
base44 dashboard open
```

Publish from the dashboard rather than `base44 deploy`; the CLI deploy sends
the local tree directly and can make the deployed state diverge from the
repository’s Git-synced state.

## Documentation and support

- [Base44 CLI overview](https://docs.base44.com/developers/references/cli/get-started/overview.md)
- [Base44 local development](https://docs.base44.com/developers/backend/overview/local-dev/local-development-overview)
- [Base44 GitHub integration](https://docs.base44.com/developers/app-code/local-development/github)
- [Base44 support](https://app.base44.com/support)
