import { act, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { RECURSOS_ACESSIBILIDADE } from '../../constants/acessibilidade'
import Cadastro from '../../pages/Cadastro/Cadastro'
import EditLocation from '../../pages/EditLocation/EditLocation'
import { obterLocalPorId } from '../../services/locais'
import type { Local } from '../../types/Local'

vi.mock('../../services/locais', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../services/locais')>()),
  obterLocalPorId: vi.fn(),
}))

const RECURSO_LONGO = 'Sinalização tátil e sonora em todos os andares do edifício'

const local: Local = {
  id: 1,
  nome: 'Biblioteca Central',
  endereco: 'Rua A, 10',
  categoria: 'Cultura',
  descricao: 'Espaço de leitura',
  tiposAcessibilidade: ['Rampa', RECURSO_LONGO],
  notaAcessibilidade: 4,
}

function abrirRota(caminho: string) {
  return render(
    <MemoryRouter initialEntries={[caminho]}>
      <Routes>
        <Route path="/locais/editar/:id" element={<EditLocation />} />
        <Route path="/cadastro" element={<Cadastro />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('responsividade dos formulários', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(obterLocalPorId).mockResolvedValue({ data: local })
  })

  it('a edição mostra o carregamento dentro do container', async () => {
    vi.mocked(obterLocalPorId).mockReturnValue(new Promise<never>(() => {}))
    abrirRota('/locais/editar/1')
    await act(async () => {})

    const status = screen.getByRole('status')
    expect(status).toHaveTextContent('Carregando dados do local...')
    expect(status.closest('.max-w-2xl')).not.toBeNull()
  })

  it('a edição tem o h1 "Editar local" e nenhum estilo inline', async () => {
    const { container } = abrirRota('/locais/editar/1')

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Editar local' }),
    ).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(container.querySelector('[style]')).toBeNull()
  })

  it('os campos da edição têm altura mínima de 44 px', async () => {
    abrirRota('/locais/editar/1')

    const campos = [
      await screen.findByLabelText('Nome do local'),
      screen.getByLabelText('Endereço'),
      screen.getByLabelText('Categoria'),
      screen.getByLabelText('Descrição'),
      screen.getByLabelText('Nota de acessibilidade'),
    ]

    campos.forEach((campo) => expect(campo).toHaveClass('min-h-11'))
  })

  it('os checkboxes da edição não encolhem', async () => {
    abrirRota('/locais/editar/1')

    await screen.findByLabelText(RECURSO_LONGO)
    const checkboxes = screen.getAllByRole('checkbox')

    expect(checkboxes.length).toBeGreaterThan(RECURSOS_ACESSIBILIDADE.length - 1)
    checkboxes.forEach((checkbox) => expect(checkbox).toHaveClass('shrink-0'))
  })

  it('os campos de texto do cadastro têm altura mínima de 44 px', () => {
    abrirRota('/cadastro')

    const campos = [
      screen.getByLabelText(/Nome do local/),
      screen.getByLabelText(/Endereço/),
      screen.getByLabelText(/Categoria/),
    ]

    campos.forEach((campo) => expect(campo).toHaveClass('min-h-11'))
  })

  it('os checkboxes do cadastro não encolhem', () => {
    abrirRota('/cadastro')

    const checkboxes = screen.getAllByRole('checkbox')

    expect(checkboxes).toHaveLength(RECURSOS_ACESSIBILIDADE.length)
    checkboxes.forEach((checkbox) => expect(checkbox).toHaveClass('shrink-0'))
  })
})