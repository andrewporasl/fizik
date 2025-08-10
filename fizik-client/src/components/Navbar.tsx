import { Link, useLocation, useNavigate } from 'react-router-dom';

const NavLinkTop: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => {
  const { pathname } = useLocation();
  const active = pathname === to;
  return (
    <Link
      to={to}
      className={`rounded-lg px-3 py-2 text-sm hover:bg-slate-100 ${
        active ? 'bg-slate-100 text-slate-900' : 'text-slate-700'
      }`}
    >
      {children}
    </Link>
  );
};

const NavLinkBottom: React.FC<{ to: string; label: string }> = ({ to, label }) => {
  const { pathname } = useLocation();
  const active = pathname === to;
  return (
    <Link
      to={to}
      className={`flex flex-col items-center justify-center gap-1 flex-1 py-2 ${
        active ? 'text-slate-900' : 'text-slate-600'
      }`}
    >
      <span className="text-xs">{label}</span>
    </Link>
  );
};

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const authed = !!localStorage.getItem('token');

  const onLogout = () => {
    localStorage.removeItem('token');
    navigate('/', { replace: true });
  };

  return (
    <>
      {/* Top bar (desktop/tablet) */}
      <header className="hidden sm:block sticky top-0 z-10 border-b bg-white/90 backdrop-blur">
        <div className="mx-auto max-w-4xl px-4 h-14 flex items-center justify-between">
          <Link to="/dashboard" className="font-semibold tracking-tight">Fizik</Link>
          <nav className="flex items-center gap-2">
            {authed ? (
              <>
                <NavLinkTop to="/dashboard">Dashboard</NavLinkTop>
                <NavLinkTop to="/create">New</NavLinkTop>
                <NavLinkTop to="/history">History</NavLinkTop>
                <button
                  onClick={onLogout}
                  className="rounded-lg border px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLinkTop to="/">Login</NavLinkTop>
                <Link to="/register" className="rounded-lg bg-slate-900 text-white px-3 py-2 text-sm hover:opacity-90">
                  Sign up
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Bottom nav (mobile) */}
      {authed && (
        <nav className="sm:hidden fixed bottom-0 inset-x-0 z-10 border-t bg-white/95 backdrop-blur">
          <div className="mx-auto max-w-4xl px-2 flex">
            <NavLinkBottom to="/dashboard" label="Dashboard" />
            <NavLinkBottom to="/create" label="New" />
            <NavLinkBottom to="/history" label="History" />
            <button onClick={onLogout} className="flex-1 py-2 text-slate-600 text-xs">Logout</button>
          </div>
        </nav>
      )}
    </>
  );
};

export default Navbar;
