interface Local {
    id: number;
    nome: string;
    categoria: string;
    resumo: string;
}

interface LocalCard {
    local: Local;
}

function LocalCard({local}: LocalCard) {
    return (
        <div>
            <h2>{local.nome}</h2>
            <p>{local.categoria}</p>
            <p>{local.resumo}</p>
            <a href={`/locais/${local.id}`}>ver detalhes</a>
        </div>
    );
}

export default LocalCard;