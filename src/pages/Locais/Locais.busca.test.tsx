import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { invalidarCacheLocais } from '../../services/cacheLocais'
import { listarLocais } from '../../services/locais'
import { locaisDeTeste } from '../../tests/fixtures/locais'
import Locais from './Locais'

vi.mock('../../services/locais')

async function abrirListagem() {
  vi.mocked(listarLocais).mockResolvedValue({ data: locaisDeTeste })

  render(
    <MemoryRouter>
      <Locais />
    </MemoryRouter>,
  )

  await screen.findByText('3 locais encontrados')
}

function nomesVisiveis() {
  return screen
    .getAllByRole('heading', { level: 3 })
    .map((titulo) => titulo.textContent)
}

describe('Locais: busca e filtros', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    invalidarCacheLocais()
  })

  it('busca por parte do nome e usa o singular', async () => {
    await abrirListagem()

    await userEvent.type(
      screen.getByLabelText('Buscar por nome'),
      'parq',
    )

    expect(nomesVisiveis()).toEqual(['Parque Verde'])
    expect(screen.getByText('1 local encontrado')).toBeInTheDocument()
  })

  it('ignora acentos e maiúsculas', async () => {
    await abrirListagem()

    await userEvent.type(
      screen.getByLabelText('Buscar por nome'),
      'ACAO',
    )

    expect(nomesVisiveis()).toEqual(['Centro Cultural Ação'])
    expect(screen.getByText('1 local encontrado')).toBeInTheDocument()
  })

  it('exige todos os recursos marcados', async () => {
    await abrirListagem()

    await userEvent.click(screen.getByLabelText('Rampa'))
    await userEvent.click(screen.getByLabelText('Elevador'))

    expect(nomesVisiveis()).toEqual(['Biblioteca Central'])
    expect(screen.getByText('1 local encontrado')).toBeInTheDocument()
  })

  it('filtra por categoria', async () => {
    await abrirListagem()

    await userEvent.selectOptions(
      screen.getByLabelText('Categoria'),
      'Cultura',
    )

    expect(nomesVisiveis()).toEqual([
      'Biblioteca Central',
      'Centro Cultural Ação',
    ])

    expect(screen.getByText('2 locais encontrados')).toBeInTheDocument()
  })

  it('combina busca com categoria', async () => {
    await abrirListagem()

    await userEvent.selectOptions(
      screen.getByLabelText('Categoria'),
      'Cultura',
    )

    await userEvent.type(
      screen.getByLabelText('Buscar por nome'),
      'biblioteca',
    )

    expect(nomesVisiveis()).toEqual(['Biblioteca Central'])
    expect(screen.getByText('1 local encontrado')).toBeInTheDocument()
  })

  it('mostra zero locais quando nenhum resultado corresponde à busca', async () => {
    await abrirListagem()

    await userEvent.type(
      screen.getByLabelText('Buscar por nome'),
      'inexistente',
    )

    expect(screen.getByText('0 locais encontrados')).toBeInTheDocument()
    expect(screen.queryAllByRole('heading', { level: 3 })).toHaveLength(0)
  })

  it('limpa filtros e busca e restaura a lista', async () => {
    await abrirListagem()

    await userEvent.type(
      screen.getByLabelText('Buscar por nome'),
      'biblioteca',
    )

    await userEvent.selectOptions(
      screen.getByLabelText('Categoria'),
      'Cultura',
    )

    await userEvent.click(screen.getByLabelText('Rampa'))

    expect(nomesVisiveis()).toEqual(['Biblioteca Central'])

    await userEvent.click(
      screen.getByRole('button', {
        name: 'Limpar filtros e busca (3)',
      }),
    )

    expect(screen.getByLabelText('Buscar por nome')).toHaveValue('')
    expect(screen.getByLabelText('Categoria')).toHaveValue('')

    expect(nomesVisiveis()).toHaveLength(3)
    expect(screen.getByText('3 locais encontrados')).toBeInTheDocument()
  })
})