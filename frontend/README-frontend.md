# Frontend README

## Setup
1. `cd frontend`
2. `npm install`
3. Copy `.env.example` to `.env` and set `VITE_API_BASE` if needed:
VITE_API_BASE=http://localhost:4000/api

pgsql
Copy code
4. `npm run dev`
5. Open `http://localhost:5173`

## Notable files
- `src/App.jsx` — main app
- `src/api.js` — API wrapper
- `src/auth/` — AuthProvider + hook
- `src/components/` — UI components (Products, Cart, Login, Register, Checkout, Receipt)
- `index.css` — Tailwind + custom styles

## Useful
- When you log in, token is saved in `localStorage`.
- To test without login, API accepts requests without a token and will treat user as anonymous.