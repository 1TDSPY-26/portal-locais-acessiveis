import Cabecalho from "../components/Header/Header";
import Rodape from "../components/Footer/Footer";

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
