# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

---

## Environment variables & single .env (recommended) ✅

This project expects environment variables to be managed from a single `.env` file at the repository root (e.g., `./.env`).

Why:

- Server and client both read variables from the root now: the server prefers the root `.env`, and Vite is configured to load envs from the repository root (`envDir`).
- Client variables intended to be exposed to the browser should be prefixed with `VITE_` (e.g., `VITE_BACKEND_URL`).

Quick steps:

1. Copy `.env.example` from the repo root to `.env` and fill values.
2. Remove duplicate `.env` files in `Server/` and `Client/` if you no longer need them.

If you prefer local dev proxying, Vite's proxy is configured to forward `/api` to `http://localhost:5000` so you may use relative `/api` calls during development.

---

## Testing booking flow (manual)

1. Start server and client (`cd Server && npm run dev`, `cd Client && npm run dev`).
2. Sign up and log in as a regular user.
3. Browse **Hotels** and open a room detail page (e.g., `/rooms/:id`).
4. Select check-in, check-out dates and guests, click **Book Now**. If the room is available, you will be redirected to **My Bookings** and see your reservation.
5. To simulate an unavailable date, create a booking for the same room and dates again and verify the UI shows "Room is not available for selected dates".

Notes:

- The server exposes `GET /api/bookings/availability?roomId=<id>&checkIn=YYYY-MM-DD&checkOut=YYYY-MM-DD` to check availability (no auth required).
- Booking creation endpoint: `POST /api/bookings` (requires auth cookie).
