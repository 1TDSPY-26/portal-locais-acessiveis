import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/locais', label: 'Locais' },
  { to: '/cadastro', label: 'Cadastro' },
  { to: '/sobre', label: 'Sobre' },
]

export default function Cabecalho() {
  return (
    <header className="bg-black">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <p className="text-xl font-bold text-white">Portal Acessível</p>
        <nav aria-label="Navegação principal">
          <ul className="flex flex-wrap gap-x-6 gap-y-3">
            {links.map(({ to, label, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `border-b-2 pb-1 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
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
        </nav>
      </div>
    </header>
  )
}
