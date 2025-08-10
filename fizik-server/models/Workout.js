const mongoose = require('mongoose');

const setSchema = new mongoose.Schema(
  {
    reps:   { type: Number, required: true, min: 0 },
    weight: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const exerciseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    sets: { type: [setSchema], default: [] },
  },
  { _id: false }
);

const workoutSchema = new mongoose.Schema(
  {
    userId:    { type: mongoose.Types.ObjectId, ref: 'User', index: true, required: true },
    title:     { type: String, required: true, trim: true },
    date:      { type: Date, required: true },
    exercises: { type: [exerciseSchema], default: [] },
  },
  { timestamps: true }
);

workoutSchema.index({ userId: 1, date: -1, _id: -1 });

module.exports = mongoose.model('Workout', workoutSchema);
