import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import type { Exercise, SetEntry, Workout } from '../types';
import Autocomplete from '../components/Autocomplete';
import EXERCISES from '../data/exercises';

const emptySet: SetEntry = { reps: 0, weight: 0 };
const toNumber = (v: string) => {
  if (v.trim() === '') return 0;
  const cleaned = v.replace(/[^\d.]/g, '');
  const n = Number(cleaned);
  return Number.isFinite(n) && n >= 0 ? n : 0;
};

const EditWorkout: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get<Workout>(`/api/workouts/${id}`);
        setTitle(data.title);
        setDate(data.date.slice(0, 10));
        setExercises(data.exercises.length ? data.exercises : [{ name: '', sets: [{ ...emptySet }] }]);
      } catch (e: any) {
        toast.error(e?.response?.data?.error || 'Failed to load workout');
        navigate('/dashboard', { replace: true });
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navigate]);

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
    const cleanExercises = exercises
      .filter((ex) => ex.name.trim())
      .map((ex) => ({
        name: ex.name.trim(),
        sets: ex.sets.map((s) => ({ reps: toNumber(String(s.reps)), weight: toNumber(String(s.weight)) })),
      }));

    setSaving(true);
    try {
      await api.put(`/api/workouts/${id}`, { title, date, exercises: cleanExercises });
      toast.success('Workout updated');
      navigate('/dashboard', { replace: true });
    } catch (e: any) {
      toast.error(e?.response?.data?.error || 'Failed to update workout');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-slate-600">Loading…</div>;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h2 className="text-2xl font-semibold">Edit Workout</h2>

      <div className="card card-pad grid gap-3">
        <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-slate-900">Exercises</h3>
          <button onClick={addExercise} className="rounded-xl border px-4 py-3 text-sm text-slate-700 hover:bg-slate-100">
            + Add Exercise
          </button>
        </div>

        {exercises.map((ex, i) => (
          <div key={i} className="card card-pad space-y-3">
            <div className="flex gap-2 flex-col sm:flex-row">
              <Autocomplete
                value={ex.name}
                onChange={(v) => updateExerciseName(i, v)}
                suggestions={EXERCISES}
                placeholder="Exercise name"
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
              <button onClick={() => addSet(i)} className="rounded-xl border px-3 py-2 text-sm text-slate-700 hover:bg-slate-100">+ Add set</button>
            </div>
          </div>
        ))}
      </div>

      <button onClick={save} disabled={saving} className="w-full sm:w-auto rounded-xl bg-slate-900 text-white px-4 py-3 hover:opacity-90 disabled:opacity-50">
        {saving ? 'Saving…' : 'Save Changes'}
      </button>
    </div>
  );
};

export default EditWorkout;
