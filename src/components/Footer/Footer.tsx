import { Link } from 'react-router-dom'

export default function Rodape() {
  return (
    <footer className="border-t border-gray-200 px-4 py-6">
      <nav aria-label="Links institucionais" className="mx-auto max-w-6xl">
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          <li>
            <Link to="/sobre" className="rounded text-blue-700 underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700">
              Sobre o portal
            </Link>
          </li>
          <li>
            <Link to="/acessibilidade" className="rounded text-blue-700 underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700">
              Acessibilidade
            </Link>
          </li>
        </ul>
      </nav>
    </footer>
  )
}
