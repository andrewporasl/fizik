# Fizik — Full-Stack Workout Tracker

Fizik is a **full-stack fitness tracking app** built with **React (TypeScript)**, **Tailwind CSS**, and **Node.js/Express**.  
It helps users log workouts, track progress, and view past sessions — accessible from **any device**.

##  Features

- **Authentication** (Register, Login, Protected Routes)
- **Workout creation** with:
  - Exercise name autocomplete
  - Reps & weight tracking
  - Multiple set support
  - Prebuilt workout templates (Push, Pull, Legs, etc.)
- **Workout dashboard** to review saved sessions
- **Responsive UI** for mobile & desktop
- **REST API** backend with MongoDB

##  Tech Stack

**Frontend**
- React + TypeScript
- Tailwind CSS + ShadCN UI
- React Router DOM
- Axios for API requests

**Backend**
- Node.js / Express
- MongoDB + Mongoose
- JWT authentication
- bcrypt for password hashing
- dotenv for environment variables

##  Installation

### 1. Clone the repository
```bash
git clone https://github.com/YOUR-USERNAME/fizik.git
cd fizik
```
### 2. Install dependencies

## Backend

```bash
cd fizik-server
npm install
```

## Frontend

```bash
cd ../fizik-client
npm install
```

### 3. Environment variables

Create .env files in both fizik-server and fizik-client (see .env.example for the format).

Example .env for backend (already in the repo but if you see it here first ig it helps):

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=supersecretkey
```

Frontend will run at http://localhost:5173
Backend will run at http://localhost:5000 (or .env PORT value)

### Screenshots

## Login

<img width="1160" height="608" alt="image" src="https://github.com/user-attachments/assets/c66d10c3-f3e0-4582-8e30-9cb22767adc9" />

## Dashboard

<img width="1306" height="955" alt="image" src="https://github.com/user-attachments/assets/46bcaf8f-c7e5-4fe2-b604-30067b542d10" />

## Progress

<img width="904" height="821" alt="image" src="https://github.com/user-attachments/assets/08fe2c93-faba-4691-9a67-8e96ccbf8c28" />


### Dev. Roadmap

Freeballing it for now, don't know what it will be like at prod, besides the fact that it will get to prod!

### Enjoy!
