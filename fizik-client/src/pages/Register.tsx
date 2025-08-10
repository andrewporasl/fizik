import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    setErr(null); setLoading(true);
    try {
      const { data } = await api.post('/api/auth/register', { username, password });
      localStorage.setItem('token', data.token);
      navigate('/dashboard', { replace: true });
    } catch (e: any) {
      setErr(e?.response?.data?.error || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="mx-auto max-w-md">
      <div className="card card-pad space-y-4">
        <h2 className="text-2xl font-semibold">Create account</h2>
        {err && <div className="rounded-xl bg-red-50 text-red-700 px-3 py-2 text-sm">{err}</div>}
        <div className="space-y-3">
          <input placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
          <button
            onClick={handleRegister}
            disabled={loading || !username || !password}
            className="w-full sm:w-auto rounded-xl bg-slate-900 text-white px-4 py-3 hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Creating…' : 'Create Account'}
          </button>
        </div>
        <p className="text-sm text-slate-600">
          Already have an account? <Link className="underline" to="/">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
