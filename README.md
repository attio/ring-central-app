# RingCentral

Attio app integrating with [RingCentral](https://www.ringcentral.com) — a cloud communications platform.

## Overview

The RingCentral app lets users make phone calls directly from Attio record pages. Using RingCentral's RingOut API, calls are initiated through the user's connected phone (desk phone or softphone) — no headset required in the browser.

## Features

- **Call a person** — dial a person's phone number directly from their Attio record
- **Call someone at a company** — select any callable person from a company's team and dial them

## Setup

```bash
pnpm install
```

## Development

```bash
pnpm run dev
```

## Commands

| Command                 | Description              |
| ----------------------- | ------------------------ |
| `pnpm run dev`          | Start dev server         |
| `pnpm run build`        | Build + type-check       |
| `pnpm run lint`         | Run ESLint               |
| `pnpm run lint:fix`     | Run ESLint with auto-fix |
| `pnpm run format`       | Format with Prettier     |
| `pnpm run format:check` | Check formatting         |
| `pnpm run test`         | Run tests                |
| `pnpm run knip`         | Check for dead code      |

## Source folder structure

| Path | Description |
| ---- | ----------- |
| `src/app.ts` | App entry point — registers record actions |
| `src/client/` | Client-side action handlers and dialog UI |
| `src/server/` | Server-side RingCentral API calls |
| `src/queries/` | GraphQL queries for fetching phone numbers |
| `src/utils/` | Shared utilities |

See [AGENTS.md](./AGENTS.md) for full folder structure, coding guidelines, and SDK usage notes.
