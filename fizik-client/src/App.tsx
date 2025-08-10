import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateWorkout from './pages/CreateWorkout';
import EditWorkout from './pages/EditWorkout';
import ExerciseHistory from './pages/ExerciseHistory';
import ProtectedRoute from './components/ProtectedRoute';
import RedirectIfAuthed from './components/RedirectIfAuthed';
import Navbar from './components/Navbar';

const Page: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    <Navbar />
    {/* Extra bottom padding so content isn't hidden behind mobile bottom nav */}
    <main className="mx-auto max-w-4xl px-4 py-6 pb-24 sm:pb-10">{children}</main>
  </>
);

const App: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<RedirectIfAuthed><Page><Login /></Page></RedirectIfAuthed>} />
      <Route path="/register" element={<RedirectIfAuthed><Page><Register /></Page></RedirectIfAuthed>} />
      <Route path="/dashboard" element={<ProtectedRoute><Page><Dashboard /></Page></ProtectedRoute>} />
      <Route path="/create" element={<ProtectedRoute><Page><CreateWorkout /></Page></ProtectedRoute>} />
      <Route path="/workouts/:id/edit" element={<ProtectedRoute><Page><EditWorkout /></Page></ProtectedRoute>} />
      <Route path="/history" element={<ProtectedRoute><Page><ExerciseHistory /></Page></ProtectedRoute>} />
    </Routes>
  </BrowserRouter>
);

export default App;
