import { useRef, type KeyboardEvent } from 'react'

type CampoBuscaProps = {
  valor: string
  onChange: (valor: string) => void
  onPesquisar?: (texto: string) => void
}

export default function CampoBusca({ valor, onChange, onPesquisar }: CampoBuscaProps) {
  const campoRef = useRef<HTMLInputElement>(null)

  // O "x" nativo do input[type=search] não existe no Firefox e não é alcançado
  // pelo teclado: por isso um botão de verdade ao lado do campo.
  function limparBusca() {
    onChange('')
    campoRef.current?.focus()
  }

  function tratarTecla(evento: KeyboardEvent<HTMLInputElement>){
    if (evento.key !== 'Enter') return
    // Sem onPesquisar, o Enter segue o comportamento normal do navegador.
    if (!onPesquisar) return

    // Se o campo estiver dentro de um formulário, o Enter não o envia.
    evento.preventDefault()
    onPesquisar(valor)
  }

  return (
    <div>
      <label
        htmlFor="busca"
        className="mb-1 block text-sm font-medium text-gray-700"
      >
        Buscar por nome
      </label>

      <div className="flex flex-wrap items-center gap-2">
        <input
          id="busca"
          ref={campoRef}
          type="search"
          value={valor}
          placeholder="Ex.: biblioteca"
          onChange={(evento) => onChange(evento.target.value)}
          onKeyDown={tratarTecla}
          className="w-full min-w-0 flex-1 rounded-md border border-gray-300 px-3 py-2 text-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-700 sm:w-auto"
        />
        
        {valor && (
          <button
            type="button"
            onClick={limparBusca}
            className="inline-flex min-h-11 shrink-0 items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          >
            Limpar busca
          </button>
        )}
      </div>
    </div>
  )
}
