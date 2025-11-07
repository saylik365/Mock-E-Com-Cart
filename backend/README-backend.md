# Backend README

## Start (dev)
cd backend
npm install
cp .env.example .env  # then edit .env to set JWT_SECRET if desired
npm run dev

APIs:
- POST /api/auth/register
- POST /api/auth/login
- GET /api/products
- GET/POST/PUT/DELETE /api/cart
- POST /api/checkout
