import { useEffect, useState } from 'react'
import {
  ehCacheRecente,
  lerCache,
  salvarCache,
} from '../services/cacheLocais'
import { listarLocais } from '../services/locais'
import type { Local } from '../types/Local'

export function useLocais() {
  const cacheInicial = lerCache()

  const [locais, setLocais] = useState<Local[]>(
    cacheInicial?.dados ?? [],
  )

  const [isLoading, setIsLoading] = useState(
    !cacheInicial,
  )

  const [revalidando, setRevalidando] =
    useState(false)

  const [errorMessage, setErrorMessage] =
    useState('')

  const [atualizadoEm, setAtualizadoEm] =
    useState<Date | null>(
      cacheInicial
        ? new Date(cacheInicial.salvoEm)
        : null,
    )

  async function buscarLocais() {
    setErrorMessage('')

    try {
      const { data, error } = await listarLocais()

      if (error) {
        setErrorMessage(error.message)
        return
      }

      const dados = data ?? []

      salvarCache(dados)

      const cacheAtualizado = lerCache()

      //feito pelo integrante @brunohpdev pelo live share

      setLocais(dados)

      setAtualizadoEm(
        cacheAtualizado
          ? new Date(cacheAtualizado.salvoEm)
          : new Date(),
      )
    } catch {
      setErrorMessage(
        'Erro inesperado ao carregar os locais.',
      )
    } finally {
      setIsLoading(false)
      setRevalidando(false)
    }
  }

  function recarregar() {
    if (locais.length > 0) {
      setRevalidando(true)
    } else {
      setIsLoading(true)
    }

    void buscarLocais()
  }

  useEffect(() => {
    const cacheAtual = lerCache()

    // CACHE RECENTE:
    // mostra os dados existentes e não busca novamente.
    if (
      cacheAtual &&
      ehCacheRecente(cacheAtual)
    ) {
      setIsLoading(false)
      return
    }

    // CACHE ANTIGO:
    // mantém os cards e atualiza por trás.
    if (cacheAtual) {
      setRevalidando(true)
      void buscarLocais()
      return
    }

    // SEM CACHE:
    // carregamento normal.
    setIsLoading(true)
    void buscarLocais()
  }, [])

  return {
    locais,
    isLoading,
    revalidando,
    errorMessage,
    atualizadoEm,
    recarregar,
  }
}