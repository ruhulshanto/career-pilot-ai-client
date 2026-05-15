# Career Pilot AI Frontend

Next.js frontend for Career Pilot AI.

## Setup

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Required env:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

## Commands

```bash
pnpm run lint
pnpm run test:profile-payload
pnpm run test:session-isolation
pnpm build
```

See the root `README.md` for full architecture, Docker, CI, and deployment notes.
