import { describe, expect, it } from 'vitest'
import {
  MENSAGEM_RESPOSTA_INVALIDA,
  MENSAGEM_SEM_CONEXAO,
  MENSAGEM_TEMPO_ESGOTADO,
  mensagemPorFalha,
} from './mensagensFalha'

const MENSAGENS = [
  MENSAGEM_SEM_CONEXAO,
  MENSAGEM_TEMPO_ESGOTADO,
  MENSAGEM_RESPOSTA_INVALIDA,
]

function criarErroDeTempoEsgotado() {
  const erro = new Error('A espera foi cancelada')
  erro.name = 'AbortError'
  return erro
}

describe('mensagemPorFalha', () => {
  it('explica o tempo esgotado quando a espera é cancelada', () => {
    expect(mensagemPorFalha(criarErroDeTempoEsgotado())).toBe(
      MENSAGEM_TEMPO_ESGOTADO
    )
  })

  it('explica a resposta inválida quando o JSON não pode ser lido', () => {
    expect(mensagemPorFalha(new SyntaxError('Unexpected token <'))).toBe(
      MENSAGEM_RESPOSTA_INVALIDA
    )
  })

  it('explica a falta de conexão quando o fetch falha', () => {
    expect(mensagemPorFalha(new TypeError('Failed to fetch'))).toBe(
      MENSAGEM_SEM_CONEXAO
    )
  })

  it('usa a mensagem de conexão para qualquer outra falha', () => {
    expect(mensagemPorFalha('falha desconhecida')).toBe(MENSAGEM_SEM_CONEXAO)
  })

  it('tem uma mensagem diferente para cada falha', () => {
    expect(new Set(MENSAGENS).size).toBe(3)
  })

  it('diz o que fazer em todas as mensagens', () => {
    for (const mensagem of MENSAGENS) {
      expect(mensagem).toMatch(/tente novamente/i)
    }
  })

  it('não usa termos técnicos', () => {
    expect(MENSAGENS.join(' ')).not.toMatch(
      /\bHTTP\b|\bstatus\b|requisição|\bAPI\b/i
    )
  })
})
