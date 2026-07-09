# AGENTS.md

This file provides guidance to AI agents who are working on the code in this repository.

## Context

This repository contains an app built with the Attio App SDK.

### What the app does

The RingCentral app integrates RingCentral's cloud communications platform with Attio. It lets users make phone calls directly from Attio record pages — either to a specific person or to any callable person at a company — using RingCentral's RingOut API (click-to-call via the user's desk phone or softphone).

### App SDK entry points in use

- **Record actions (`record.actions`)** — two actions on people and company records:
  - `call-person-action` — dial the person's phone number from their Attio record
  - `call-company-action` — select a callable person from the company's team and dial them
- No workflow blocks, bulk actions, webhooks, or widgets

### Source folder structure

| Path | Description |
| ---- | ----------- |
| `src/app.ts` | App entry point — registers record actions |
| `src/app.settings.ts` | Settings schema (empty workspace settings) |
| `src/client/` | Client-side code: record action handlers and dialog UI |
| `src/client/call-person.action.ts` | Record action for calling a person |
| `src/client/call-company.action.tsx` | Record action for calling someone at a company (with picker dialog) |
| `src/client/call-dialog.component.tsx` | Dialog component for selecting who to call from a company |
| `src/client/call.ts` | Shared call flow: shows dialing toast, invokes server, handles errors |
| `src/server/dial.server.ts` | Server entry — orchestrates extension lookup, company number lookup, ring-out |
| `src/server/send-to-ring-central.ts` | HTTP client wrapper for the RingCentral REST API |
| `src/server/get-user-extension.ts` | Fetches the current user's extension number |
| `src/server/get-company-phone-number.ts` | Fetches the main company phone number |
| `src/server/ring-out.ts` | Initiates a RingOut call |
| `src/queries/` | GraphQL queries for fetching phone numbers from Attio |
| `src/utils/assert-never.ts` | Exhaustive switch helper |

### External service

- **RingCentral** — REST API (`https://platform.ringcentral.com/restapi/v1.0`)
- Auth: OAuth bearer token stored in a user connection (`getUserConnection()`)
- Docs: https://developers.ringcentral.com/api-reference

### App-specific coding guidelines

- All RingCentral API calls go through `sendToRingCentral` — never `fetch` RingCentral URLs directly.
- Results use `@attio/fetchable` (`complete`/`errored`) — never throw across the client/server boundary.
- Error codes are string literal union types (`"UNAUTHORIZED" | "FAILED_TO_FETCH" | ...`). When adding new server errors, add the code to the union and handle it exhaustively in `call.ts` via `assertNever`.
- `getUserConnection()` must never be wrapped in try/catch — it throws a special SDK error that powers the connection dialog.
- GraphQL query results may contain nullable fields — always guard with optional chaining before use.

## Environment

Code for the app may run either in a client-side or server-side context.

### Client-side code

Client-side code runs in the browser. However, it runs inside a safe sandbox, using a custom JS runtime. This means that:

- You MUST NOT render HTML tags directly e.g. `<div>Hello</div>`. Instead, you MUST only use components provided by the App SDK.
- You MUST NOT use custom styles or CSS. Only use the pre-styled components provided by the App SDK.
- You MUST NOT try to read the DOM directly.
- Some browser APIs may not be available.
- `fetch` calls are not allowed. You MUST NOT call `fetch` directly and should instead use `fetch` via server-side functions.

Files which render React components MUST use the `.tsx` extension.

### Server-side code

Server-side code runs in files ending in:

- `.server.ts`
- `.webhook.ts`
- `.event.ts`

Workflow block files will also run in the server (excluding configurators).

Code that any of the above files import will also run in a server-side environment.

Server-side code DOES NOT run in Node.js but instead in a custom JS runtime. While many Node.js APIs are supported, some are not and you may need to factor this into your decision to use certain packages.

## Using the Attio App SDK

Attio provides three packages to help you build apps:

1. `attio/client` - for client-side imports
2. `attio/server` - for server-side imports
3. `attio` - for shared/environment-agnostic imports

IMPORTANT: Before importing from these packages, you MUST always check one of the following to confirm that your import is correct:

1. Existing examples in the codebase
2. TypeScript type definitions and JSDoc strings for the package
3. The Attio SDK documentation

If you are unsure about an import, always check explicitly and do not guess.

## Coding guidelines

- You SHOULD use Zod to validate data from public APIs.
- You SHOULD only include properties in Zod schemas that we explicitly need.
- You SHOULD use try/catch around calls to `.json()`.
- You SHOULD use console.error to capture information about unexpected errors.
- You MUST NOT log sensitive information such as email addresses or passwords.
- You MUST handle API errors gracefully. Do not throw an error within a React component, but instead return a clear fallback UI.
- API wrappers MUST NOT leak transport-layer details (e.g. HTTP status codes) to callers — return a domain error such as `NOT_FOUND` instead. All RingCentral calls return a `@attio/fetchable` result rather than throwing.
- When `getUserConnection()` / `getWorkspaceConnection()` is called, you MUST NOT wrap it in a try/catch. These functions throw special errors that power the connection dialogs in the UI.
- You SHOULD prefer named arguments over positional arguments when using 3 or more arguments.
- You MUST NOT use `any` when typing your code. Type errors MUST be fixed properly as usage of `any` is a likely source of bugs.
- You SHOULD order functions/values within code so that all values are defined before being used. Default export should go at the bottom of a file.

### Error messages (user-facing)

- Never dump raw JSON, HTTP status codes, or square brackets in UI error messages.
- Never expose transport-layer details — say "An unexpected error occurred when calling RingCentral's API" not "503 from RingCentral".
- Auth errors MUST name the missing scope and tell the user where to configure it.

### Testing

- Where appropriate, use Vitest to run tests.
- Aim to implement unit testing where it helps increase confidence in the correctness of code.
- Do not test React components using react testing library or similar.
- When passing functions/classes to describe, pass the value directly, do not specify a name in quotes e.g. `describe(myFn, () => {/* ... */})`, not `describe("myFn", () => {/* ... */})`.

## Validation

- You MUST validate all your changes using the commands provided in package.json.
- Run and fix lint rules: `pnpm run lint:fix`
- Validate unused code: `pnpm run knip`
- Run tests: `pnpm run test`
- Validate the build: `pnpm run build`
