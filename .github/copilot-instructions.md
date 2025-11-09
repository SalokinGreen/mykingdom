# GitHub Copilot / AI Agent Instructions for `mykingdom`

Purpose: Enable rapid, safe contributions to this Next.js 14 App Router project that powers an AI-driven kingdom simulation game.

## Architecture Snapshot

- Framework: Next.js 14 (App Router) with client-heavy React state in `src/app/components/main/Main.jsx` and two server API routes: `src/app/api/generate/route.js` (NovelAI) and `src/app/api/deepseek/route.js` (DeepSeek).
- Game Loop: `Main.jsx` maintains kingdom state (love/power/wealth/year/context) and drives LLM interactions based on selected provider (novelai|deepseek).
- Multi-Provider Support: Users select between NovelAI (text completion) and DeepSeek (chat-based) via settings. Provider and respective API keys stored in `localStorage` (`MKprovider`, `MKapiKey`, `MKdeepseekKey`).
- NovelAI Context: `src/utils/front/buildContext.js` loads `public/tokenizers/nerdstash_tokenizer_v2.json`, instantiates `Encoder` (nai-js-tokenizer) to enforce token window (~8000), halves for "top" vs remaining. Cleans redundant whitespace.
- DeepSeek Context: `src/utils/front/buildChatContext.js` transforms linear context into OpenAI-style message arrays (system/user/assistant roles). No tokenizer; relies on maxMessages limit (~40) and upstream token limits.
- Generation Flow NovelAI: Client `generate()` posts to `api/generate`, which forwards to NovelAI (`https://api.novelai.net/ai/generate`) with fixed `parameters` constant and user Bearer key.
- Generation Flow DeepSeek: Client `generateDeepseek()` posts to `api/deepseek`, which forwards to DeepSeek (`https://api.deepseek.com/v1/chat/completions`) with configurable temperature/max_tokens and user Bearer key.
- Fallback Logic: If a model response lacks stat bracket `[ Love: ... ]`, a second forced completion is triggered. NovelAI: append `"[ Love:"` to prompt. DeepSeek: append partial assistant message with `"\n[ Love:"` to messages array.
- State Persistence: Kingdom/ruler/API keys/provider saved in `localStorage`. Win/Loss thresholds: any stat <=0 (lose) or all >=100 (win) resets to baseline 50.
- Undo Mechanic: Historical snapshots stored in `states` array; `goBack(i)` restores prior state if not currently generating.

## Key Conventions & Patterns

- Stats Parsing: `findStats()` scans narrative for tokens like "increased greatly" (±20) or "increased" (±10) etc. Preserve these phrase mappings when extending logic; adding new phrases requires updating `getValue()`.
- Prompt Fragments: Each year context chunk starts with `***\nYear N` and user choices prefixed with `> `. Maintain this formatting or downstream parsing & stat extraction may break.
- Tokenizer Use: Fetch path is relative (`./tokenizers/...`); for production/SSR prefer absolute `/tokenizers/...` if adding new assets—stay consistent.
- API Route: Use `export async function POST(request)` returning `NextResponse.json(...)`. Reuse error handling pattern (logging + early JSON return) when adding routes.
- Directory Layout: UI primitives live in `src/app/components/UI`; higher-level game UI in `components/main`. Follow this split when introducing new components.
- Styling: CSS Modules (`*.module.css`) imported as `styles` and className usage consistent; avoid global overrides unless adding to `globals.css`.

## Working With Generation

- To adjust model behavior, edit `parameters` in `route.js`; client currently passes `{}` so server-side constant dominates. Provide optional user overrides only after validating shape.
- When adding new gameplay variables, ensure: (1) included in `mykingdomcontext` template string, (2) updated in win/lose effect, (3) snapshot saved in `states`, and (4) parsing logic extended if model returns them.

## Safe Extension Examples

1. Add a new stat (e.g., "Morale"): mirror love/power/wealth state, extend `getValue()` & bracket parsing, update win/lose thresholds intentionally.
2. Introduce a new API route `src/app/api/summarize/route.js`: follow `generate/route.js` or `deepseek/route.js` pattern; validate request JSON, return `{ summary }` or `{ results }`.
3. Improve context trimming: modify `buildContext()` (NovelAI) to enforce tighter `size` or `buildChatContext()` (DeepSeek) to adjust `maxMessages`—retain cleaning and token accounting comments.
4. Add a third LLM provider: create new API route under `src/app/api/`, add corresponding client generator in `src/utils/front/`, update provider dropdown in settings modal, branch logic in `beforeChoice()`/`afterChoice()`.

## Gotchas

- Avoid mutating `context` directly; always use state setters to keep React effects consistent (scrolling & generation triggers).
- `generate()` assumes success shape `{ results: [text] }`; if altering API route response, update client accordingly to prevent silent failures.
- Token size heuristic halves budget for `top`; large additions to `memory` or `addon` can starve later history—adjust with care.
- Undo (`goBack`) relies on parallel `states` length; whenever you add new state variables include them in snapshot creation.

## Build & Run

- Dev: `npm run dev` (Next.js dev server). Lint: `npm run lint`. Production build: `npm run build` then `npm start`.

## When Refactoring

- Preserve bracket stat output format `[ Love: ...; Power: ...; Wealth: ... ]`—multiple downstream parsers rely on it.
- Maintain separation between client (no API key in commits) and server route (external call only). Do NOT log full API keys.

## Contributing Workflow (AI Agents)

- Read `Main.jsx`, `buildContext.js`, `buildChatContext.js`, `generate/route.js`, and `deepseek/route.js` first; these control dataflow.
- For new features: list required state vars, extend snapshot & persistence (including localStorage keys), ensure prompt formatting stability, verify generation fallback still works for both providers.
- Keep changes minimal; introduce tests only if you add parsing complexity (e.g., unit test for `getValue()` phrases).

Provide feedback if any section needs more depth or if new hidden conventions emerge so this document can evolve.
