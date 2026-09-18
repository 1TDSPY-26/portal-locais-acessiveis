import AppRoutes from "./routes/AppRoutes";
import LocalDetail from "./components/LocalDetail/LocalDetail";
import { localMockCompleto, localMockSemAcessibilidade } from "./mocks-teste/localDetail-mock";


function App() {
  return (
    <>
      <LocalDetail local={localMockCompleto} />
      <LocalDetail local={localMockSemAcessibilidade} />
    </>
  );
}

export default App;