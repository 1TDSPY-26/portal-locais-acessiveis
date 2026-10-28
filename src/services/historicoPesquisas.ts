export const CHAVE_HISTORICO = 'portal-acessivel:historico-pesquisas'

export function lerHistorico(): string[] {

  try {
    const itemDoHistorico = localStorage.getItem(CHAVE_HISTORICO);
    if (!itemDoHistorico) return [];

    const historicoConvertidoEmJSON = JSON.parse(itemDoHistorico);
    if (!Array.isArray(historicoConvertidoEmJSON)) return [];

    const apenasTextos = historicoConvertidoEmJSON.filter((item): item is string => typeof item === 'string');
    // Se o filtro tirou algum item, a lista salva não era só de textos.
    if (apenasTextos.length !== historicoConvertidoEmJSON.length) return [];

    // A lista salva começa pela pesquisa mais recente. Percorrendo do fim para o
    // começo, a mais recente é a última a entrar e fica no início.
    let listaNormalizada: string[] = [];
    for (let i = apenasTextos.length - 1; i >= 0; i--) {
      listaNormalizada = adicionarPesquisa(listaNormalizada, apenasTextos[i]);
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

  const textoFormatado = texto.trim();
  if (!textoFormatado) return pesquisas;

  const textoEmMinusculo = textoFormatado.toLocaleLowerCase('pt-BR');

  const historicoSemDuplicadas = pesquisas.filter(
    (item) => item.trim().toLocaleLowerCase('pt-BR') !== textoEmMinusculo
  );
  return [textoFormatado, ...historicoSemDuplicadas].slice(0, 5);
}

export function salvarHistorico(pesquisas: string[]): boolean {

  try {
    localStorage.setItem(CHAVE_HISTORICO, JSON.stringify(pesquisas));
    return true;
  } catch {
    return false;
  }
}
// removeItem apaga só a chave do histórico; clear() apagaria tudo do site.
export function limparHistorico(): boolean {
  try {
    localStorage.removeItem(CHAVE_HISTORICO)
    return true
  } catch {
    return false
  }
}