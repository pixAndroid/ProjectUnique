# Unique Air Conditioning & Refrigeration — Full-Stack Web App

A production-ready full-stack application for **Unique Air Conditioning & Refrigeration** consisting of three apps:

| App | Tech | Port | Purpose |
|-----|------|------|---------|
| `server/` | Node.js + Express + MongoDB | 5000 | REST API backend |
| `client/` | Next.js 14 (Light theme) | 3000 | Customer-facing website |
| `admin/` | Next.js 14 (Dark theme) | 3001 | Admin dashboard |

---

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- npm

---

## Quick Start

### 1. Server Setup

```bash
cd server
cp .env.example .env
# Edit .env: set MONGODB_URI and JWT_SECRET
npm install
npm start
```

The server auto-seeds on first run:
- Admin user: `admin@uniqueaircon.com` / `Admin@123`
- 5 Services, 5 Products, 3 Blog posts

### 2. Client (Customer Website)

```bash
cd client
cp .env.local.example .env.local
# Edit .env.local: set NEXT_PUBLIC_API_URL=http://localhost:5000
npm install
npm run dev   # Development on http://localhost:3000
npm run build && npm start   # Production
```

### 3. Admin Panel

```bash
cd admin
cp .env.local.example .env.local
# Edit .env.local: set NEXT_PUBLIC_API_URL=http://localhost:5000
npm install
npm run dev   # Development on http://localhost:3001
npm run build && npm start   # Production
```

---

## Environment Variables

### server/.env
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/uniqueaircon
JWT_SECRET=your_very_secret_key_here
```

### client/.env.local
```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SHEETS_WEBHOOK_URL=   # Optional: Google Sheets webhook URL
```

### admin/.env.local
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## API Endpoints

### Public
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/login` | Admin login → returns JWT |
| GET | `/api/blogs` | List published blogs |
| GET | `/api/blogs/:slug` | Get blog by slug |
| GET | `/api/services` | List all published services |
| GET | `/api/services/:id` | Get service detail |
| GET | `/api/products` | List all published products |
| GET | `/api/products/:id` | Get product detail |
| POST | `/api/enquiry` | Submit contact enquiry |
| POST | `/api/track` | Track page view/click event |

### Protected (requires `Authorization: Bearer <token>`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST/PUT/DELETE | `/api/admin/blogs[/:id]` | Blog CRUD |
| GET/POST/PUT/DELETE | `/api/admin/services[/:id]` | Service CRUD |
| GET/POST/PUT/DELETE | `/api/admin/products[/:id]` | Product CRUD |
| GET/PUT | `/api/admin/enquiries[/:id]` | Enquiries management |
| GET | `/api/admin/analytics` | Analytics data |

---

## Features

### Customer Website (`client/`)
- Home page with hero, services, products, testimonials, CTA
- Services listing and detail pages
- Products listing and detail pages
- Blog listing and article pages
- Contact/enquiry form (submits to API + optional Google Sheets webhook)
- Privacy policy and terms of service pages
- Page view tracking
- Responsive, mobile-first design
- Framer Motion animations

### Admin Dashboard (`admin/`)
- JWT-based authentication
- Dashboard with analytics charts (Recharts) and stats cards
- Blog management with TipTap rich text editor
- Services management (CRUD)
- Products management (CRUD)
- Enquiries management with status updates
- Dark theme (slate-950 background)

---

## Project Structure

```
ProjectUnique/
├── server/                  # Express + MongoDB API
│   ├── src/
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # Express route handlers
│   │   ├── middleware/      # JWT auth middleware
│   │   └── index.js         # App entry point + seed
│   ├── .env.example
│   └── package.json
├── client/                  # Next.js customer website
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   ├── components/      # React components
│   │   └── lib/             # API client, query client
│   └── package.json
└── admin/                   # Next.js admin panel
    ├── src/
    │   ├── app/             # App Router pages
    │   ├── components/      # Admin UI components
    │   └── lib/             # API client, auth helpers
    └── package.json
```
