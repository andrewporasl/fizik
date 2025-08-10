const express = require('express');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const Workout = require('../models/Workout');

const router = express.Router();

/* List workouts for current user (newest first) */
router.get('/', auth, async (req, res) => {
  const workouts = await Workout.find({ userId: req.userId }).sort({ date: -1, _id: -1 });
  res.json(workouts);
});

/* Get single workout */
router.get('/:id', auth, async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ error: 'invalid id' });
  const workout = await Workout.findOne({ _id: id, userId: req.userId });
  if (!workout) return res.status(404).json({ error: 'not found' });
  res.json(workout);
});

/* Create workout */
router.post('/', auth, async (req, res) => {
  const { title, date, exercises = [] } = req.body;
  if (!title || !date) return res.status(400).json({ error: 'title and date are required' });

  const cleanExercises = Array.isArray(exercises)
    ? exercises
        .filter((ex) => ex && typeof ex.name === 'string' && ex.name.trim())
        .map((ex) => ({
          name: ex.name.trim(),
          sets: Array.isArray(ex.sets)
            ? ex.sets
                .filter((s) => s && !isNaN(Number(s.reps)) && !isNaN(Number(s.weight)))
                .map((s) => ({ reps: Number(s.reps), weight: Number(s.weight) }))
            : [],
        }))
    : [];

  const workout = await Workout.create({
    userId: req.userId,
    title: String(title).trim(),
    date,
    exercises: cleanExercises,
  });

  res.status(201).json(workout);
});

/* Update workout */
router.put('/:id', auth, async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ error: 'invalid id' });

  const { title, date, exercises } = req.body;
  const updateDoc = {};
  if (title !== undefined) updateDoc.title = String(title).trim();
  if (date !== undefined) updateDoc.date = date;
  if (exercises !== undefined) {
    updateDoc.exercises = Array.isArray(exercises)
      ? exercises
          .filter((ex) => ex && typeof ex.name === 'string' && ex.name.trim())
          .map((ex) => ({
            name: ex.name.trim(),
            sets: Array.isArray(ex.sets)
              ? ex.sets
                  .filter((s) => s && !isNaN(Number(s.reps)) && !isNaN(Number(s.weight)))
                  .map((s) => ({ reps: Number(s.reps), weight: Number(s.weight) }))
              : [],
          }))
      : [];
  }

  const updated = await Workout.findOneAndUpdate(
    { _id: id, userId: req.userId },
    { $set: updateDoc },
    { new: true }
  );
  if (!updated) return res.status(404).json({ error: 'not found' });
  res.json(updated);
});

/* Delete workout */
router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ error: 'invalid id' });
  const result = await Workout.deleteOne({ _id: id, userId: req.userId });
  if (result.deletedCount === 0) return res.status(404).json({ error: 'not found' });
  res.status(204).end();
});

module.exports = router;
