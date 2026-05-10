# Career Platform Frontend Architecture

This frontend uses `Next.js App Router`, `TypeScript`, `Tailwind CSS`, `ShadCN UI`, `Zustand`, `TanStack Query`, `Framer Motion`, `React Hook Form`, and `Zod`.

## Install

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Architectural decisions

- App Router route groups separate public marketing pages from authenticated product surfaces.
- Feature folders group UI, hooks, schemas, and server-state helpers by business capability.
- `providers` centralize theme and React Query setup for clean composition in `app/layout.tsx`.
- `services/api` owns Axios, interceptors, token hydration, and backend communication policy.
- `store` keeps client-only global state small and intentional: auth, UI shell, AI interaction state.
- Dashboard shells are shared while role pages remain independent so permissions and navigation can diverge safely.

## Suggested dependency install

```bash
npm install next react react-dom axios zustand zod react-hook-form @hookform/resolvers @tanstack/react-query framer-motion next-themes lucide-react clsx tailwind-merge class-variance-authority @radix-ui/react-slot @radix-ui/react-dropdown-menu
npm install -D typescript tailwindcss postcss autoprefixer eslint eslint-config-next prettier
```

## Theme system

- Limit the brand to three primaries: blue, emerald, and neutral slate.
- Use CSS variables so ShadCN, Tailwind, and dark mode stay consistent.
- Keep one radius scale through `--radius` for visual consistency across cards, forms, tables, and dialogs.

## Frontend roadmap

1. Add ShadCN primitives for buttons, inputs, tables, dialogs, charts, toasts, and command menus.
2. Expand feature folders with `components`, `hooks`, `server-actions` where needed, and granular query hooks.
3. Build protected route middleware, social auth flows, and role-aware redirects.
4. Add Suspense boundaries, skeletons, streaming chat UI, and optimistic updates for AI workflows.
5. Connect charts and tables to backend analytics endpoints with pagination, filters, and sorting.
