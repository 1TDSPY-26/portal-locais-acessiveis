import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Componentes e Serviços da equipe
import ErrorMessage from '../components/Error/ErrorMessage';
import { Loading } from '../components/Loading/Loading';
import { LocalDetail } from '../components/LocalDetail/LocalDetail';
import { obterLocalPorId } from '../services/locais';
import type { Local } from '../types/Local';

export default function DetalheLocalPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [local, setLocal] = useState<Local | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    async function buscarDados() {
      if (!id) return;

      try {
        setLoading(true);
        setErro(null);

        const resultado = await obterLocalPorId(Number(id));

        if (resultado && resultado.data) {
          setLocal(resultado.data);
        } else {
          setErro('Local não encontrado.');
        }
      } catch {
        setErro('Erro ao carregar as informações do local.');
      } finally {
        setLoading(false);
      }
    }

    buscarDados();
  }, [id, tentativa]);

  if (loading) {
    return <Loading />;
  }

  if (erro || !local) {
    return (
      <main tabIndex={-1} aria-live="polite" className="container mx-auto p-4">
        <ErrorMessage 
          message={erro || 'Local não encontrado.'} 
          onRetry={() => setTentativa((prev) => prev + 1)} 
        />
        <button
          onClick={() => navigate('/locais')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2"
        >
          Voltar para a lista
        </button>
      </main>
    );
  }

  return (
    <main tabIndex={-1} className="container mx-auto p-4">
      <LocalDetail local={local} />
    </main>
  );
}