
import axe from 'axe-core'

const REGRAS_DESATIVADAS = {
  // O jsdom não calcula as cores da tela.
  // O contraste será verificado separadamente pelo QA.
  'color-contrast': { enabled: false },
}

export async function auditarAcessibilidade(
  container: Element,
): Promise<void> {
  const resultado = await axe.run(container, {
    rules: REGRAS_DESATIVADAS,
  })

  if (resultado.violations.length === 0) {
    return
  }

  const relatorio = resultado.violations
    .map((violacao) => {
      const elementos = violacao.nodes
        .map((node) =>
          node.target.map((alvo) => `  → ${alvo}`).join('\n'),
        )
        .join('\n')

      return [
        `[${violacao.impact ?? 'impacto não informado'}] ${violacao.id}`,
        `Problema: ${violacao.help}`,
        `Mais informações: ${violacao.helpUrl}`,
        `Elementos afetados:\n${elementos}`,
      ].join('\n')
    })
    .join('\n\n')

  const quantidade = resultado.violations.length
  const descricao =
    quantidade === 1
      ? 'violação encontrada'
      : 'violações encontradas'

  throw new Error(
    `Auditoria de acessibilidade: ${quantidade} ${descricao}.\n\n${relatorio}`,
  )
}
