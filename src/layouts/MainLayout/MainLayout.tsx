import { Outlet } from "react-router";
import Cabecalho from "../../components/Cabecalho/Cabecalho";
import Rodape from "../../components/Rodape/Rodape";

export default function MainLayout() {
  return (
    <div>
      <Cabecalho />
      <Outlet />
      <Rodape />
    </div>
  );
}
