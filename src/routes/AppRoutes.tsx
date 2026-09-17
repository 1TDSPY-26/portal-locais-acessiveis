import { Route, Routes } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import EditLocation from "../pages/EditLocation/EditLocation";
import NotFound from "../pages/NotFound/NotFound";
import ErrorBoundary from "../components/Error/ErrorBoundary";
import Home from "../pages/Home/Home";
import Cadastro from "../pages/Cadastro/Cadastro";
import Locais from "../pages/Locais/Locais";
import Sobre from "../pages/Sobre/Sobre";

export default function AppRoutes() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<h1><Home /></h1>} />
          <Route path="/locais" element={<Locais />} />

          <Route path="/locais/editar/:id" element={<EditLocation />} />

          <Route path="/locais/:id" element={<h1>Detalhe do Local</h1>} />

          <Route path="/cadastrar" element={<Cadastro />} />
          
          <Route path="/sobre" element={<Sobre />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  );
}
