# Cloudflare Workers Full-Stack Chat App

[![[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/sthoms12/nap-movies-the-sleep-friendly-movie-database)]](https://deploy.workers.cloudflare.com/)

A production-ready full-stack chat application powered by Cloudflare Workers. This template demonstrates a real-time chat system using Durable Objects for scalable, stateful storage, paired with a modern React frontend built with Vite, shadcn/ui, and Tailwind CSS.

## 🚀 Key Features

- **Full-Stack Architecture**: Hono-based API backend with React + TypeScript frontend.
- **Durable Objects Storage**: One DO per entity (Users, Chats) with prefix indexes for efficient listing/pagination.
- **Real-Time Chat Boards**: Create chats, send messages, list users.
- **Type-Safe API**: Shared types between frontend and worker, with TanStack Query for data fetching/mutations.
- **Modern UI**: shadcn/ui components, Tailwind CSS, dark mode support, responsive design.
- **Production-Ready**: Error handling, CORS, logging, client error reporting, SPA routing.
- **Scalable**: Global Durable Object for storage, automatic migrations via Wrangler.
- **Development Workflow**: Hot reload for both frontend and worker, type generation.

## 🛠️ Technology Stack

- **Backend**: Cloudflare Workers, Hono, Durable Objects
- **Frontend**: React 18, Vite, TypeScript, TanStack Query, React Router
- **UI**: shadcn/ui, Tailwind CSS, Lucide Icons, Framer Motion
- **State & Forms**: Zustand, React Hook Form, Zod
- **Utilities**: Immer, clsx, tailwind-merge
- **Package Manager**: Bun

## 📦 Quick Start

### Prerequisites

- [Bun](https://bun.sh/) v1.1+
- [Cloudflare Account](https://dash.cloudflare.com/) with Workers enabled
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-update/) (installed via `bunx wrangler@latest`)

### Installation

1. Clone the repository.
2. Install dependencies:

```bash
bun install
```

3. Generate Worker types (optional, for IDE support):

```bash
bun run cf-typegen
```

### Local Development

Start the development server (frontend + worker proxy):

```bash
bun dev
```

- Frontend: http://localhost:3000 (Vite dev server)
- API: http://localhost:3000/api/* (proxied to local Worker)
- Worker logs: Visible in terminal.

### Build for Production

```bash
bun run build
```

Outputs static assets to `dist/` and Worker bundle.

### Preview Production Build

```bash
bun run preview
```

Serves the production build locally.

## 📚 Usage Examples

### API Endpoints (all `/api/*`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/users` | List users (supports `?cursor` & `?limit`) |
| POST | `/api/users` | Create user `{ name: string }` |
| DELETE | `/api/users/:id` | Delete user |
| POST | `/api/users/deleteMany` | Delete multiple `{ ids: string[] }` |
| GET | `/api/chats` | List chats (supports `?cursor` & `?limit`) |
| POST | `/api/chats` | Create chat `{ title: string }` |
| DELETE | `/api/chats/:id` | Delete chat |
| GET | `/api/chats/:chatId/messages` | List messages in chat |
| POST | `/api/chats/:chatId/messages` | Send message `{ userId: string, text: string }` |

### Frontend Customization

- Edit `src/pages/HomePage.tsx` for main UI.
- Use `src/lib/api-client.ts` for API calls.
- Components in `src/components/ui/` (shadcn).
- Hooks: `useTheme`, `useMobile`.
- Layout: `AppLayout` with sidebar.

Extend entities in `worker/entities.ts` and routes in `worker/user-routes.ts`.

**DO NOT** modify `worker/index.ts` or `worker/core-utils.ts`.

## ☁️ Deployment

1. Login to Cloudflare:

```bash
wrangler login
```

2. Deploy to Cloudflare Workers:

```bash
bun run deploy
```

- Deploys Worker + static assets (SPA).
- Automatic Durable Object migrations.
- Custom domain support via Wrangler.

**[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/sthoms12/nap-movies-the-sleep-friendly-movie-database)**

Configure via `wrangler.jsonc`:
- Rename project: `"name": "your-project-name"`
- Environment vars/bindings: Add to `[env.production]` section.
- Preview/deploy to specific account: `wrangler deploy --name preview`

## 🔍 Project Structure

```
├── shared/          # Shared types & mock data
├── src/             # React frontend (pages, components, hooks)
├── worker/          # Hono API + Durable Objects
├── dist/            # Built assets (gitignored)
├── package.json     # Bun scripts & deps
└── wrangler.jsonc   # Cloudflare config
```

## 🤝 Contributing

1. Fork & clone.
2. `bun install`.
3. `bun dev` for local testing.
4. Add features to `worker/user-routes.ts` & `worker/entities.ts`.
5. Submit PR.

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.

## 🙌 Support

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)
- Issues: Open a GitHub issue.

Built with ❤️ for Cloudflare Workers.