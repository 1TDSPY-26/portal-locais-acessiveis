import { Link } from "react-router-dom";

export const ROTULO_ERRO_404 = "Erro 404";
export const TITULO_NAO_ENCONTRADO = "Página não encontrada";
export const DESCRICAO_NAO_ENCONTRADO =
  "O endereço digitado não existe ou mudou de lugar. Confira o endereço ou siga por um dos caminhos abaixo.";

const classeLinkPrincipal =
  "inline-flex min-h-11 items-center justify-center rounded-md bg-blue-700 px-5 font-medium text-white hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700";
const classeLinkSecundario =
  "inline-flex min-h-11 items-center justify-center rounded-md border border-gray-300 px-5 font-medium text-gray-900 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <p className="text-sm font-medium uppercase tracking-wide text-gray-600">
        {ROTULO_ERRO_404}
      </p>

      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        {TITULO_NAO_ENCONTRADO}
      </h1>

      <p className="mt-4 text-gray-700">
        {DESCRICAO_NAO_ENCONTRADO}
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link to="/" className={classeLinkPrincipal}>
          Voltar para a página inicial
        </Link>

        <Link to="/locais" className={classeLinkSecundario}>
          Ver locais acessíveis
        </Link>
      </div>
    </div>
  );
}
