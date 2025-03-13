import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getProfile } from '../utils/auth';

const ProtectedRoute = ({ component: Component }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getProfile();
      setUser(data);
    };
    fetchData();
  }, []);

  if (!user) return <Navigate to="/login" />;

  return <Component user={user} />;
};

export default ProtectedRoute;
