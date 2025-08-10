import { useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import type { Workout } from '../types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

type DataPoint = { date: string; weight: number; reps: number };

const ExerciseHistory: React.FC = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [exercise, setExercise] = useState<string>('');

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get<Workout[]>('/api/workouts', { params: { limit: 200 } });
        // support both shapes: list or paginated
        const items = Array.isArray(data) ? data : (data as any).items ?? [];
        setWorkouts(items);
        const names = new Map<string, number>();
        items.forEach((w: Workout) => w.exercises.forEach((ex: { name: string }) => names.set(ex.name, (names.get(ex.name) || 0) + 1)));
        const best = [...names.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || '';
        setExercise(best);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const allExerciseNames = useMemo(() => {
    const set = new Set<string>();
    workouts.forEach(w => w.exercises.forEach(ex => ex.name && set.add(ex.name)));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [workouts]);

  const data: DataPoint[] = useMemo(() => {
    if (!exercise) return [];
    const pts: DataPoint[] = [];
    workouts.forEach(w => {
      const ex = w.exercises.find(e => e.name === exercise);
      if (!ex) return;
      ex.sets.forEach(s => {
        pts.push({
          date: w.date.slice(0, 10),
          weight: Number(s.weight) || 0,
          reps: Number(s.reps) || 0,
        });
      });
    });
    return pts.sort((a, b) => a.date.localeCompare(b.date));
  }, [workouts, exercise]);

  const pr = useMemo(() => {
    if (data.length === 0) return null;
    return data.reduce((max, d) => (d.weight > max.weight ? d : max), data[0]);
  }, [data]);

  if (loading) return <div className="text-slate-600">Loading…</div>;

  if (allExerciseNames.length === 0) {
    return <div className="card card-pad text-slate-700">No exercises found yet. Create a workout first.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-2xl font-semibold">Exercise History</h2>
        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-600">Exercise</label>
          <select
            className="rounded-xl border border-slate-300 bg-white px-3 py-3 text-slate-900"
            value={exercise}
            onChange={(e) => setExercise(e.target.value)}
          >
            {allExerciseNames.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* PR card */}
      <div className="card card-pad flex items-center justify-between">
        <div>
          <div className="text-sm text-slate-600">Personal Best</div>
          <div className="text-xl font-semibold text-slate-900">
            {pr ? `${pr.weight} × ${pr.reps}` : '—'}
          </div>
        </div>
        <div className="text-sm text-slate-600">
          {pr ? `on ${new Date(pr.date).toDateString()}` : ''}
        </div>
      </div>

      {/* Chart */}
      <div className="card card-pad">
        <div className="text-sm text-slate-700 mb-2">Weight over time</div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="weight" strokeWidth={2} dot />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent sets */}
      <div className="card card-pad">
        <div className="text-sm text-slate-700 mb-3">Recent sets</div>
        {data.length === 0 ? (
          <div className="text-slate-600 text-sm">No sets logged for this exercise yet.</div>
        ) : (
          <div className="grid gap-2">
            {[...data].reverse().slice(0, 12).map((d, i) => (
              <div key={i} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
                <div className="text-slate-700">{d.date}</div>
                <div className="text-slate-900 font-medium">{d.weight} × {d.reps}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExerciseHistory;
