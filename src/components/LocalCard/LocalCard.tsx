import type { Local } from "../../types/Local";

type LocalCard = {
    local: Local;
}

function LocalCard({local}: LocalCard) {
    return (
        <div>
            <h2>{local.nome}</h2>
            <p>{local.categoria}</p>
            <p>{local.descricao}</p>
            <a href={`/locais/${local.id}`}>ver detalhes</a>
        </div>
    );
}

export default LocalCard;