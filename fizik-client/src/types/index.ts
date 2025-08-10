export type SetEntry = { reps: number; weight: number };

export type Exercise = {
  name: string;
  sets: SetEntry[];
};

export type Workout = {
  _id?: string;
  title: string;
  date: string; // ISO
  exercises: Exercise[];
};
