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

  await screen.findByText('Mostrando 1–3 de 3 locais')
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

  it('busca por parte do nome e conta um único resultado', async () => {
    await abrirListagem()

    await userEvent.type(
      screen.getByLabelText('Buscar por nome'),
      'parq',
    )

    expect(nomesVisiveis()).toEqual(['Parque Verde'])
    expect(screen.getByText('Mostrando 1–1 de 1 locais')).toBeInTheDocument()
  })

  it('ignora acentos e maiúsculas', async () => {
    await abrirListagem()

    await userEvent.type(
      screen.getByLabelText('Buscar por nome'),
      'ACAO',
    )

    expect(nomesVisiveis()).toEqual(['Centro Cultural Ação'])
    expect(screen.getByText('Mostrando 1–1 de 1 locais')).toBeInTheDocument()
  })

  it('exige todos os recursos marcados', async () => {
    await abrirListagem()

    await userEvent.click(screen.getByLabelText('Rampa'))
    await userEvent.click(screen.getByLabelText('Elevador'))

    expect(nomesVisiveis()).toEqual(['Biblioteca Central'])
    expect(screen.getByText('Mostrando 1–1 de 1 locais')).toBeInTheDocument()
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

    expect(screen.getByText('Mostrando 1–2 de 2 locais')).toBeInTheDocument()
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
    expect(screen.getByText('Mostrando 1–1 de 1 locais')).toBeInTheDocument()
  })

  it('mostra zero locais quando nenhum resultado corresponde à busca', async () => {
    await abrirListagem()

    await userEvent.type(
      screen.getByLabelText('Buscar por nome'),
      'inexistente',
    )

    expect(screen.getByText('Mostrando 0–0 de 0 locais')).toBeInTheDocument()
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
    expect(screen.getByText('Mostrando 1–3 de 3 locais')).toBeInTheDocument()
  })
})
