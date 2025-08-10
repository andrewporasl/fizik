import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import type { Workout } from '../types';

const Dashboard: React.FC = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/workouts');
      setWorkouts(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const removeWithUndo = async (id: string) => {
    // find the workout we're about to delete (for potential undo)
    const toDelete = workouts.find(w => w._id === id);
    if (!toDelete) return;

    // confirm
    const ok = confirm(`Delete “${toDelete.title}” from ${new Date(toDelete.date).toDateString()}?`);
    if (!ok) return;

    // optimistic update: remove from UI first
    setWorkouts(prev => prev.filter(w => w._id !== id));

    try {
      await api.delete(`/api/workouts/${id}`);
    } catch (e) {
      toast.error('Failed to delete. Reloading…');
      load();
      return;
    }

    // show undo toast (recreate by POSTing the old doc without _id)
    const undo = () => {
      const payload = {
        title: toDelete.title,
        date: toDelete.date,
        exercises: toDelete.exercises.map(ex => ({
          name: ex.name,
          sets: ex.sets.map(s => ({ reps: Number(s.reps) || 0, weight: Number(s.weight) || 0 })),
        })),
      };
      toast.promise(
        api.post('/api/workouts', payload),
        {
          loading: 'Restoring…',
          success: 'Workout restored',
          error: 'Failed to restore',
        }
      ).then(load);
    };

    // custom toast UI with Undo button
    toast((tt) => (
      <div className="flex items-center gap-3">
        <span>Deleted. </span>
        <button
          onClick={() => { toast.dismiss(tt.id); undo(); }}
          className="rounded-md border px-2 py-1 text-xs hover:bg-slate-50"
        >
          Undo
        </button>
      </div>
    ), { duration: 5000 });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Your Workouts</h2>
        <div className="flex items-center gap-2">
          <Link to="/history" className="rounded-lg border px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100">
            History
          </Link>
          <Link to="/create" className="rounded-lg bg-slate-900 text-white px-3 py-2 text-sm hover:opacity-90">
            + Add Workout
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="rounded-xl border bg-white shadow-sm p-6 text-slate-600">Loading…</div>
      ) : workouts.length === 0 ? (
        <div className="rounded-xl border bg-white shadow-sm p-6 text-slate-700">
          No workouts yet. Create your first one!
        </div>
      ) : (
        <div className="grid gap-3">
          {workouts.map((w) => (
            <div key={w._id} className="rounded-xl border bg-white shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-slate-900">{w.title}</h3>
                  <p className="text-sm text-slate-600">{new Date(w.date).toDateString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    to={`/workouts/${w._id}/edit`}
                    className="rounded-lg border px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => removeWithUndo(w._id!)}
                    className="rounded-lg border px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="mt-3 space-y-3">
                {w.exercises.map((ex, i) => (
                  <div key={i} className="rounded-lg bg-slate-50 p-3">
                    <div className="font-medium text-slate-800">{ex.name}</div>
                    <div className="mt-2 grid gap-2 sm:grid-cols-3">
                      {ex.sets.map((s, j) => (
                        <div
                          key={j}
                          className="rounded border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                        >
                          Set {j + 1}: {s.reps} reps @ {s.weight}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
