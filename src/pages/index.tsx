import { useEffect, useState } from 'react'; // Correção: importação dos hooks do React
import { useParams, useNavigate } from 'react-router-dom';
import { buscarLocalPorId } from '@/services/locaisService'; 
import { DetalheLocalComponente } from '@/components/DetalheLocal'; 
import { Loading } from '@/components/Loading'; 
import { ErrorMessage } from '@/components/ErrorMessage'; 
import { Local } from '@/types/local';

export const DetalheLocalPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [local, setLocal] = useState<Local | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const carregarLocal = async () => {
      if (!id) {
        setError('Identificador do local inválido.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await buscarLocalPorId(id);

        if (!data) {
          setError('Local não encontrado.');
        } else {
          setLocal(data);
        }
      } catch {
      
        setError('O local solicitado não foi encontrado.');
      } finally {
        setLoading(false);
      }
    };

    carregarLocal();
  }, [id]);

  if (loading) {
    return <Loading message="Carregando detalhes do local..." />;
  }

  if (error || !local) {
    return (
      <main tabIndex={-1} aria-live="polite" className="container mx-auto p-4">
        <ErrorMessage message={error || 'Local inexistente.'} />
        <button
          onClick={() => navigate('/locais')}
          className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark focus:outline-none focus:ring-2"
        >
          Voltar para a lista de locais
        </button>
      </main>
    );
  }

  return (
    <main tabIndex={-1} className="container mx-auto p-4">
      <DetalheLocalComponente local={local} />
    </main>
  );
};