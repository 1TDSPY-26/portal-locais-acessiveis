import { Component, type ReactNode } from "react";
import ErrorMessage from "./ErrorMessage";

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