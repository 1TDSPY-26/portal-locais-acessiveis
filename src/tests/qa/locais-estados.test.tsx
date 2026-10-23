import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import Locais from '../../pages/Locais/Locais'
import { listarLocais } from '../../services/locais'
import { invalidarCacheLocais } from '../../services/cacheLocais'

vi.mock('../../services/locais')

function abrirListagem() {
  render(
    <MemoryRouter>
      <Locais />
    </MemoryRouter>,
  )
}

describe('QA: estados da listagem', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    invalidarCacheLocais()
  })

  it('lista vazia mostra estado vazio, sem erro', async () => {
    vi.mocked(listarLocais).mockResolvedValue({ data: [] })
    abrirListagem()

    expect(await screen.findByText(/nenhum local cadastrado até o momento/i)).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('falha da API mostra erro com "Tentar novamente"', async () => {
    vi.mocked(listarLocais).mockResolvedValue({ error: { message: 'Erro na requisição', status: 503 } })
    abrirListagem()

    expect(await screen.findByRole('alert')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /tentar novamente/i })).toBeInTheDocument()
  })
})
