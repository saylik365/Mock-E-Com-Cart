# Mock E-Com Cart — Vibe Commerce Screening
Full-stack shopping cart demo.

## Tech stack

* **Backend:** Node.js, Express, SQLite
* **Frontend:** React (Vite), Tailwind CSS, Framer Motion
* **Auth:** bcrypt + JWT (optional; included)
* **Database:** SQLite stored at `backend/db/database.sqlite`

## Folder structure

```
ecom-cart/
├─ backend/    # server, routes, DB init
├─ frontend/   # React app
└─ README.md
```


### 🖥 Backend

```bash
cd backend
npm install
cp .env.example .env    # edit JWT_SECRET 
npm run dev
# runs on http://localhost:4000
```

Test: [http://localhost:4000/api/products](http://localhost:4000/api/products)

### 💻 Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
# runs on http://localhost:5173
```

---

## ✨ Features

* Products listing (seeded on first run)
* Add / update / remove items from cart
* Cart total calculation
* Mock checkout → receipt stored in DB
* Register & login (JWT)
* Responsive 3D styled UI with Framer Motion
* SQLite persistence

---

## 📦 Deliverables

* GitHub repo containing `/backend` and `/frontend`
* `/assets/screenshots/` folder with:

  * 1-products.png
  * 2-cart.png
  * 3-receipt.png
* 1–2 minute demo video (Loom/YouTube unlisted)
* README with setup instructions

---

## ⚙️ Environment setup

### Backend `.env.example`

```
PORT=4000
DB_PATH=./db/database.sqlite
JWT_SECRET=JWT_SECRET_KEY
```

### Frontend `.env.example`

```
VITE_API_BASE=http://localhost:4000/api
```

---

## 🧩 Scripts

We Can Run both frontend and backend simultaneously:

```bash
npm i -D concurrently
```

Then create a root `package.json`:

```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev --prefix backend\" \"npm run dev --prefix frontend\""
  }
}
```

Run everything with:

```bash
npm run dev
```

---

## 🧾 API Endpoints

| Method | Endpoint             | Description                    |
| ------ | -------------------- | ------------------------------ |
| GET    | `/api/products`      | Fetch all products             |
| POST   | `/api/cart`          | Add item to cart               |
| PUT    | `/api/cart/:id`      | Update quantity                |
| DELETE | `/api/cart/:id`      | Remove cart item               |
| GET    | `/api/cart`          | Get current cart & total       |
| POST   | `/api/checkout`      | Mock checkout, returns receipt |
| POST   | `/api/auth/register` | Register new user              |
| POST   | `/api/auth/login`    | Login existing user            |

---

## 📸 Screenshots

| Products                                       | Cart                                   | Receipt                                      |
| ---------------------------------------------- | -------------------------------------- | -------------------------------------------- |
| ![Products](assets/screenshots/1-products.png) | ![Cart](assets/screenshots/2-cart.png) | ![Receipt](assets/screenshots/3-receipt.png) |

---

## 🎥 Demo Video

👉 [Unlisted Loom/YouTube Link Here](#)

---

## 👩‍💻 Developer

**Sayli Kulkarni**
Full Stack Developer | MERN | JavaScript | React | Node.js

