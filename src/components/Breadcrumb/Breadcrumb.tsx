import { Link } from 'react-router-dom'

export type ItemBreadcrumb = {
  rotulo: string
  para?: string
}

type BreadcrumbProps = {
  itens: ItemBreadcrumb[]
}

const ROTULO_BREADCRUMB = 'Caminho de navegação'
const SEPARADOR = '›'

export default function Breadcrumb({ itens }: BreadcrumbProps) {
  if (itens.length === 0) return null

  return (
    <nav aria-label={ROTULO_BREADCRUMB} className="mb-6 text-sm">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {itens.map((item, indice) => {
          const ultimoItem = indice === itens.length - 1

          return (
            <li
              key={`${indice}-${item.rotulo}`}
              className="flex min-w-0 items-center gap-x-2 break-words"
            >
              {ultimoItem ? (
                <span aria-current="page" className="break-words">
                  {item.rotulo}
                </span>
              ) : item.para ? (
                <Link
                  to={item.para}
                  className="inline-flex min-h-11 min-w-0 items-center break-words rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                >
                  {item.rotulo}
                </Link>
              ) : (
                <span className="break-words">{item.rotulo}</span>
              )}

              {!ultimoItem && (
                <span aria-hidden="true" className="text-gray-500">
                  {SEPARADOR}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}