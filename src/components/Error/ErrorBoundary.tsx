
import { Component, type ReactNode } from "react";
import ErrorMessage from "./ErrorMessage";
import { useTituloDocumento } from "../../hooks/useTituloDocumento";

export const TITULO_ERRO_INESPERADO = "Erro inesperado";

// Classe não pode chamar hook; por isso o título
// do aviso fica num componente de função.
function TituloDeErro() {
  useTituloDocumento(TITULO_ERRO_INESPERADO);
  return null;
}

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public render() {
    if (this.state.hasError) {
      return (
        <main className="p-8 text-center">
          <TituloDeErro />
          <ErrorMessage
            message="Ocorreu um erro inesperado ao carregar a página."
            onRetry={() => window.location.reload()}
          />
        </main>
      );
    }

    return this.props.children;
  }
}
