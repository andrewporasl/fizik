import { z } from 'zod';

export const SetEntrySchema = z.object({
  reps: z.number().min(0, 'reps must be ≥ 0'),
  weight: z.number().min(0, 'weight must be ≥ 0'),
});

export const ExerciseSchema = z.object({
  name: z.string().trim().min(1, 'exercise name is required'),
  sets: z.array(SetEntrySchema).min(1, 'at least one set is required'),
});

export const WorkoutCreateSchema = z.object({
  title: z.string().trim().min(1, 'title is required'),
  date: z.string().min(1, 'date is required'),
  exercises: z.array(ExerciseSchema).min(1, 'at least one exercise is required'),
});

export type WorkoutCreateInput = z.infer<typeof WorkoutCreateSchema>;
