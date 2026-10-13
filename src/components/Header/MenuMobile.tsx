import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import NavigationLinks from './NavigationLinks'

const LARGURA_DESKTOP = '(min-width: 640px)'

export default function MenuMobile() {
  const { pathname } = useLocation()
  const [aberto, setAberto] = useState(false)
  const [rotaAtual, setRotaAtual] = useState(pathname)
  const botaoRef = useRef<HTMLButtonElement>(null)
  const areaRef = useRef<HTMLDivElement>(null)

  if (pathname !== rotaAtual) {
    setRotaAtual(pathname)
    setAberto(false)
  }

  function fechar() {
    setAberto(false)
  }

  function fecharEVoltarFoco() {
    setAberto(false)
    botaoRef.current?.focus()
  }

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mediaQuery = window.matchMedia(LARGURA_DESKTOP)
    
    function lidarComMudanca(e: MediaQueryListEvent | MediaQueryList) {
      if (e.matches) fechar()
    }
    
    lidarComMudanca(mediaQuery)
    mediaQuery.addEventListener('change', lidarComMudanca)
    
    return () => mediaQuery.removeEventListener('change', lidarComMudanca)
  }, [])

  useEffect(() => {
    if (!aberto) return

    function lidarComTeclado(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        fecharEVoltarFoco()
      }
    }

    function lidarComCliqueFora(event: MouseEvent) {
      if (areaRef.current && !areaRef.current.contains(event.target as Node)) {
        fechar()
      }
    }

    document.addEventListener('keydown', lidarComTeclado)
    document.addEventListener('mousedown', lidarComCliqueFora)

    return () => {
      document.removeEventListener('keydown', lidarComTeclado)
      document.removeEventListener('mousedown', lidarComCliqueFora)
    }
  }, [aberto])

  return (
    <div ref={areaRef} className="w-full sm:hidden">
      <button
        ref={botaoRef}
        type="button"
        aria-expanded={aberto}
        aria-controls="menu-mobile"
        onClick={() => setAberto(!aberto)}
        className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded border border-white px-3 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <svg aria-hidden="true" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {aberto ? (
            <>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </>
          ) : (
            <>
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </>
          )}
        </svg>
        {aberto ? 'Fechar menu' : 'Menu'}
      </button>

      {aberto && (
        <nav
          id="menu-mobile"
          aria-label="Navegação principal móvel"
          className="mt-4 pb-4"
        >
          <NavigationLinks onNavigate={fechar} />
        </nav>
      )}
    </div>
  )
}