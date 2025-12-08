CRUSH.md — Quick Ops & Style Guide for Agents

Build/Lint/Test
- Dev server: bun run dev (Vite on :3000)
- Build: bun run build (vite build && tsc)
- Preview: bun run serve
- Test all: bun run test (vitest run)
- Test in watch/UI: bunx vitest
- Single test file: bunx vitest path/to/file.test.ts
- Single test by name: bunx vitest -t "test name"
- With JSDOM (default): vitest config includes jsdom via devDeps; React 19 supported
- Lint/format: Prettier is used (.prettierrc). No eslint config present; prefer type-safety over lint rules.

Project Conventions
- Language/tooling: TypeScript, React 19, Vite 7, Vitest 3, @testing-library, Zustand, TanStack Router/Query, Tailwind v4.
- Imports: Use absolute imports from src when configured; otherwise relative. Keep React/third-party before local. Group by external→internal→types. Prefer type-only imports (import type {...}).
- Formatting: Follow .prettierrc. 2-space indent, single quotes default, trailing commas where possible. No comments unless explicitly requested.
- Types: Enable strict typing; prefer explicit types for public APIs/exports. Use readonly where helpful. Narrow with guards; avoid any. Use utility types from TS instead of custom ones.
- Naming: PascalCase for React components/types, camelCase for variables/functions, UPPER_SNAKE for constants. File names use kebab-case except React components can be kebab or folder index.tsx per existing patterns.
- State: Use Zustand stores under src/hooks/* where present; keep UI state local where simpler. Derive state; avoid duplication.
- Errors: Throw Error objects, not strings. Prefer Result-like returns in game engine libs and surface user-safe messages in UI. Never log secrets.
- Async: Always await promises; wrap async effects with guards to avoid setState on unmounted. Prefer React Query for server-like async flows.
- UI: Shadcn UI + Radix primitives; add new components via: pnpx shadcn@latest add <component>. Keep accessible labels and aria-*.
- Styling: Tailwind v4. Use tailwind-merge + clsx via cn helper where applicable. Keep className composition small and readable.
- Tests: Use @testing-library for React components. Prefer user-facing queries (getByRole, etc.). Keep pure logic tests under src/game/** with vitest.
- Routing: TanStack Router route files under src/routes. Use routeTree.gen.ts; run dev/build to regenerate.

Cursor/Copilot Rules
- From .cursorrules: Use latest Shadcn installer for new UI components: pnpx shadcn@latest add button

Handy Snippets
- Add a new shadcn button: pnpx shadcn@latest add button
- Run one test interactively: bunx vitest src/path/to/file.test.tsx -t "name"
