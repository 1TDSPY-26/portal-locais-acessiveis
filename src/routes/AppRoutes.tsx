import { Route, Routes } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import EditLocation from "../pages/EditLocation/EditLocation";
import NotFound from "../pages/NotFound/NotFound";
import ErrorBoundary from "../components/Error/ErrorBoundary";
import Home from "../pages/Home/Home";
import PaginaLocais from "../pages/Locations/PaginaLocais";

export default function AppRoutes() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<h1><Home /></h1>} />
          <Route path="/locais" element={<PaginaLocais />} />

          <Route path="/locais/editar/:id" element={<EditLocation />} />

          <Route path="/locais/:id" element={<h1>Detalhe do Local</h1>} />

          <Route path="/cadastrar" element={<h1>Cadastro</h1>} />
          <Route path="/sobre" element={<h1>Sobre</h1>} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  );
}
