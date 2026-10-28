
import { useEffect } from 'react'

export const NOME_DO_SITE = 'Portal Acessível'

export function useTituloDocumento(titulo: string) {
  useEffect(() => {
    // Guarda o título que estava definido antes da página.
    const tituloAnterior = document.title

    // Se o título estiver vazio, usa somente o nome do site.
    document.title = titulo
      ? `${titulo} | ${NOME_DO_SITE}`
      : NOME_DO_SITE

    // Restaura o título anterior quando o componente sair.
    return () => {
      document.title = tituloAnterior
    }
  }, [titulo])
}
