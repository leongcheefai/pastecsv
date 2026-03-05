# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `pnpm dev` — start dev server
- `pnpm build` — production build (TypeScript errors are ignored via `next.config.mjs`)
- `pnpm lint` — run ESLint

No test framework is configured.

## Architecture

PasteCSV is a single-page Next.js 16 app (App Router) that lets users paste/upload CSV data and view it as a sortable, searchable, shareable table. All processing is client-side — no backend.

### Data flow

1. **Input** (`DropZone`) — accepts CSV via file drop, file picker, paste, or sample data
2. **Parsing** (`useCSVParser`) — uses PapaParse to produce `ParsedCSV` (`{ headers: string[], rows: string[][] }`)
3. **Table state** (`useTableState`) — search filtering and column sorting over parsed data
4. **Sharing** (`useShareURL`) — compresses CSV with lz-string into the URL hash fragment; on load, decompresses hash to restore data
5. **Display** (`DataTable` + `TableToolbar`) — renders the table with sticky headers, sort indicators, and a status bar

### Key constraints

- Max 500 rows, 20 columns (enforced in `useCSVParser`)
- URL sharing warns when compressed hash exceeds 2000 chars (`lib/compress.ts`)

### Project structure

- `app/` — Next.js App Router (single page at `/`)
- `components/` — app components (`paste-table-app.tsx` is the root orchestrator) + `ui/` (shadcn/ui primitives)
- `hooks/` — custom hooks for CSV parsing, table state, and URL sharing
- `lib/` — utilities (compression, sample data, cn helper)

### Stack

- Next.js 16 + React 19 + TypeScript
- Tailwind CSS v4 (with `tw-animate-css`)
- shadcn/ui components (Radix primitives)
- PapaParse for CSV parsing, lz-string for URL compression
- Dark theme only (oklch color system in `app/globals.css`)
- Fonts: Inter (sans) + JetBrains Mono (mono, used extensively)
- `@/*` path alias maps to project root
