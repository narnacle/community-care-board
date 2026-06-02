# Community Care Board

A hyper-local mutual aid web app where neighbors can post **needs** (requests for help) and **offers** (volunteered resources). Built with React, Tailwind CSS, and Supabase. No login is required to post or claim a task.

## Features

- **Needs & Offers tabs** — browse requests and volunteered resources separately
- **Category filters** — All, Food, Tools, Rides, Care
- **Post form** — modal form to submit a need or offer with title, description, and contact info
- **Post cards** — category badge, date, title, description, and contact details
- **Claim tasks** — open posts can be claimed; status updates to `CLAIMED` in Supabase so others know help is on the way

## Tech stack

- [React](https://react.dev/) + [Vite](https://vite.dev/)
- [Tailwind CSS](https://tailwindcss.com/) v4
- [Supabase](https://supabase.com/) (PostgreSQL + Row Level Security)

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- A free [Supabase](https://supabase.com/) project

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Supabase credentials

Copy the example env file and add your project values:

```bash
cp .env.example .env
```

Edit `.env` in the project root:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Find these in the Supabase Dashboard under **Settings → API**:

| Variable | Source |
|----------|--------|
| `VITE_SUPABASE_URL` | Project URL (base only — no `/rest/v1/` suffix) |
| `VITE_SUPABASE_ANON_KEY` | `anon` `public` key |

The `VITE_` prefix is required so Vite exposes the values to the client. Use only the **anon** key in the frontend — never the service role key.

The Supabase client reads these in `src/lib/supabase.js`.

### 3. Create the database table

In the Supabase Dashboard, open **SQL Editor → New query**, paste the contents of [`supabase/schema.sql`](supabase/schema.sql), and run it.

This creates the `posts` table and Row Level Security policies that allow:

- Anyone to read posts
- Anyone to insert a new post
- Anyone to update an open post to `CLAIMED`

### 4. Run the dev server

```bash
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

## Docker

The production image builds the Vite app and serves it with nginx. Supabase credentials are baked in at **build time** (Vite requirement), so pass them as build args.

### Using Docker Compose

Ensure `.env` contains your Supabase values, then:

```bash
docker compose up --build
```

Open [http://localhost:8080](http://localhost:8080).

### Using Docker directly

```bash
docker build \
  --build-arg VITE_SUPABASE_URL=https://your-project-id.supabase.co \
  --build-arg VITE_SUPABASE_ANON_KEY=your-anon-key-here \
  -t community-care-board .

docker run --rm -p 8080:80 community-care-board
```

Rebuild the image whenever you change Supabase credentials or app code.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build locally |

## Project structure

```
├── src/
│   ├── App.jsx              # Main page: tabs, filters, data fetching, claim logic
│   ├── main.jsx             # React entry point
│   ├── index.css            # Tailwind imports
│   ├── constants.js         # Categories and shared helpers
│   ├── lib/
│   │   └── supabase.js      # Supabase client (reads .env credentials)
│   └── components/
│       ├── Header.jsx       # Title, subtitle, post button
│       ├── FilterBar.jsx    # Category filter buttons
│       ├── PostCard.jsx     # Individual post card
│       └── PostForm.jsx     # Modal form for new posts
├── supabase/
│   └── schema.sql           # Database table and RLS policies
├── Dockerfile               # Multi-stage production build
├── docker-compose.yml       # Run with Docker Compose
├── nginx.conf               # SPA routing for production container
├── .env.example             # Template for environment variables
└── vite.config.js           # Vite + React + Tailwind configuration
```

## Data model

Each row in the `posts` table:

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | Auto-generated primary key |
| `type` | `text` | `NEED` or `OFFER` |
| `category` | `text` | `Food`, `Tools`, `Rides`, or `Care` |
| `title` | `text` | Short summary |
| `description` | `text` | Full details |
| `contact_info` | `text` | Phone, email, or preferred contact |
| `status` | `text` | `OPEN` (default) or `CLAIMED` |
| `created_at` | `timestamptz` | Auto-set on insert |

## Security notes

This app is designed for low-friction neighborhood use: posting and claiming do not require authentication. The Supabase RLS policies reflect that trade-off.

For a production deployment with stricter controls, consider adding authentication, rate limiting, or moderation workflows.
