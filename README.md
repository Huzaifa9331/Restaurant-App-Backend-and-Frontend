# Meg Restaurant App: Backend API

REST API for a mobile restaurant app. It handles user authentication, the food menu, orders with payment and status tracking, and table reservations.

## Demo
- **Demo video (YouTube):**https://www.youtube.com/watch?v=6JkhPPjuVt4
- **Frontend repository:** https://github.com/Huzaifa9331/Restaurant-App-Backend-and-Frontend

## Tech Stack

| Layer | Technology |
|---|---|
| Language | JavaScript (ES Modules) |
| Runtime | Node.js |
| Framework | Express 5 |
| Database | MongoDB Atlas |
| ODM | Mongoose |
| Authentication | JSON Web Tokens (JWT) |
| Password hashing | bcryptjs |
| Image uploads | Cloudinary, Multer, Streamifier |
| Other | cors, cookie-parser, dotenv |

## Features
- Sign up and log in with JWT authentication (token returned in the response)
- Role-based access: **Customer** and **Manager**
- Food menu with categories (Starters, Mains, Sides, Desserts, Drinks)
- Place orders (prices are calculated on the server, never trusted from the app)
- Payment method: Cash On Delivery or Online (simulated)
- Order tracking: Pending → Preparing → Ready → Completed (or Cancelled)
- Table reservations with seat and time-clash checks
- Manager-only routes for menu, orders, tables, and reservations
- Central error handling and JSON 404 responses

## Project Structure

```
MAD-main/
├── index.js              # Express app, middleware, route mounting, server start
├── db.js                 # MongoDB Atlas connection
├── seed.js               # Adds sample menu items and tables
├── package.json
├── .env.example          # Template for environment variables
├── .gitignore
├── Controller/
│   ├── User.js           # signUp, signIn, logOut, profile, user management
│   ├── Menu.js           # list, create, update, delete menu items
│   ├── Order.js          # create, list, track, pay, cancel, update status
│   ├── Table.js          # list, create, delete tables
│   └── Reservation.js    # book, list, cancel, update status
├── Routers/
│   ├── User.js
│   ├── Menu.js
│   ├── Order.js
│   ├── Table.js
│   └── Reservation.js
├── Schema/
│   ├── User.js           # name, email, password, role, profileImage
│   ├── Menu.js           # name, description, price, category, isAvailable
│   ├── Order.js          # user, orderItems, totalAmount, payment, orderStatus
│   ├── Table.js          # tableNumber, seats, isAvailable
│   └── Reservation.js    # user, table, date, guests, status
└── utils/
    ├── Auth.js           # isAuthenticated, isManager (role check)
    ├── Token.js          # creates the JWT and sends the response
    ├── Cloudinary.js     # Cloudinary configuration
    └── Upload.js         # Multer upload setup
```

## Getting Started

### 1. Requirements
- Node.js 18 or newer
- A free MongoDB Atlas cluster and its connection string

### 2. Install
```bash
npm install
```

### 3. Environment variables
Copy `.env.example` to `.env` and fill it in:

```
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
SECRET_KEY=a_long_random_secret
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```
Cloudinary is only needed for profile image uploads. Everything else works without it. **Never commit `.env`.**

### 4. Add sample data
```bash
node seed.js
```
This adds 10 menu items and 6 tables. It is safe to run more than once.

### 5. Start the server
```bash
node index.js
```
For auto-restart during development:
```bash
npm run dev
```
You should see `MongoDB connected` and `Server running on port 5000`.

### 6. Check it works
Open `http://localhost:5000/`. It should return:
```json
{ "success": true, "message": "Restaurant API is working" }
```

### Using it from a phone
The phone and the computer must be on the **same
