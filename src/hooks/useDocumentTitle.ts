import { useEffect } from 'react'

const SITE_NAME = 'Portal de Locais e Serviços Acessíveis'

export function useDocumentTitle(pageTitle?: string) {
  useEffect(() => {
    const previousTitle = document.title

    document.title = pageTitle ? `${pageTitle} — ${SITE_NAME}` : SITE_NAME

    return () => {
      document.title = previousTitle
    }
  }, [pageTitle])
}
