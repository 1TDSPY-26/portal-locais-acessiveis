import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import ErrorMessage from '../../components/Error/ErrorMessage'
import LocalDetail from '../../components/LocalDetail/LocalDetail'
import { Loading } from '../../components/Loading/Loading'
import { obterLocalPorId } from '../../services/locais'
import type { Local } from '../../types/Local'

export default function LocalDetalhe() {
  const { id } = useParams<{ id: string }>()
  const [local, setLocal] = useState<Local | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [retryKey, setRetryKey] = useState(0)

  useEffect(() => {
    let active = true

    async function carregar() {
      const idNumerico = Number(id)

      if (!id || !Number.isInteger(idNumerico)) {
        setErrorMessage('Local não encontrado.')
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setErrorMessage('')

      try {
        const { data, error } = await obterLocalPorId(idNumerico)
        if (!active) return

        if (error) setErrorMessage(error.message)
        else if (!data) setErrorMessage('Local não encontrado.')
        else setLocal(data)
      } catch {
        if (active) setErrorMessage('Erro inesperado ao carregar o local.')
      } finally {
        if (active) setIsLoading(false)
      }
    }

    carregar()
    return () => {
      active = false
    }
  }, [id, retryKey])

  return (
    <div className="mx-auto max-w-3xl p-4">
      <Link
        to="/locais"
        className="inline-flex min-h-11 items-center text-sm font-medium text-blue-700 underline"
      >
        Voltar para a lista
      </Link>

      {isLoading && <Loading message="Carregando local..." />}

      {!isLoading && errorMessage && (
        <ErrorMessage message={errorMessage} onRetry={() => setRetryKey((k) => k + 1)} />
      )}

      {!isLoading && !errorMessage && local && <LocalDetail local={local} />}
    </div>
  )
}