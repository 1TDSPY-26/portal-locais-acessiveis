import { useEffect, useMemo, useState } from 'react'
import type { Local } from '../../types/Local'
import { listarLocais } from '../../services/locais'


function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

export default function PaginaLocais() {
  const [locais, setLocais] = useState<Local[]>([])
  const [termo, setTermo] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  
  useEffect(() => {
    let ativo = true

    listarLocais()
      .then((resultado) => {
        console.log('RESPOSTA DA API:', resultado)
        if (ativo) setLocais(resultado.data ?? [])
      })
      .catch(() => {
        if (ativo) setErro('Não foi possível carregar os locais.')
      })
      .finally(() => {
        if (ativo) setCarregando(false)
      })

    return () => {
      ativo = false
    }
  }, [])

 
  const locaisFiltrados = useMemo(() => {
    const busca = normalizar(termo.trim())
    if (!busca) return locais
    return locais.filter(
      (l) =>
        normalizar(l.nome).includes(busca) ||
        normalizar(l.endereco).includes(busca),
    )
  }, [termo, locais])

  const temTermo = termo.trim().length > 0

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Locais</h1>

     
      <div className="mb-4 flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2">
        <input
          id="busca-locais"
          type="text"
          value={termo}
          onChange={(e) => setTermo(e.target.value)}
          placeholder="Buscar por nome ou endereço"
          autoComplete="off"
          aria-label="Buscar locais"
          className="flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
        />
        {temTermo && (
          <button
            type="button"
            onClick={() => setTermo('')}
            aria-label="Limpar busca"
            className="shrink-0 text-sm text-gray-500 hover:text-gray-700"
          >
            Limpar
          </button>
        )}
      </div>

     
      {carregando && <p className="text-sm text-gray-500">Carregando locais…</p>}
      {erro && (
        <p role="alert" className="text-sm text-red-600">
          {erro}
        </p>
      )}

      {!carregando &&
        !erro &&
        (locaisFiltrados.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            <p className="font-semibold text-gray-900">
              Nenhum local encontrado
            </p>
            {temTermo && (
              <p className="mt-1 text-sm">
                Nada corresponde a “{termo.trim()}”. Tente outro nome ou
                endereço.
              </p>
            )}
          </div>
        ) : (
          <ul className="grid gap-2">
            {locaisFiltrados.map((local) => (
              <li
                key={local.id}
                className="flex flex-col rounded-lg border border-gray-200 bg-gray-50 px-4 py-3"
              >
                <span className="text-sm font-semibold text-gray-900">
                  {local.nome}
                </span>
                <span className="mt-0.5 text-xs text-gray-500">
                  {local.endereco}
                </span>
              </li>
            ))}
          </ul>
        ))}
    </main>
  )
}
