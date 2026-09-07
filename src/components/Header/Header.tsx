import { Link } from "react-router-dom";

export default function Cabecalho() {
  return (
    <header className="bg-black text-white">
      <h1>Cabecalho</h1>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/locais">Locais</Link></li>
          <li><Link to="/cadastro">Cadastro</Link></li>
          <li><Link to="/sobre">Sobre</Link></li>
        </ul>
      </nav>
    </header>
  );
}