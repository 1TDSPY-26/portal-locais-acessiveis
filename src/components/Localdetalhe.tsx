import type { Local } from "../types/Local";

type Props = {
  local: Local;
};

export default function LocalDetalhe({ local }: Props) {
  return (
    <section className="local-detalhe">
      <h2>{local.nome}</h2>

      <p><strong>Endereço:</strong> {local.endereco}</p>

      <p><strong>Categoria:</strong> {local.categoria}</p>

      <p><strong>Descrição:</strong> {local.descricao}</p>

      <div>
        <strong>Acessibilidade:</strong>
        <ul>
          {local.tiposAcessibilidade.map((tipo) => (
            <li key={tipo}>{tipo}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}