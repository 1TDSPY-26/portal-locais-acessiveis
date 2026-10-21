import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/locais', label: 'Locais' },
  { to: '/cadastro', label: 'Cadastro' },
  { to: '/sobre', label: 'Sobre' },
]

interface NavigationLinksProps {
  onNavigate?: () => void
}

export default function NavigationLinks({ onNavigate }: NavigationLinksProps) {
  return (
    <ul className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-6">
      {links.map(({ to, label, end }) => (
        <li key={to}>
          <NavLink
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `inline-flex min-h-[44px] items-center border-b-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
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