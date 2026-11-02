import { describe, expect, it } from 'vitest'
import {
  CONTEXTO_CARREGAR_LISTA,
  CONTEXTO_CARREGAR_LOCAL,
  CONTEXTO_SALVAR_LOCAL,
  ORIENTACAO_PADRAO,
  montarMensagemComContexto,
} from './mensagemComContexto'

const CONTEXTOS = [
  CONTEXTO_CARREGAR_LISTA,
  CONTEXTO_CARREGAR_LOCAL,
  CONTEXTO_SALVAR_LOCAL,
]

describe('montarMensagemComContexto', () => {
  it('coloca a ação que falhou antes do detalhe', () => {
    expect(
      montarMensagemComContexto(
        CONTEXTO_CARREGAR_LISTA,
        'O serviço está fora do ar.'
      )
    ).toBe(
      'Não foi possível carregar a lista de locais. O serviço está fora do ar.'
    )
  })

  it('mantém o detalhe sem mudar o texto dele', () => {
    const detalhe =
      'Sem conexão com o servidor. Verifique sua internet e tente novamente.'

    expect(montarMensagemComContexto(CONTEXTO_SALVAR_LOCAL, detalhe)).toBe(
      `${CONTEXTO_SALVAR_LOCAL} ${detalhe}`
    )
  })

  it('tira os espaços das pontas do detalhe', () => {
    expect(
      montarMensagemComContexto(
        CONTEXTO_CARREGAR_LOCAL,
        '  Tente mais tarde.  '
      )
    ).toBe(`${CONTEXTO_CARREGAR_LOCAL} Tente mais tarde.`)
  })

  it('usa a orientação padrão quando o detalhe vem vazio', () => {
    expect(montarMensagemComContexto(CONTEXTO_CARREGAR_LISTA, '')).toBe(
      `${CONTEXTO_CARREGAR_LISTA} ${ORIENTACAO_PADRAO}`
    )
  })

  it('usa a orientação padrão quando o detalhe tem só espaços', () => {
    expect(montarMensagemComContexto(CONTEXTO_SALVAR_LOCAL, '   ')).toBe(
      `${CONTEXTO_SALVAR_LOCAL} ${ORIENTACAO_PADRAO}`
    )
  })

  it('tem um contexto diferente para cada ação', () => {
    expect(new Set(CONTEXTOS).size).toBe(3)
  })

  it('não usa termos técnicos nos contextos', () => {
    expect(CONTEXTOS.join(' ')).not.toMatch(
      /\bHTTP\b|\bstatus\b|requisição|\bAPI\b/i
    )
  })
})