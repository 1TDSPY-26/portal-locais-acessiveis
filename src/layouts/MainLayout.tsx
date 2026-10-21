import Cabecalho from "../components/Header/Header";
import Rodape from "../components/Footer/Footer";
import { Outlet } from "react-router-dom";
import SkipLink from "../components/SkipLink/SkipLink";

export default function MainLayout() {
  return (
    <div>
      <SkipLink />
      <Cabecalho />
      <main id="conteudo-principal" tabIndex={-1}>
        <Outlet />
      </main>
      <Rodape />
    </div>
  );
}
