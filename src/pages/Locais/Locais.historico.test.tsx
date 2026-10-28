import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import Locais from './Locais'
import { listarLocais } from '../../services/locais'
import { CHAVE_HISTORICO } from '../../services/historicoPesquisas'
import type { Local } from '../../types/Local'

vi.mock('../../services/locais', () => ({
  listarLocais: vi.fn(),
}))

const LOCAIS: Local[] = [
  {
    id: 1,
    nome: 'Biblioteca Central',
    endereco: 'Rua A, 10',
    categoria: 'Cultura',
    tiposAcessibilidade: ['Rampa', 'Banheiro adaptado'],
    descricao: 'Biblioteca pública.',
    notaAcessibilidade: 5,
  },
  {
    id: 2,
    nome: 'Museu da Cidade',
    endereco: 'Rua B, 20',
    categoria: 'Cultura',
    tiposAcessibilidade: ['Rampa'],
    descricao: 'Museu histórico.',
    notaAcessibilidade: 4,
  },
  {
    id: 3,
    nome: 'Biblioteca do Bairro',
    endereco: 'Rua C, 30',
    categoria: 'Educação',
    tiposAcessibilidade: ['Piso tátil'],
    descricao: 'Biblioteca de bairro.',
    notaAcessibilidade: 3,
  },
]

const ERRO_SALVAR =
  'Erro: Não foi possível salvar o histórico neste navegador. Você pode continuar pesquisando.'
const ERRO_CARREGAR =
  'Erro: Não foi possível carregar o histórico neste navegador. Você pode continuar pesquisando.'
const ERRO_LIMPAR =
  'Erro: Não foi possível apagar o histórico neste navegador. Tente novamente.'

async function renderizarLocais() {
  render(
    <MemoryRouter>
      <Locais />
    </MemoryRouter>,
  )
  return screen.findByLabelText('Buscar por nome')
}

function botoesDoHistorico() {
  const container = screen.queryByLabelText('Histórico de pesquisas')
  if (!container) return []
  return within(container)
    .getAllByRole('button')
    .filter(
      (botao) => botao.textContent !== 'Limpar histórico de pesquisas',
    )
    .map((botao) => botao.textContent)
}

function nomesVisiveis() {
  return screen
    .getAllByRole('heading', { level: 3 })
    .map((titulo) => titulo.textContent)
}

beforeEach(() => {
  localStorage.clear()
  vi.mocked(listarLocais).mockResolvedValue({ data: LOCAIS })
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('Locais com histórico de pesquisas', () => {
  it('digitar filtra na hora, mas só o Enter registra a pesquisa', async () => {
    const user = userEvent.setup()
    const campo = await renderizarLocais()

    await user.type(campo, 'museu')
    expect(nomesVisiveis()).toEqual(['Museu da Cidade'])
    expect(botoesDoHistorico()).toEqual([])

    await user.type(campo, '{Enter}')
    expect(botoesDoHistorico()).toEqual(['museu'])
  })

  it('Enter com só espaços não gera item', async () => {
    const user = userEvent.setup()
    const campo = await renderizarLocais()

    await user.type(campo, '   {Enter}')

    expect(botoesDoHistorico()).toEqual([])
  })

  it('guarda até cinco textos únicos e aparados, mais recentes primeiro', async () => {
    const user = userEvent.setup()
    const campo = await renderizarLocais()

    async function pesquisar(texto: string) {
      await user.clear(campo)
      await user.type(campo, `${texto}{Enter}`)
    }

    for (const texto of ['museu', ' Biblioteca ', 'a', 'biblioteca', 'b', 'c']) {
      await pesquisar(texto)
    }
    expect(botoesDoHistorico()).toEqual(['c', 'b', 'biblioteca', 'a', 'museu'])

    await pesquisar('d')
    expect(botoesDoHistorico()).toEqual(['d', 'c', 'b', 'biblioteca', 'a'])
  })

  it('selecionar uma pesquisa troca só a busca e move o item para o início', async () => {
    const user = userEvent.setup()
    const campo = await renderizarLocais()

    await user.type(campo, 'Biblioteca{Enter}')
    await user.clear(campo)
    await user.type(campo, 'Museu{Enter}')
    await user.clear(campo)

    await user.selectOptions(screen.getByLabelText('Categoria'), 'Cultura')
    await user.click(screen.getByRole('checkbox', { name: 'Rampa' }))

    const containerHistorico = screen.getByLabelText('Histórico de pesquisas')
    await user.click(
      within(containerHistorico).getByRole('button', { name: 'Biblioteca' }),
    )

    expect(campo).toHaveValue('Biblioteca')
    expect(screen.getByLabelText('Categoria')).toHaveValue('Cultura')
    expect(screen.getByRole('checkbox', { name: 'Rampa' })).toBeChecked()
    expect(nomesVisiveis()).toEqual(['Biblioteca Central'])
    expect(botoesDoHistorico()).toEqual(['Biblioteca', 'Museu'])
  })

  it('ao recarregar a página, restaura os itens salvos', async () => {
    localStorage.setItem(
      CHAVE_HISTORICO,
      JSON.stringify(['Museu', 'Biblioteca']),
    )

    await renderizarLocais()

    expect(botoesDoHistorico()).toEqual(['Museu', 'Biblioteca'])
  })

  it('JSON inválido resulta em lista vazia sem quebrar a página', async () => {
    localStorage.setItem(CHAVE_HISTORICO, '{quebrado')

    const campo = await renderizarLocais()

    expect(botoesDoHistorico()).toEqual([])
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(campo).toBeInTheDocument()
  })

  it('conteúdo que não é lista de textos resulta em lista vazia', async () => {
    localStorage.setItem(CHAVE_HISTORICO, '[1, 2]')

    await renderizarLocais()

    expect(botoesDoHistorico()).toEqual([])
  })

  it('com a gravação bloqueada, atualiza a lista e mostra o aviso uma vez', async () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('espaço cheio')
    })
    const user = userEvent.setup()
    const campo = await renderizarLocais()

    await user.type(campo, 'museu{Enter}')

    expect(botoesDoHistorico()).toEqual(['museu'])
    const aviso = screen.getByRole('alert')
    expect(aviso).toHaveTextContent(ERRO_SALVAR)
    expect(aviso.textContent?.split('Erro:')).toHaveLength(2)

    await user.selectOptions(screen.getByLabelText('Categoria'), 'Cultura')
    expect(nomesVisiveis()).toEqual(['Museu da Cidade'])
  })

  it('com a leitura bloqueada, abre com o histórico vazio e a busca funciona', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('acesso bloqueado')
    })
    const user = userEvent.setup()
    const campo = await renderizarLocais()

    expect(botoesDoHistorico()).toEqual([])
    expect(screen.getByRole('alert')).toHaveTextContent(ERRO_CARREGAR)

    await user.type(campo, 'museu')
    expect(nomesVisiveis()).toEqual(['Museu da Cidade'])
  })

  it('limpa o histórico, mantém a busca e devolve o foco ao campo', async () => {
    const user = userEvent.setup()
    const campo = await renderizarLocais()

    await user.type(campo, 'Museu{Enter}')
    await user.selectOptions(screen.getByLabelText('Categoria'), 'Cultura')
    await user.click(screen.getByRole('checkbox', { name: 'Rampa' }))
    await user.selectOptions(screen.getByLabelText('Ordenar por'), 'nome-desc')

    expect(botoesDoHistorico()).toEqual(['Museu'])

    const botaoLimpar = screen.getByRole('button', {
      name: 'Limpar histórico de pesquisas',
    })

    await user.click(botaoLimpar)

    expect(botoesDoHistorico()).toEqual([])
    expect(localStorage.getItem(CHAVE_HISTORICO)).toBeNull()

    expect(campo).toHaveValue('Museu')
    expect(screen.getByLabelText('Categoria')).toHaveValue('Cultura')
    expect(screen.getByRole('checkbox', { name: 'Rampa' })).toBeChecked()
    expect(screen.getByLabelText('Ordenar por')).toHaveValue('nome-desc')
    expect(campo).toHaveFocus()

    expect(
      screen.getByText('Sucesso: Histórico de pesquisas apagado.'),
    ).toHaveAttribute('role', 'status')
  })

  it('mantém o histórico e mostra erro quando não consegue apagá-lo', async () => {
    const user = userEvent.setup()
    const campo = await renderizarLocais()

    await user.type(campo, 'Museu{Enter}')

    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw new Error('acesso bloqueado')
    })

    await user.click(
      screen.getByRole('button', {
        name: 'Limpar histórico de pesquisas',
      }),
    )

    expect(botoesDoHistorico()).toEqual(['Museu'])

    expect(
      screen.getByRole('button', {
        name: 'Limpar histórico de pesquisas',
      }),
    ).toBeInTheDocument()

    const aviso = screen.getByRole('alert')

    expect(aviso).toHaveTextContent(ERRO_LIMPAR)
    expect(aviso.textContent?.split('Erro:')).toHaveLength(2)
  })
})