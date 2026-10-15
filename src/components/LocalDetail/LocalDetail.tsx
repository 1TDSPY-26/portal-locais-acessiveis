import type { Local } from "../../types/Local";
import { EmptyState } from "../EmptyState/EmptyState";

type Props = {
  local: Local;
};

export default function LocalDetail({ local }: Props) {
  const semRecursos = local.tiposAcessibilidade.length === 0;

  return (
    <section className="local-detalhe">
      <h2>{local.nome}</h2>

      <p><strong>Endereço:</strong> {local.endereco}</p>
      <p><strong>Categoria:</strong> {local.categoria}</p>
      <p><strong>Descrição:</strong> {local.descricao}</p>

      <div>
        <strong>Acessibilidade:</strong>
        {semRecursos ? (
          <EmptyState
            titulo="Nenhum recurso de acessibilidade informado."
            link={{
              rotulo: "Adicionar recursos",
              para: `/locais/editar/${local.id}`,
            }}
          />
        ) : (
          <ul>
            {local.tiposAcessibilidade.map((tipo) => (
              <li key={tipo}>{tipo}</li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}