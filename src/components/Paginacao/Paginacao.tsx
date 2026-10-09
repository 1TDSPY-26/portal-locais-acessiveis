import React from 'react'

type PaginacaoProps = {
  paginaAtual: number
  totalPaginas: number
  onMudarPagina: (pagina: number) => void
}

export default function Paginacao({ paginaAtual, totalPaginas, onMudarPagina }: PaginacaoProps) {
  if (totalPaginas <= 1) {
    return null
  }

  const paginas = Array.from({ length: totalPaginas }, (_, index) => index + 1)

  return (
    <nav aria-label="Paginação" className="my-4">
      <ul className="flex flex-wrap items-center justify-center gap-2 list-none p-0">
        <li>
          <button
            type="button"
            disabled={paginaAtual === 1}
            onClick={() => onMudarPagina(paginaAtual - 1)}
            className="min-h-[44px] min-w-[44px] px-3 py-2 rounded border disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Anterior
          </button>
        </li>

        {paginas.map((numPagina) => {
          const isAtual = numPagina === paginaAtual
          return (
            <li key={numPagina}>
              <button
                type="button"
                onClick={() => onMudarPagina(numPagina)}
                aria-label={`Página ${numPagina}`}
                aria-current={isAtual ? 'page' : undefined}
                className={`min-h-[44px] min-w-[44px] px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isAtual ? 'bg-blue-600 text-white font-bold' : 'bg-white text-gray-800'
                }`}
              >
                {numPagina}
              </button>
            </li>
          )
        })}

        <li>
          <button
            type="button"
            disabled={paginaAtual === totalPaginas}
            onClick={() => onMudarPagina(paginaAtual + 1)}
            className="min-h-[44px] min-w-[44px] px-3 py-2 rounded border disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Próxima
          </button>
        </li>
      </ul>
    </nav>
  )
}