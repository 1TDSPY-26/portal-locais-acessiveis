type PaginationProps = {
    paginaAtual: number
    temProximaPagina: boolean
    onPaginaAnterior: () => void
    onProximaPagina: () => void
}

export default function Pagination({
    paginaAtual,
    temProximaPagina,
    onPaginaAnterior,
    onProximaPagina,
}: PaginationProps) {
    return (
        <nav
            aria-label="Paginação da lista de locais"
            className="mt-8 flex items-center justify-center gap-4"
        >
            <button
                type="button"
                onClick={onPaginaAnterior}
                disabled={paginaAtual === 1}
                className="rounded border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
                Anterior
            </button>

            <span aria-current="page">
                Página {paginaAtual}
            </span>

            <button
                type="button"
                onClick={onProximaPagina}
                disabled={!temProximaPagina}
                className="rounded border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
                Próxima
            </button>
        </nav>
    )
}