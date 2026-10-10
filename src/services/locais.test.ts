import { beforeEach, describe, expect, it, vi } from 'vitest'
import { apiRequest } from './api'
import { atualizarLocal, criarLocal, listarLocais, obterLocalPorId, removerLocal } from './locais'

vi.mock('./api', () => ({
  apiRequest: vi.fn(),
}))

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
  apiRequestFalso.mockResolvedValue({ data: undefined })
})

describe('listarLocais', () => {
  it('chama /locais quando não há filtros', async () => {
    await listarLocais()

    expect(apiRequestFalso).toHaveBeenCalledWith('/locais')
  })

  it('monta a query com todos os filtros', async () => {
    // TODO: passar categoria, acessibilidade, pagina e limite e conferir a URL completa
    // (a ordem dos parâmetros é a mesma dos `append` em locais.ts)
    await listarLocais({
        categoria: 'Cultura',
        acessibilidade: 'Rampa',
        pagina: 1,
        limite: 10
    })

    expect(apiRequestFalso).toHaveBeenCalledWith('/locais?categoria=Cultura&acessibilidade=Rampa&pagina=1&limite=10')
  })

  it('ignora filtros vazios', async () => {
    // TODO: categoria '' e pagina 0 → a chamada continua sendo só '/locais'
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
    // TODO: fazer o falso devolver um objeto e conferir que listarLocais devolve o MESMO objeto (toBe)
    const resultadoFalso = [{ id: 1, nome: 'Fiap Paulista'}]
    apiRequestFalso.mockResolvedValue(resultadoFalso as any)

    const resultado = await listarLocais()

    expect(resultado).toBe(resultadoFalso)
  })
})

describe('criarLocal', () => {
  it('faz POST em /locais com o corpo em JSON', async () => {
    // TODO: conferir endpoint, method 'POST' e body com JSON.stringify(novoLocal)
  })
})

describe('removerLocal', () => {
  it('faz DELETE em /locais/{id}', async () => {
    // TODO: conferir '/locais/5' com method 'DELETE'
  })
})

// TODO: describe de obterLocalPorId e de atualizarLocal (PUT com corpo JSON)