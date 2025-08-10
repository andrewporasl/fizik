import { useNavigate } from 'react-router-dom';

const LogoutButton: React.FC = () => {
  const navigate = useNavigate();
  const onLogout = () => {
    localStorage.removeItem('token');
    navigate('/', { replace: true });
  };
  return <button onClick={onLogout}>Logout</button>;
};

export default LogoutButton;
