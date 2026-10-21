import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import AppRoutes from '../../routes/AppRoutes'
import { auditarAcessibilidade } from './auditarAcessibilidade'

vi.mock('../../services/locais', () => {
  const localDeExemplo = {
    id: 1,
    nome: 'Biblioteca Central',
    endereco: 'Rua A, 10',
    categoria: 'Cultura',
    tiposAcessibilidade: ['Rampa', 'Elevador'],
    descricao: 'Espaço de leitura',
    notaAcessibilidade: 4,
  }

  return {
    listarLocais: vi.fn().mockResolvedValue({ data: [localDeExemplo] }),
    obterLocalPorId: vi.fn().mockResolvedValue({ data: localDeExemplo }),
    criarLocal: vi.fn().mockResolvedValue({ data: localDeExemplo }),
    atualizarLocal: vi.fn().mockResolvedValue({ data: localDeExemplo }),
  }
})

async function abrirRota(url: string, textoDaPaginaCarregada: RegExp) {
  const { container } = render(
    <MemoryRouter initialEntries={[url]}>
      <AppRoutes />
    </MemoryRouter>,
  )
  await screen.findAllByText(textoDaPaginaCarregada)
  return container
}

describe('Validação do auditor', () => {
  it('detecta um campo sem label associado', async () => {
    const { container } = render(
      <div>
        <label>Buscar por nome</label>
        <input id="busca-teste" />
      </div>,
    )

    await expect(auditarAcessibilidade(container)).rejects.toThrow(/label/i)
  })
})

describe('Auditoria automática de acessibilidade', () => {
  it('a Home não tem violações', async () => {
    const container = await abrirRota('/', /Portal de Locais e Serviços Acessíveis/)
    await auditarAcessibilidade(container)
  })

  it('a listagem não tem violações', async () => {
    const container = await abrirRota('/locais', /Biblioteca Central/)
    await auditarAcessibilidade(container)
  })

  it('a página 404 não tem violações', async () => {
    const container = await abrirRota('/rota-que-nao-existe', /404/)
    await auditarAcessibilidade(container)
  })

  it('a página Sobre não tem violações', async () => {
    const container = await abrirRota('/sobre', /Sobre o projeto/)
    await auditarAcessibilidade(container)
  })

  it('a página Acessibilidade não tem violações', async () => {
    const container = await abrirRota('/acessibilidade', /Acessibilidade do portal/)
    await auditarAcessibilidade(container)
  })

  it('a edição de local não tem violações', async () => {
    const container = await abrirRota('/locais/editar/1', /Editar Local/)
    await auditarAcessibilidade(container)
  })

  it('o cadastro não tem violações', async () => {
    const container = await abrirRota('/cadastro', /Cadastrar novo local/)
    await auditarAcessibilidade(container)
  })

  it('o detalhe não tem violações', async () => {
    const container = await abrirRota('/locais/1', /Biblioteca Central/)
    await auditarAcessibilidade(container)
  })
})
