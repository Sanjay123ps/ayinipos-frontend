# Ayini POS V2 — Frontend Scaffold

React + Vite + Tailwind frontend for the Supermarket Billing & Inventory system.
This is the **frontend only** — it currently runs against an in-memory mock
data layer (`src/services/mockData.js` + `src/services/api.js`) so every
screen works before the Express/PostgreSQL backend exists. Swap the functions
in `src/services/api.js` for real `axios` calls once the API is live; no page
or component needs to change.

## Run it locally

```bash
npm install
npm run dev
```

Open the printed `localhost` URL. Log in with any username/password (auth is
mocked until the backend ships).

## What's here

- **Login** — mock auth, stores a session in localStorage
- **Dashboard** — today/monthly sales, orders, sales trend chart, low stock
  alerts, best sellers, recent sales
- **Billing (POS)** — search + category filter, tap-to-add quantity sheet,
  floating cart bar, full cart drawer (discount, payment mode, customer
  mobile), bill receipt with **Send to WhatsApp**
- **Products** — Catalog (add/edit/delete), Purchase (searchable product
  picker, add-new-product inline, supplier/invoice/date, purchase history),
  Inventory (stock overview + quick +/- adjustment)
- **Reports** — daily/weekly/monthly/custom tabs, sales chart, purchase/sales/
  inventory/profit report cards, best sellers
- **Settings** — store name/logo/GST/address/bill footer/theme
- **Sessions** — till opening/closing cash, denomination counting, difference,
  remarks, history

## Design system

- Colors: emerald (brand/primary), turmeric (accent/CTA), chili (alerts), warm
  porcelain background — see `tailwind.config.js`
- Type: Fraunces (serif) for money/headline figures, Plus Jakarta Sans for UI,
  IBM Plex Mono (`.figures` class) for tabular numbers
- Signature motif: a punched "receipt perforation" edge (`.perforated-top` /
  `.perforated-bottom` in `src/index.css`) used on the floating cart bar and
  bill receipt

## Deploying

This now talks to the real Express + PostgreSQL backend (see the backend
repo's README for deploying that side first) — nothing here runs on mock
data or localStorage for business data anymore. The JWT login token is the
one thing still kept in localStorage (see the comment in `services/api.js`
if you want to swap that for sessionStorage instead).

1. Copy `.env.example` to `.env.local` for local dev, or set `VITE_API_URL`
   in your host's environment variable settings for a deployed build (it's
   compiled in at build time, not read at runtime).
2. `npm run build` → deploy the `dist/` folder to any static host (Vercel,
   Netlify, Railway static site, GitHub Pages, etc).
3. Make sure the backend's `CORS_ORIGIN` env var matches this site's exact
   deployed URL, or requests will be blocked by the browser.
4. Log in with the admin credentials from the backend's `npm run db:seed`
   output (default `admin` / `admin123` unless you set
   `SEED_ADMIN_USERNAME`/`SEED_ADMIN_PASSWORD` before seeding) — change the
   password from Settings → Change Password once you're in.
