import { NavLink } from "react-router-dom";

export default function Cabecalho() {
  return (
    <header className="bg-black">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <h1 className="text-white text-xl font-bold">Cabecalho</h1>

        <nav aria-label="Navegação principal">
          <ul className="flex gap-6">
            <li>
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `pb-1 text-sm font-medium border-b-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                    isActive
                      ? "text-white border-white"
                      : "text-gray-400 border-transparent hover:text-white hover:border-gray-500"
                  }`
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/locais"
                className={({ isActive }) =>
                  `pb-1 text-sm font-medium border-b-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                    isActive
                      ? "text-white border-white"
                      : "text-gray-400 border-transparent hover:text-white hover:border-gray-500"
                  }`
                }
              >
                Locais
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/cadastro"
                className={({ isActive }) =>
                  `pb-1 text-sm font-medium border-b-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                    isActive
                      ? "text-white border-white"
                      : "text-gray-400 border-transparent hover:text-white hover:border-gray-500"
                  }`
                }
              >
                Cadastro
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/sobre"
                className={({ isActive }) =>
                  `pb-1 text-sm font-medium border-b-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                    isActive
                      ? "text-white border-white"
                      : "text-gray-400 border-transparent hover:text-white hover:border-gray-500"
                  }`
                }
              >
                Sobre
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}