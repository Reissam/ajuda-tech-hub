
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirecionar para a tela de autenticação
    navigate('/auth');
  }, [navigate]);

  return null;
};

export default Index;
