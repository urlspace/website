# CLAUDE.md

## Project overview

url.space website — a React app built with TanStack Start (SSR framework) using Vite, TypeScript, and Tailwind CSS.

## Tech stack

- **Framework**: TanStack Start (React SSR) with TanStack Router
- **Build**: Vite 8, TypeScript (strict mode)
- **Styling**: Tailwind CSS (via `@tailwindcss/typography`)
- **Linting/Formatting**: Biome (tabs, double quotes, recommended rules)
- **Testing**: Vitest + Testing Library (React, jsdom)
- **Package manager**: pnpm
- **React Compiler**: enabled via `babel-plugin-react-compiler`

## Commands

- `pnpm dev` — start dev server on port 3000
- `pnpm build` — production build
- `pnpm test` — run tests (`vitest run`)
- `pnpm check` — biome check (lint + format)
- `pnpm lint` — biome lint only
- `pnpm format` — biome format only

## Code conventions

- Use tabs for indentation, double quotes for strings
- Import paths use `#/*` alias (maps to `./src/*`)
- Route files live in `src/routes/` following TanStack Router file-based routing
- `src/routeTree.gen.ts` is auto-generated — do not edit manually
- `src/styles.css` is excluded from biome checks
- Run `pnpm check` before committing to ensure code passes lint and format checks
