import { Navigate } from 'react-router-dom';
type Props = { children: React.ReactNode };
const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/" replace />;
};
export default ProtectedRoute;
