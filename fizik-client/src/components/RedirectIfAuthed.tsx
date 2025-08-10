import { Navigate } from 'react-router-dom';
type Props = { children: React.ReactNode };
const RedirectIfAuthed: React.FC<Props> = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? <Navigate to="/dashboard" replace /> : children;
};
export default RedirectIfAuthed;
