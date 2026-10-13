import axe from 'axe-core'

const REGRAS_DESATIVADAS = {
  // o jsdom não calcula as cores da tela; o contraste é conferido pelo QA
  'color-contrast': { enabled: false },
}

export async function auditarAcessibilidade(container: Element): Promise<void> {
  const resultado = await axe.run(container, { rules: REGRAS_DESATIVADAS })

  if (resultado.violations.length === 0) return

  const relatorio = resultado.violations
    .map((violacao) => {
      const elementos = violacao.nodes
        .map((no) => `      → ${no.target.join(' ')}`)
        .join('\n')

      return [
        `• [${violacao.impact ?? 'sem impacto'}] ${violacao.id}: ${violacao.help}`,
        `    Ajuda: ${violacao.helpUrl}`,
        elementos,
      ].join('\n')
    })
    .join('\n\n')

  throw new Error(
    `Foram encontradas ${resultado.violations.length} violações de acessibilidade:\n\n${relatorio}`,
  )
}