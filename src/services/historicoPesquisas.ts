export const CHAVE_HISTORICO = 'portal-acessivel:historico-pesquisas'

export function lerHistorico(): string[] {

  try {
    const itemDoHistorico = localStorage.getItem(CHAVE_HISTORICO);
    if (!itemDoHistorico) return [];

    const historicoConvertidoEmJSON = JSON.parse(itemDoHistorico)
    if (!Array.isArray(historicoConvertidoEmJSON)) return [];

    const apenasTextos = historicoConvertidoEmJSON.filter((item): item is string => typeof item === 'string');

    let listaNormalizada: string[] = [];
    for (const texto of apenasTextos) {
        listaNormalizada = adicionarPesquisa(listaNormalizada, texto);
    }

    return listaNormalizada.slice(0, 5);
  } catch (error) {
    if (error instanceof SyntaxError) {
        return [];
  }
  throw error;
 }
}

export function adicionarPesquisa(pesquisas: string[], texto: string): string[] {
  // TODO: aparar espaços; texto vazio devolve a lista sem mudança.
  // TODO: tirar a repetição sem diferenciar maiúsculas (pt-BR).
  // TODO: pôr o texto no início e limitar a cinco. Não gravar nada aqui.
}

export function salvarHistorico(pesquisas: string[]): boolean {
  // TODO: gravar com JSON.stringify; true se gravou, false se falhou.
}