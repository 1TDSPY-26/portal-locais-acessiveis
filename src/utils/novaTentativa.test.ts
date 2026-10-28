import { describe, expect, it } from 'vitest'
import {
  DICA_FALHAS_SEGUIDAS,
  acrescentarDica,
  ehErroRecuperavel,
} from './novaTentativa'

describe('ehErroRecuperavel', () => {
  it('considera recuperável a falha sem status (conexão ou tempo esgotado)', () => {
    expect(ehErroRecuperavel(undefined)).toBe(true)
  })

  it.each([408, 429, 500, 502, 503, 504, 599])('considera recuperável o status %i', (status) => {
    expect(ehErroRecuperavel(status)).toBe(true)
  })

  it.each([400, 401, 403, 404, 409, 422, 600])('não considera recuperável o status %i', (status) => {
    expect(ehErroRecuperavel(status)).toBe(false)
  })
})

describe('acrescentarDica', () => {
  const mensagem = 'Ocorreu um problema no servidor. Tente novamente mais tarde.'

  it.each([0, 1, 2])('mantém a mensagem com %i falha(s) seguida(s)', (falhas) => {
    expect(acrescentarDica(mensagem, falhas)).toBe(mensagem)
  })

  it.each([3, 4, 10])('acrescenta a dica com %i falhas seguidas', (falhas) => {
    expect(acrescentarDica(mensagem, falhas)).toBe(`${mensagem} ${DICA_FALHAS_SEGUIDAS}`)
  })
})