import { Link } from "react-router-dom";
import { useTituloDocumento } from '../../hooks/useTituloDocumento'

export default function NotFound() {
  useTituloDocumento('Página não encontrada')
  return (
    <div>
      <h1>404</h1>
      <p>O endereço que você está procurando não foi encontrado.</p>
      <Link to="/">Voltar para a página inicial</Link>
    </div>
  );
}