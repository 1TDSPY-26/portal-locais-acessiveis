import { Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import EditLocation from "../pages/EditLocation/EditLocation";
import NotFound from "../pages/NotFound/NotFound";
import ErrorBoundary from "../components/Error/ErrorBoundary";
import Home from "../pages/Home/Home";
import PaginaLocais from "../pages/Locations/PaginaLocais";
// import Locais from "../pages/Locais/Locais";
import Sobre from "../pages/Sobre/Sobre";
import Acessibilidade from "../pages/Acessibilidade/Acessibilidade";

export default function AppRoutes() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/locais" element={<PaginaLocais />} />

          <Route path="/locais/editar/:id" element={<EditLocation />} />

          <Route path="/locais/:id" element={<h1>Detalhe do Local</h1>} />

          <Route path="/cadastro" element={<h1>Cadastro</h1>} />
          <Route path="/cadastrar" element={<Navigate to="/cadastro" replace />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/acessibilidade" element={<Acessibilidade />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  );
}
