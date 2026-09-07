import React from 'react';
import { Link } from 'react-router-dom';

interface ErrorPageProps {
  onRetry?: () => void;
}

export const ErrorPage: React.FC<ErrorPageProps> = ({ onRetry }) => {
  const handleReload = (): void => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <main role="alert" style={{ padding: '3rem 1rem', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Ops! Algo deu errado</h1>
      <p style={{ marginTop: '1rem' }}>
        Ocorreu um erro inesperado na aplicação. Tente recarregar a página ou retornar para o início.
      </p>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
        <button type="button" onClick={handleReload}>
          Recarregar página
        </button>
        <Link to="/">
          Voltar para a Home
        </Link>
      </div>
    </main>
  );
};

export default ErrorPage;