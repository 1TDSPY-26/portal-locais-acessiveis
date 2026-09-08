import type { Local } from '../../types/Local'

interface LocalDetailProps {
  local: Local
}

export function LocalDetail({ local }: LocalDetailProps) {
  return (
    <article className="p-6 bg-white rounded-lg shadow-md max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">{local.nome}</h1>
      
      {local.descricao && (
        <p className="text-gray-600 mb-4">{local.descricao}</p>
      )}

      <div className="border-t pt-4 mt-4">
        <h2 className="text-lg font-semibold mb-2 text-gray-700">Detalhes de Acessibilidade</h2>
        <ul className="list-disc list-inside space-y-1 text-gray-600">
          <li>Endereço: {local.endereco || 'Não informado'}</li>
          {local.categoria && <li>Categoria: {local.categoria}</li>}
        </ul>
      </div>
    </article>
  )
}