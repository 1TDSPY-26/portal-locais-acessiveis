import { beforeEach, describe, expect, it, vi } from 'vitest'
import { apiRequest } from './api'
import { invalidarCacheLocais } from './cacheLocais'
import { atualizarLocal, criarLocal, listarLocais, obterLocalPorId, removerLocal } from './locais'

vi.mock('./api', () => ({
  apiRequest: vi.fn(),
}))
vi.mock('./cacheLocais')

const apiRequestFalso = vi.mocked(apiRequest)

const novoLocal = {
  nome: 'Museu Aberto',
  endereco: 'Rua A, 1',
  categoria: 'Cultura',
  tiposAcessibilidade: ['Rampa'],
  descricao: 'Museu com rampa',
  notaAcessibilidade: 4,
}

beforeEach(() => {
  apiRequestFalso.mockReset()
  vi.mocked(invalidarCacheLocais).mockClear()
  apiRequestFalso.mockResolvedValue({ data: undefined })
})

describe('listarLocais', () => {
  it('chama /locais quando não há filtros', async () => {
    await listarLocais()

    expect(apiRequestFalso).toHaveBeenCalledWith('/locais')
  })

  it('monta a query com todos os filtros', async () => {
    await listarLocais({
        categoria: 'Cultura',
        acessibilidade: 'Rampa',
        pagina: 1,
        limite: 10
    })

    expect(apiRequestFalso).toHaveBeenCalledWith('/locais?categoria=Cultura&acessibilidade=Rampa&pagina=1&limite=10')
  })

  it('ignora filtros vazios', async () => {
    await listarLocais({
        categoria: '',
        pagina: 0
    })

    expect(apiRequestFalso).toHaveBeenCalledWith('/locais')
  })

  it('uso de caracteres especiais nos filtros', async () => {
    await listarLocais({
        categoria: 'Saúde & Bem-estar'
    })

    expect(apiRequestFalso).toHaveBeenCalledWith('/locais?categoria=Sa%C3%BAde+%26+Bem-estar')
  })

  it('devolve o resultado do apiRequest sem alterar', async () => {
    const resultadoFalso = [{ id: 1, nome: 'Fiap Paulista'}]
    apiRequestFalso.mockResolvedValue(resultadoFalso as any)

    const resultado = await listarLocais()

    expect(resultado).toBe(resultadoFalso)
  })
})

describe('obterLocalPorId', () => {
    it('chama o endpoint /locais/{id} com o método GET', async () => {
        await obterLocalPorId(5)

        expect(apiRequestFalso).toHaveBeenCalledWith('/locais/5')
    })
})

describe('criarLocal', () => {
  it('faz POST em /locais com o corpo em JSON', async () => {
    await criarLocal(novoLocal)

    expect(apiRequestFalso).toHaveBeenCalledWith('/locais', {
        method: 'POST',
        body: JSON.stringify(novoLocal)
    })
  })
})

describe('atualizarLocal', () => {
    it('faz PUT em /locais/{id} com o corpo em JSON', async () => {
        const atualizacao = { nome: 'Fiap Aclimação'}
        await atualizarLocal(5, atualizacao)

        expect(apiRequestFalso).toHaveBeenCalledWith('/locais/5', {
            method: 'PUT',
            body: JSON.stringify(atualizacao)
        })
    })
})

describe('removerLocal', () => {
  it('faz DELETE em /locais/{id}', async () => {
    await removerLocal(5)

    expect(apiRequestFalso).toHaveBeenCalledWith('/locais/5', {
        method: 'DELETE'
    })
  })
})

describe('Invalidação do cache nas escritas', () => {
  const operacoes = [
    ['cadastro', () => criarLocal(novoLocal)],
    ['edição', () => atualizarLocal(5, { nome: 'Nome atualizado' })],
    ['exclusão', () => removerLocal(5)],
  ] as const

  it.each(operacoes)('%s invalida o cache após sucesso', async (_nome, executar) => {
    await executar()
    expect(invalidarCacheLocais).toHaveBeenCalledTimes(1)
  })

  it.each(operacoes)('%s mantém o cache quando a API falha', async (_nome, executar) => {
    const erro = { error: { message: 'Falha na escrita', status: 500 } }
    apiRequestFalso.mockResolvedValueOnce(erro)
    expect(await executar()).toBe(erro)
    expect(invalidarCacheLocais).not.toHaveBeenCalled()
  })
})
