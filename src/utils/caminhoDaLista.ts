export const CAMINHO_DA_LISTA = '/locais'

export type EstadoOrigem = {
    origem: string
}

export function criarEstadoOrigem(pathname: string, search: string): EstadoOrigem {
    return { origem: `${pathname}${search}` }
}

export function montarCaminhoDaLista(estado: unknown): string {
    if (typeof estado !== 'object' || estado === null) return CAMINHO_DA_LISTA
    if (!('origem' in estado)) return CAMINHO_DA_LISTA

    const { origem } = estado
    if (typeof origem !== 'string') return CAMINHO_DA_LISTA

    // Só volta para a listagem: /locais/editar/1, /sobre ou //outro-site caem em /locais.
    if (origem === CAMINHO_DA_LISTA || origem.startsWith(`${CAMINHO_DA_LISTA}?`)) return origem

    return CAMINHO_DA_LISTA
}