import { useNavigate } from 'react-router-dom';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import { useEffect } from 'react';

const ProtectedRoute = ({ children }) => {
    const auth = useAuthUser();
    const navigate = useNavigate();
  
    useEffect(() => {
      if (!auth) {
        navigate('/');
      }
    }, [auth, navigate]);
  
    return auth ? children : null;
  };
  
export default ProtectedRoute;
