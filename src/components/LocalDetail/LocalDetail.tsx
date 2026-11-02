import type { Local } from '../../types/Local'
import { EmptyState } from '../EmptyState/EmptyState'
import NotaAcessibilidade from '../NotaAcessibilidade/NotaAcessibilidade'

type LocalDetailProps = {
  local: Local
}

export default function LocalDetail({ local }: LocalDetailProps) {
  const semRecursos = local.tiposAcessibilidade.length === 0

  return (
    <article className="min-w-0 break-words">
      <p className="text-sm font-medium uppercase tracking-wide text-gray-600">
        {local.categoria}
      </p>

      <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
        {local.nome}
      </h1>

      <dl className="mt-6 space-y-4">
        <div>
          <dt className="font-semibold text-gray-900">Endereço</dt>
          <dd className="mt-1 text-gray-800">{local.endereco}</dd>
        </div>

        <div>
          <dt className="font-semibold text-gray-900">
            Nota de acessibilidade
          </dt>
          <dd className="mt-1">
            <NotaAcessibilidade nota={local.notaAcessibilidade} />
          </dd>
        </div>
      </dl>

      <section aria-labelledby="titulo-descricao" className="mt-8">
        <h2 id="titulo-descricao" className="text-xl font-semibold">
          Descrição
        </h2>

        <p className="mt-2 leading-relaxed text-gray-800">
          {local.descricao}
        </p>
      </section>

      <section aria-labelledby="titulo-recursos" className="mt-8">
        <h2 id="titulo-recursos" className="text-xl font-semibold">
          Recursos de acessibilidade
        </h2>

        {semRecursos ? (
          <EmptyState
            titulo="Nenhum recurso de acessibilidade informado."
            link={{
              rotulo: 'Adicionar recursos',
              para: `/locais/editar/${local.id}`,
            }}
          />
        ) : (
          <ul className="mt-3 flex flex-wrap gap-2">
            {local.tiposAcessibilidade.map((tipo) => (
              <li
                key={tipo}
                className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-800"
              >
                {tipo}
              </li>
            ))}
          </ul>
        )}
      </section>
    </article>
  )
}