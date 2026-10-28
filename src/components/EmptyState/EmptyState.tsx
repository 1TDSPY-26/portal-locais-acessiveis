import {Link} from 'react-router-dom'

type LinkDeAcao = {
  rotulo: string
  para: string
}

type BotaoDeAcao = {
  rotulo: string
  onClick: () => void
}

type EmptyStateProps = {
  message?: string
  titulo?: string
  descricao?: string
  link?: LinkDeAcao
  botao?: BotaoDeAcao
}

const classeAcao =
  'mt-4 inline-flex min-h-11 items-center rounded-md bg-blue-700 px-4 font-medium text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700'

export function EmptyState({ message, titulo, descricao, link, botao }: EmptyStateProps) {
  const textoPrincipal = titulo ?? message ?? 'Nenhum item encontrado.'

  return (
    <div role="status" className="mt-6 rounded-md border border-dashed border-gray-300 p-8 text-center">
      <p aria-hidden="true" className="text-4xl">🔎</p>
      <p className="mt-2 text-lg font-semibold text-gray-900">{textoPrincipal}</p>
      {descricao && <p className="mt-1 text-gray-700">{descricao}</p>}

      {link && (
        <Link to={link.para} className={classeAcao}>
          {link.rotulo}
        </Link>
      )}

      {botao && (
        <button type="button" onClick={botao.onClick} className={classeAcao}>
          {botao.rotulo}
        </button>
      )}
    </div>
  )
}
