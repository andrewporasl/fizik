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
git clone https://github.com/andrewporasl/fizik.git
cd fizik
```
### 2. Install dependencies

## Install Node Package Manager

Run in ```../fizik``` root folder:

```bash
npm install
```

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

Example .env for backend (already in the repo, but if you see it here first ig it helps):

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=supersecretkey
```

Frontend will run at http://localhost:5173
Backend will run at http://localhost:5000 (or .env PORT value)

### Screenshots

## Login

<img width="1915" height="959" alt="image" src="https://github.com/user-attachments/assets/bf6e23e6-65dc-46bb-9373-1e235b37512a" />

## Dashboard

<img width="1918" height="937" alt="image" src="https://github.com/user-attachments/assets/3a4ee112-bc2d-4ed9-b5f0-24760e1bf545" />

## Progress

<img width="1918" height="934" alt="image" src="https://github.com/user-attachments/assets/b95a3dae-cdc4-41ba-b0c2-00e479ffede5" />


### Dev. Roadmap

Freeballing it for now, don't know what it will be like at prod, besides the fact that it will get to prod!

### Enjoy!
