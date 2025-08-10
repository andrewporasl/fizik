import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setErr(null); setLoading(true);
    try {
      const { data } = await api.post('/api/auth/login', { username, password });
      localStorage.setItem('token', data.token);
      navigate('/dashboard', { replace: true });
    } catch (e: any) {
      setErr(e?.response?.data?.error || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="mx-auto max-w-md">
      <div className="card card-pad space-y-4">
        <h2 className="text-2xl font-semibold">Welcome back</h2>
        {err && <div className="rounded-xl bg-red-50 text-red-700 px-3 py-2 text-sm">{err}</div>}
        <div className="space-y-3">
          <input placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
          <button
            onClick={handleLogin}
            disabled={loading || !username || !password}
            className="w-full sm:w-auto rounded-xl bg-slate-900 text-white px-4 py-3 hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Logging in…' : 'Log In'}
          </button>
        </div>
        <p className="text-sm text-slate-600">
          New here? <Link className="underline" to="/register">Create account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
