import { Link } from 'react-router-dom'
import MenuMobile from './MenuMobile'
import NavigationLinks from './NavigationLinks'

export default function Cabecalho() {
  return (
    <header className="bg-black">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Link 
          to="/" 
          className="text-xl font-bold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Portal Acessível
        </Link>

        <nav aria-label="Navegação principal" className="hidden sm:block">
          <NavigationLinks />
        </nav>

        <MenuMobile />
      </div>
    </header>
  )
}