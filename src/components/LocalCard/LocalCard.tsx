import { Link } from 'react-router-dom'
import type { Local } from '../../types/Local'

type LocalCardProps = {
  local: Local
}

export default function LocalCard({ local }: LocalCardProps) {
  return (
    <article className="flex min-w-0 flex-col justify-between gap-3 break-words rounded-xl border border-gray-200 p-4 shadow-sm">
      <div>
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold text-gray-900">{local.nome}</h3>

          <span className="shrink-0 rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-800">
            {local.categoria}
          </span>
        </div>

        <p className="mt-1 text-sm text-gray-600">{local.endereco}</p>

        <ul className="mt-3 flex flex-wrap gap-2">
          {local.tiposAcessibilidade.map((tipo) => (
            <li
              key={tipo}
              className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-800"
            >
              {tipo}
            </li>
          ))}
        </ul>
      </div>

      <Link
        to={`/locais/${local.id}`}
        className="inline-flex min-h-11 items-center text-sm font-medium text-blue-700 underline hover:text-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
      >
        Ver detalhes<span className="sr-only"> de {local.nome}</span>
      </Link>
    </article>
  )
}

