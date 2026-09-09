import type { Local } from "../../types/Local";

type LocalCardProps = {
    local: Local
    onExcluir: () => void
}

function LocalCard({ local, onExcluir }: LocalCardProps) {
    return (
        <div>
            <h2>{local.nome}</h2>
            <p>{local.categoria}</p>
            <p>{local.descricao}</p>
            <a href={`/locais/${local.id}`}>ver detalhes</a>
            <button type="button" onClick={onExcluir}>
                Excluir
            </button>
        </div>
    );
}
export default LocalCard;