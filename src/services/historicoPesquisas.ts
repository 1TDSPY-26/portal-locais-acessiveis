export const CHAVE_HISTORICO = 'portal-acessivel:historico-pesquisas'

export function lerHistorico(): string[] {
  // TODO: ler a chave e converter com JSON.parse; conteúdo inválido devolve [].
  // TODO: aceitar só lista de textos; normalizar pelas regras de adicionarPesquisa e limitar a cinco.
  // Erro de acesso ao storage pode ser lançado: o hook trata.
}

export function adicionarPesquisa(pesquisas: string[], texto: string): string[] {
  // TODO: aparar espaços; texto vazio devolve a lista sem mudança.
  // TODO: tirar a repetição sem diferenciar maiúsculas (pt-BR).
  // TODO: pôr o texto no início e limitar a cinco. Não gravar nada aqui.
}

export function salvarHistorico(pesquisas: string[]): boolean {
  // TODO: gravar com JSON.stringify; true se gravou, false se falhou.
}