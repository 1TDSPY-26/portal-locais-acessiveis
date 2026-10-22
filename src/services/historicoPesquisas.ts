export const CHAVE_HISTORICO = 'portal-acessivel:historico-pesquisas'

export function lerHistorico(): string[] {

  try {
    const itemDoHistorico = localStorage.getItem(CHAVE_HISTORICO);
    if (!itemDoHistorico) return [];

    const historicoConvertidoEmJSON = JSON.parse(itemDoHistorico);
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