
import { describe, expect, it } from 'vitest'
import { MENSAGEM_PADRAO, mensagemPorStatus } from './mensagensErro'

describe('mensagemPorStatus', () => {
  it('explica o erro 400', () => {
    expect(mensagemPorStatus(400)).toMatch(/dados enviados/i)
  })

  it('explica o erro 401', () => {
    expect(mensagemPorStatus(401)).toMatch(/faça login/i)
  })

  it('explica o erro 403', () => {
    expect(mensagemPorStatus(403)).toMatch(/não tem permissão/i)
  })

  it('explica o 404 sem termos técnicos', () => {
    expect(mensagemPorStatus(404)).toMatch(/não encontramos/i)
  })

  it('explica o erro 408', () => {
    expect(mensagemPorStatus(408)).toMatch(/demorou demais/i)
  })

  it('explica o erro 409', () => {
    expect(mensagemPorStatus(409)).toMatch(/conflito/i)
  })

  it('explica o erro 422', () => {
    expect(mensagemPorStatus(422)).toMatch(/dados não foram aceitos/i)
  })

  it('explica o erro 429', () => {
    expect(mensagemPorStatus(429)).toMatch(/muitas tentativas/i)
  })

  it('explica o erro 500', () => {
    expect(mensagemPorStatus(500)).toMatch(/problema no servidor/i)
  })

  it('explica o erro 502', () => {
    expect(mensagemPorStatus(502)).toMatch(/resposta inesperada/i)
  })

  it('explica o 503 como serviço indisponível', () => {
    expect(mensagemPorStatus(503)).toMatch(/temporariamente indisponível/i)
  })

  it('explica o erro 504', () => {
    expect(mensagemPorStatus(504)).toMatch(/demorou para responder/i)
  })

  it('usa a mensagem de servidor para um 5xx fora da lista', () => {
    expect(mensagemPorStatus(507)).toBe(mensagemPorStatus(500))
  })

  it('usa a mensagem padrão para um status desconhecido', () => {
    expect(mensagemPorStatus(418)).toBe(MENSAGEM_PADRAO)
  })

  it('usa a mensagem padrão para códigos fora da faixa HTTP usual', () => {
    expect(mensagemPorStatus(600)).toBe(MENSAGEM_PADRAO)
  })

  it('não utiliza termos técnicos nas mensagens específicas', () => {
    const codigos = [
      400, 401, 403, 404, 408, 409,
      422, 429, 500, 502, 503, 504,
    ]

    const mensagens = codigos.map(mensagemPorStatus).join(' ')

    expect(mensagens).not.toMatch(/\bHTTP\b|\bstatus\b|requisição/i)
  })
})
