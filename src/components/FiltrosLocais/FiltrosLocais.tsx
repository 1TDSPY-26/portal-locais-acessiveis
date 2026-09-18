type FiltrosLocaisProps = {
  categorias: string[]
  recursosDisponiveis: string[]
  categoria: string
  recursos: string[]
  /** A busca entra na contagem porque o botão também a limpa. */
  buscaAtiva: boolean
  onCategoriaChange: (categoria: string) => void
  onRecursosChange: (recursos: string[]) => void
  onLimpar: () => void
}

export default function FiltrosLocais({
  categorias,
  recursosDisponiveis,
  categoria,
  recursos,
  buscaAtiva,
  onCategoriaChange,
  onRecursosChange,
  onLimpar,
}: FiltrosLocaisProps) {
  const filtrosAtivos =
    recursos.length + (categoria ? 1 : 0) + (buscaAtiva ? 1 : 0)

  function alternarRecurso(recurso: string) {
    if (recursos.includes(recurso)) {
      onRecursosChange(recursos.filter((item) => item !== recurso))
      return
    }

    onRecursosChange([...recursos, recurso])
  }

  return (
    <div className="rounded-md border border-gray-200 p-4">
      <div>
        <label
          htmlFor="filtro-categoria"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Categoria
        </label>

        <select
          id="filtro-categoria"
          value={categoria}
          onChange={(evento) => onCategoriaChange(evento.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-700 sm:w-72"
        >
          <option value="">Todas as categorias</option>

          {categorias.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <fieldset className="mt-4">
        <legend className="mb-2 text-sm font-medium text-gray-700">
          Recursos de acessibilidade
        </legend>

        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {recursosDisponiveis.map((recurso) => (
            <label key={recurso} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={recursos.includes(recurso)}
                onChange={() => alternarRecurso(recurso)}
                className="h-5 w-5 shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
              />
              {recurso}
            </label>
          ))}
        </div>
      </fieldset>

      {filtrosAtivos > 0 && (
        <button
          type="button"
          onClick={onLimpar}
          className="mt-4 inline-flex min-h-11 items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
        >
          Limpar filtros e busca ({filtrosAtivos})
        </button>
      )}
    </div>
  )
}
