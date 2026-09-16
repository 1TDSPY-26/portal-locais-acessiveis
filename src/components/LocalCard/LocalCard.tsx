import type { Local } from "../../types/Local";
import { Link } from "react-router-dom";

type LocalCardProps = {
    local: Local;
}

function LocalCard({ local }: LocalCardProps) {
    return (
        <div>
            <h2>{local.nome}</h2>
            <p>{local.categoria}</p>
            <p>{local.descricao}</p>
            <Link to={`/locais/${local.id}`} aria-label={`Ver detalhes de ${local.nome}`}>
                ver detalhes
            </Link>
        </div>
    );
}

export default LocalCard;