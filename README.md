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

## Next steps (backend)

1. Build the Express + PostgreSQL API per the schema in the master prompt
   (users, products, purchases, purchase_items, sales, sale_items, inventory,
   suppliers, sessions, settings).
2. Replace each function body in `src/services/api.js` with a real `http.get/
   post/put/delete` call — the function signatures already match what every
   page expects.
3. Wire real JWT auth into `AuthContext`.
