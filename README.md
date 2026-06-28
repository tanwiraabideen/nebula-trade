# NebulaTrade

A cryptocurrency trading simulation platform where users can learn to trade crypto risk-free using virtual funds. Practice buying and selling real tokens with live market data — no real money involved.

## Screenshots

![NebulaTrade Screenshot 1](public/readme-imgs/Screenshot%202026-06-29%20at%201.26.43%20am.png)
![NebulaTrade Screenshot 2](public/readme-imgs/Screenshot%202026-06-29%20at%203.06.36%20am.png)

## Features

- **Virtual Portfolio** — Start with $1,000 in virtual USD and grow your portfolio
- **Live Market Data** — Real-time prices powered by the CoinGecko API (1,500+ tokens)
- **Buy & Sell** — Execute trades on any listed token with an interactive order form
- **Price Charts** — Historical price charts with hourly, daily, weekly, and monthly views
- **Transaction History** — Full log of every buy and sell you've made
- **Global Leaderboard** — Compete against other traders ranked by portfolio value
- **Level System** — Progress through levels as your portfolio grows
- **Social Profiles** — Browse other users' portfolios and holdings
- **Token Search** — Find any coin by name across the marketplace

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + Material UI |
| Auth | Kinde OAuth |
| Database | PostgreSQL 16 |
| ORM | Prisma 5 |
| Charts | Recharts |
| Market Data | CoinGecko API |
| Deployment | Docker + Docker Compose |

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL (or Docker)
- A [Kinde](https://kinde.com) account for authentication
- A [CoinGecko](https://www.coingecko.com/en/api) API key

### Environment Variables

Create a `.env` file in the project root:

```env
# Database
DATABASE_URL=postgresql://postgres:<password>@localhost:5432/appdb
POSTGRES_PASSWORD=<your_postgres_password>

# Kinde Auth
KINDE_CLIENT_ID=<your_kinde_client_id>
KINDE_CLIENT_SECRET=<your_kinde_client_secret>
KINDE_ISSUER_URL=https://<your-subdomain>.kinde.com
KINDE_SITE_URL=http://localhost:3000
KINDE_POST_LOGIN_REDIRECT_URL=http://localhost:3000/my-dash
KINDE_POST_LOGOUT_REDIRECT_URL=http://localhost:3000/

# CoinGecko
COINGECKO_API_KEY=<your_coingecko_api_key>
```

### Running Locally

```bash
# Install dependencies
npm install

# Run database migrations
npx prisma migrate deploy

# Start the development server
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### Running with Docker

Docker Compose handles the full stack — database, migrations, the web app, and the background token updater — all in one command:

```bash
docker-compose up --build
```

This starts four services:

| Service | Description |
|---|---|
| `db` | PostgreSQL 16 database |
| `migrate` | Runs Prisma migrations on startup |
| `webapp` | Next.js application on port 3000 |
| `token-updater` | Background service that syncs token prices every 5 minutes |

To stop:

```bash
docker-compose down
```

## How It Works

### Authentication
Users sign in via Kinde OAuth. On first login, a new user record is created with a $1,000 starting balance.

### Market Data
The `token-updater` service runs independently and continuously fetches the top 1,500 cryptocurrencies from CoinGecko every 5 minutes, storing prices and metadata in PostgreSQL.

### Trading
When a user buys a token, their USD balance decreases and a `UserToken` record tracks how much of that token they hold. Selling reverses the process. Every trade is recorded in the `Transaction` table.

### Leaderboard
Users are ranked by their total portfolio value (USD balance + current value of all held tokens).

## Project Structure

```
app-project/
├── src/
│   ├── app/
│   │   ├── actions/        # Server actions (buy, sell, fetch user data)
│   │   ├── my-dash/        # Dashboard page
│   │   ├── market/         # Market listing and token detail pages
│   │   └── social/         # Leaderboard and user profiles
│   ├── components/         # Shared UI components
│   └── lib/
│       └── db.ts           # Prisma singleton
├── token-updater/          # Background price sync service
├── prisma/
│   └── schema.prisma       # Database schema
├── Dockerfile
├── Dockerfile.migrate
└── docker-compose.yml
```

## Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Run ESLint
```
