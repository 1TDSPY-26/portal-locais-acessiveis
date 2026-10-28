import { describe, expect, it } from 'vitest'
import type { Local } from '../types/Local'
import { obterCoordenadasDoLocal, type CoordenadaVerificada } from './coordenadasLocais'

// Dados inventados só para o teste: nada aqui vem do catálogo real.
const REGISTRO_SINTETICO: CoordenadaVerificada = {
  idLocal: 10,
  enderecoVerificado: 'Rua Teste, 1000 - Cidade Exemplo',
  latitude: -10.5,
  longitude: -40.25,
  fonte: 'https://mapa.exemplo.com/lugar/10',
  dataVerificacao: '2026-01-15',
}

function criarLocal(id: number, endereco: string): Local {
  return {
    id,
    nome: 'Local de teste',
    endereco,
    categoria: 'Teste',
    tiposAcessibilidade: [],
    descricao: 'Local inventado para o teste',
    notaAcessibilidade: 3,
  }
}

const LOCAL_SINTETICO = criarLocal(10, 'Rua Teste, 1000 - Cidade Exemplo')

// Monta um catálogo de um registro, trocando só os campos que o teste quer.
function catalogoCom(mudancas: Partial<CoordenadaVerificada>): CoordenadaVerificada[] {
  return [{ ...REGISTRO_SINTETICO, ...mudancas }]
}

describe('obterCoordenadasDoLocal: identidade do local', () => {
  it('com id e endereço iguais, devolve só latitude e longitude', () => {
    const resultado = obterCoordenadasDoLocal(LOCAL_SINTETICO, [REGISTRO_SINTETICO])

    expect(resultado).toEqual({ latitude: -10.5, longitude: -40.25 })
  })

  it('com o mesmo id e endereço diferente, devolve null', () => {
    const local = criarLocal(10, 'Avenida Outra, 5 - Cidade Exemplo')

    expect(obterCoordenadasDoLocal(local, [REGISTRO_SINTETICO])).toBeNull()
  })

  it('não confunde números parecidos no endereço', () => {
    const local = criarLocal(10, 'Rua Teste, 100 - Cidade Exemplo')

    expect(obterCoordenadasDoLocal(local, [REGISTRO_SINTETICO])).toBeNull()
  })

  it('com id reutilizado por outro endereço, usa só o registro do endereço certo', () => {
    const catalogo: CoordenadaVerificada[] = [
      { ...REGISTRO_SINTETICO, enderecoVerificado: 'Avenida Outra, 5 - Cidade Exemplo', latitude: 1, longitude: 1 },
      REGISTRO_SINTETICO,
    ]

    expect(obterCoordenadasDoLocal(LOCAL_SINTETICO, catalogo)).toEqual({ latitude: -10.5, longitude: -40.25 })
  })

  it('tolera diferença só de espaços e maiúsculas no endereço', () => {
    const local = criarLocal(10, '  RUA   teste,  1000 -   cidade EXEMPLO ')

    expect(obterCoordenadasDoLocal(local, [REGISTRO_SINTETICO])).toEqual({ latitude: -10.5, longitude: -40.25 })
  })

  it('sem registro com o id do local, devolve null', () => {
    const local = criarLocal(99, 'Rua Teste, 1000 - Cidade Exemplo')

    expect(obterCoordenadasDoLocal(local, [REGISTRO_SINTETICO])).toBeNull()
  })

  it('com o catálogo vazio, devolve null', () => {
    expect(obterCoordenadasDoLocal(LOCAL_SINTETICO, [])).toBeNull()
  })
})

describe('obterCoordenadasDoLocal: latitude e longitude', () => {
  it('com valor que não é número finito, devolve null', () => {
    expect(obterCoordenadasDoLocal(LOCAL_SINTETICO, catalogoCom({ latitude: Number.NaN }))).toBeNull()
    expect(obterCoordenadasDoLocal(LOCAL_SINTETICO, catalogoCom({ longitude: Number.NaN }))).toBeNull()
    expect(obterCoordenadasDoLocal(LOCAL_SINTETICO, catalogoCom({ latitude: Infinity }))).toBeNull()
    expect(obterCoordenadasDoLocal(LOCAL_SINTETICO, catalogoCom({ longitude: -Infinity }))).toBeNull()
  })

  it('com latitude fora de -90 a 90, devolve null', () => {
    expect(obterCoordenadasDoLocal(LOCAL_SINTETICO, catalogoCom({ latitude: 90.1 }))).toBeNull()
    expect(obterCoordenadasDoLocal(LOCAL_SINTETICO, catalogoCom({ latitude: -90.1 }))).toBeNull()
  })

  it('com longitude fora de -180 a 180, devolve null', () => {
    expect(obterCoordenadasDoLocal(LOCAL_SINTETICO, catalogoCom({ longitude: 180.1 }))).toBeNull()
    expect(obterCoordenadasDoLocal(LOCAL_SINTETICO, catalogoCom({ longitude: -180.1 }))).toBeNull()
  })

  it('aceita latitude e longitude exatamente nos limites', () => {
    expect(obterCoordenadasDoLocal(LOCAL_SINTETICO, catalogoCom({ latitude: -90, longitude: -180 }))).toEqual({
      latitude: -90,
      longitude: -180,
    })
    expect(obterCoordenadasDoLocal(LOCAL_SINTETICO, catalogoCom({ latitude: 90, longitude: 180 }))).toEqual({
      latitude: 90,
      longitude: 180,
    })
  })
})

describe('obterCoordenadasDoLocal: fonte e data', () => {
  it('com fonte vazia ou só com espaços, devolve null', () => {
    expect(obterCoordenadasDoLocal(LOCAL_SINTETICO, catalogoCom({ fonte: '' }))).toBeNull()
    expect(obterCoordenadasDoLocal(LOCAL_SINTETICO, catalogoCom({ fonte: '   ' }))).toBeNull()
  })

  it('com fonte que não é link http ou https, devolve null', () => {
    expect(obterCoordenadasDoLocal(LOCAL_SINTETICO, catalogoCom({ fonte: 'mapa do bairro' }))).toBeNull()
    expect(obterCoordenadasDoLocal(LOCAL_SINTETICO, catalogoCom({ fonte: 'ftp://mapa.exemplo.com/lugar/10' }))).toBeNull()
  })

  it('aceita fonte com link http', () => {
    const catalogo = catalogoCom({ fonte: 'http://mapa.exemplo.com/lugar/10' })

    expect(obterCoordenadasDoLocal(LOCAL_SINTETICO, catalogo)).toEqual({ latitude: -10.5, longitude: -40.25 })
  })

  it('com data fora do formato AAAA-MM-DD, devolve null', () => {
    expect(obterCoordenadasDoLocal(LOCAL_SINTETICO, catalogoCom({ dataVerificacao: '' }))).toBeNull()
    expect(obterCoordenadasDoLocal(LOCAL_SINTETICO, catalogoCom({ dataVerificacao: '15/01/2026' }))).toBeNull()
    expect(obterCoordenadasDoLocal(LOCAL_SINTETICO, catalogoCom({ dataVerificacao: '2026-1-15' }))).toBeNull()
  })

  it('com data que não existe no calendário, devolve null', () => {
    expect(obterCoordenadasDoLocal(LOCAL_SINTETICO, catalogoCom({ dataVerificacao: '2026-02-30' }))).toBeNull()
    expect(obterCoordenadasDoLocal(LOCAL_SINTETICO, catalogoCom({ dataVerificacao: '2026-13-01' }))).toBeNull()
  })
})