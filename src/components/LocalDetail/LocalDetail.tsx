import type { Local } from "../../types/Local";

type Props = {
  local: Local;
};

export default function LocalDetail({ local }: Props) {
  return (
    <section className="local-detalhe">
      <h2>{local.nome}</h2>

      <p><strong>Endereço:</strong> {local.endereco}</p>
      <p><strong>Categoria:</strong> {local.categoria}</p>
      <p><strong>Descrição:</strong> {local.descricao}</p>

      <div>
        <strong>Acessibilidade:</strong>
        {local.tiposAcessibilidade.length > 0 ? (
          <ul>
            {local.tiposAcessibilidade.map((tipo) => (
              <li key={tipo}>{tipo}</li>
            ))}
          </ul>
        ) : (
          <p>Nenhuma informação de acessibilidade cadastrada.</p>
        )}
      </div>
      <div style={{ height: "1.5em" }}></div>
    </section>
  );
}