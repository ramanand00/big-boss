import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const useAuthRedirect = (requireAuth = false) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !user) {
        navigate('/login');
      } else if (!requireAuth && user) {
        navigate('/');
      }
    }
  }, [user, loading, navigate, requireAuth]);

  return { user, loading };
};