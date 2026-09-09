import { Link } from "react-router-dom";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

export default function NotFound() {
  useDocumentTitle("Página não encontrada");

  return (
    <div>
      <h1>404</h1>
      <p>O endereço que você está procurando não foi encontrado.</p>
      <Link to="/">Voltar para a página inicial</Link>
    </div>
  );
}