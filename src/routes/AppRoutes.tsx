import { Route, Routes } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import ErrorBoundary from "../components/Error/ErrorBoundary";

function Bug() {
  return (null as any).texto;
}
export default function AppRoutes() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route element={<MainLayout />}>
        <Route path="/" element={<Bug />} />
          <Route path="/locais" element={<h1>Locais</h1>} />
          <Route path="/locais/:id" element={<h1>Detalhe do Local</h1>} />
          <Route path="/cadastrar" element={<h1>Cadastrar</h1>} />
          <Route path="/sobre" element={<h1>Sobre</h1>} />
        </Route>
      </Routes>
    </ErrorBoundary>
  );
}