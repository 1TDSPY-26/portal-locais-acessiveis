import Cabecalho from "../../components/Cabecalho/Cabecalho";
import Rodape from "../../components/Rodape/Rodape";

type MainLayoutProps = {
  children: React.ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div>
      <Cabecalho />
      <main>
        {children}
      </main>
      <Rodape />
    </div>
  );
}
