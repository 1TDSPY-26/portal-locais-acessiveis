import Cabecalho from "../components/Header/Header";
import Rodape from "../components/Footer/Footer";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div>
      <Cabecalho />
      <main>
        <Outlet />
      </main>
      <Rodape />
    </div>
  );
}
