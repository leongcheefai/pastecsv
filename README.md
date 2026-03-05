# PasteCSV

A client-side CSV viewer that lets you paste or upload CSV data and instantly view it as a sortable, searchable, shareable table. No backend — everything runs in the browser.

## Features

- **Paste or drop** CSV data directly into the browser
- **Sort** columns with a click
- **Search** across all rows in real time
- **Share** tables via URL — data is compressed into the hash fragment using lz-string
- **Dark mode** support

## Limits

- Max 500 rows, 20 columns
- URL sharing warns when the compressed hash exceeds 2,000 characters

## Getting Started

```bash
pnpm install
pnpm dev
```

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 + shadcn/ui
- PapaParse for CSV parsing
- lz-string for URL compression
