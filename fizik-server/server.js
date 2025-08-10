const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// middleware
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173', credentials: true }));
app.use(express.json());

// health
app.get('/api/health', (_req, res) => res.json({ ok: true, uptime: process.uptime() }));

// routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/workouts', require('./routes/workouts'));

// protected me
const auth = require('./middleware/auth');
app.get('/api/me', auth, (req, res) => res.json({ userId: req.userId }));

// start
async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');
    const port = process.env.PORT || 5000;
    app.listen(port, () => console.log(`🚀 Server running at http://localhost:${port}`));
  } catch (err) {
    console.error('Mongo connection failed:', err.message);
    process.exit(1);
  }
}
start();
