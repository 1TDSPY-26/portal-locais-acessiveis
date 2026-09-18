import { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/locais', label: 'Locais' },
  { to: '/cadastro', label: 'Cadastro' },
  { to: '/sobre', label: 'Sobre' },
]

function NavigationLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <ul className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-6">
      {links.map(({ to, label, end }) => (
        <li key={to}>
          <NavLink
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `inline-flex min-h-11 items-center border-b-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                isActive
                  ? 'border-white text-white'
                  : 'border-transparent text-gray-300 hover:border-gray-500 hover:text-white'
              }`
            }
          >
            {label}
          </NavLink>
        </li>
      ))}
    </ul>
  )
}

export default function Cabecalho() {
  const [menuAberto, setMenuAberto] = useState(false)
  const botaoRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!menuAberto) return
    const fecharComEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuAberto(false)
        botaoRef.current?.focus()
      }
    }
    document.addEventListener('keydown', fecharComEscape)
    return () => document.removeEventListener('keydown', fecharComEscape)
  }, [menuAberto])

  return (
    <header className="bg-black">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <p className="text-xl font-bold text-white">Portal Acessível</p>
        <nav aria-label="Navegação principal" className="hidden sm:block">
          <NavigationLinks />
        </nav>
        <button
          ref={botaoRef}
          type="button"
          aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuAberto}
          aria-controls="menu-mobile"
          onClick={() => setMenuAberto((aberto) => !aberto)}
          className="min-h-11 rounded border border-white px-3 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:hidden"
        >
          {menuAberto ? 'Fechar' : 'Menu'}
        </button>
        <nav
          id="menu-mobile"
          aria-label="Navegação principal móvel"
          className={`w-full sm:hidden ${menuAberto ? 'block' : 'hidden'}`}
        >
          <NavigationLinks onNavigate={() => setMenuAberto(false)} />
        </nav>
      </div>
    </header>
  )
}
