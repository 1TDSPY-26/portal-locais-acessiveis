import { NavLink } from "react-router-dom";

export default function Cabecalho() {
  return (
    <header className="bg-black text-white">
      <h1>Cabecalho</h1>
      <nav>
        <ul>
          <li>
            <NavLink to="/" end className={({ isActive }) => (isActive ? "ativo" : "")}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/locais" className={({ isActive }) => (isActive ? "ativo" : "")}>
              Locais
            </NavLink>
          </li>
          <li>
            <NavLink to="/cadastro" className={({ isActive }) => (isActive ? "ativo" : "")}>
              Cadastro
            </NavLink>
          </li>
          <li>
            <NavLink to="/sobre" className={({ isActive }) => (isActive ? "ativo" : "")}>
              Sobre
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}