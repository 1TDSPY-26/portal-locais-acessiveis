import { Route, Routes } from "react-router-dom";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<h1>Home</h1>} />
      <Route path="/locais" element={<h1>Locais</h1>} />
      <Route path="/locais/:id" element={<h1>Detalhe do Local</h1>} />
      <Route path="/cadastrar" element={<h1>Cadastro</h1>} />
      <Route path="/sobre" element={<h1>Sobre</h1>} />
    </Routes>
  );
}

export default AppRoutes;