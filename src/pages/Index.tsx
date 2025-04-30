
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // Se o usuário estiver autenticado, redirecionar para o dashboard
      navigate('/dashboard');
    } else {
      // Se não estiver autenticado, redirecionar para a tela de autenticação
      navigate('/auth');
    }
  }, [navigate, user]);

  return null;
};

export default Index;
