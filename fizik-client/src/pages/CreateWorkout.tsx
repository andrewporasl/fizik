import { useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import type { Exercise, SetEntry } from '../types';
import Autocomplete from '../components/Autocomplete';
import EXERCISES from '../data/exercises';

const emptySet: SetEntry = { reps: 0, weight: 0 };
const toNumber = (v: string) => {
  if (v.trim() === '') return 0;
  const cleaned = v.replace(/[^\d.]/g, '');
  const n = Number(cleaned);
  return Number.isFinite(n) && n >= 0 ? n : 0;
};

const TEMPLATES: Record<string, string[]> = {
  'Chest & Biceps': ['Bench Press', 'Bicep Cable Curl', 'Chest Variation', 'Hammer Cable Curl', 'Lateral Cable Raise'],
  'Back & Triceps': ['Lat Pulldown', 'Tricep Cable Pushdown', 'Back Variation', 'Dips', 'Pull Ups'],
  'Leg Day': ['Back Squat', 'Romanian Deadlift', 'Leg Press', 'Calf Raise'],
  'Push Day': ['Bench Press', 'Overhead Press', 'Lateral Raise', 'Triceps Pushdown'],
  'Pull Day': ['Deadlift', 'Barbell Row', 'Lat Pulldown', 'Biceps Curl'],
};

const CreateWorkout: React.FC = () => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [saving, setSaving] = useState(false);

  const applyTemplate = (name: string) => {
    const names = TEMPLATES[name] || [];
    if (!names.length) return;
    setExercises(names.map((n) => ({ name: n, sets: [{ ...emptySet }] })));
    if (!title) setTitle(name);
  };

  const addExercise = () => setExercises((p) => [...p, { name: '', sets: [{ ...emptySet }] }]);
  const removeExercise = (i: number) => setExercises((p) => p.filter((_, idx) => idx !== i));
  const updateExerciseName = (i: number, name: string) =>
    setExercises((p) => p.map((ex, idx) => (idx === i ? { ...ex, name } : ex)));

  const addSet = (i: number) =>
    setExercises((p) => p.map((ex, idx) => (idx === i ? { ...ex, sets: [...ex.sets, { ...emptySet }] } : ex)));

  const updateSet = (i: number, j: number, field: keyof SetEntry, val: string) =>
    setExercises((p) =>
      p.map((ex, idx) => {
        if (idx !== i) return ex;
        const sets = ex.sets.map((s, sIdx) => (sIdx === j ? { ...s, [field]: toNumber(val) } : s));
        return { ...ex, sets };
      })
    );

  const removeSet = (i: number, j: number) =>
    setExercises((p) =>
      p.map((ex, idx) => {
        if (idx !== i) return ex;
        const sets = ex.sets.filter((_, sIdx) => sIdx !== j);
        return { ...ex, sets: sets.length ? sets : [{ ...emptySet }] };
      })
    );

  const save = async () => {
    if (!title || !date) return toast.error('Please enter a title and date');
    const clean = exercises
      .filter((ex) => ex.name.trim())
      .map((ex) => ({
        name: ex.name.trim(),
        sets: ex.sets.map((s) => ({ reps: toNumber(String(s.reps)), weight: toNumber(String(s.weight)) })),
      }));

    if (clean.length === 0) return toast.error('Add at least one exercise');
    const hasSet = clean.some((ex) => ex.sets.some((s) => s.reps > 0 || s.weight > 0));
    if (!hasSet) return toast.error('Add at least one set with reps or weight');

    setSaving(true);
    try {
      await api.post('/api/workouts', { title, date, exercises: clean });
      toast.success('Workout saved');
      window.location.href = '/dashboard';
    } catch (e: any) {
      toast.error(e?.response?.data?.error || 'Failed to save workout');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h2 className="text-2xl font-semibold">Create Workout</h2>

      {/* Template chooser */}
      <div className="card card-pad">
        <div className="flex flex-wrap gap-2">
          {Object.keys(TEMPLATES).map((t) => (
            <button
              key={t}
              onClick={() => applyTemplate(t)}
              className="rounded-xl border px-4 py-3 text-sm text-slate-700 hover:bg-slate-100"
            >
              {t}
            </button>
          ))}
          <button
            onClick={() => setExercises([])}
            className="rounded-xl border px-4 py-3 text-sm text-slate-700 hover:bg-slate-100"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Basic info */}
      <div className="card card-pad grid gap-3">
        <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>

      {/* Exercises */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-slate-900">Exercises</h3>
          <button onClick={addExercise} className="rounded-xl border px-4 py-3 text-sm text-slate-700 hover:bg-slate-100">
            + Add Exercise
          </button>
        </div>

        {exercises.length === 0 && (
          <div className="card card-pad text-sm text-slate-600">No exercises yet.</div>
        )}

        {exercises.map((ex, i) => (
          <div key={i} className="card card-pad space-y-3">
            <div className="flex gap-2 flex-col sm:flex-row">
              <Autocomplete
                value={ex.name}
                onChange={(v) => updateExerciseName(i, v)}
                suggestions={EXERCISES}
                placeholder="Exercise name (e.g., Bench Press)"
                className="flex-1"
              />
              <button onClick={() => removeExercise(i)} className="rounded-xl border px-4 py-3 text-sm text-slate-700 hover:bg-slate-100">
                Remove
              </button>
            </div>

            <div className="space-y-2">
              {ex.sets.map((s, j) => (
                <div key={j} className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-center">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="Reps"
                      value={s.reps === 0 ? '' : String(s.reps)}
                      onChange={(e) => updateSet(i, j, 'reps', e.target.value)}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      inputMode="decimal"
                      pattern="[0-9]*"
                      placeholder="Weight"
                      value={s.weight === 0 ? '' : String(s.weight)}
                      onChange={(e) => updateSet(i, j, 'weight', e.target.value)}
                    />
                  </div>
                  <div className="sm:col-span-1 flex justify-end">
                    <button onClick={() => removeSet(i, j)} className="rounded-xl border px-3 py-2 text-sm text-slate-700 hover:bg-slate-100">
                      Remove set
                    </button>
                  </div>
                </div>
              ))}

              <button onClick={() => addSet(i)} className="rounded-xl border px-3 py-2 text-sm text-slate-700 hover:bg-slate-100">
                + Add set
              </button>
            </div>
          </div>
        ))}
      </div>

      <button onClick={save} disabled={saving} className="w-full sm:w-auto rounded-xl bg-slate-900 text-white px-4 py-3 hover:opacity-90 disabled:opacity-50">
        {saving ? 'Saving…' : 'Save Workout'}
      </button>
    </div>
  );
};

export default CreateWorkout;
