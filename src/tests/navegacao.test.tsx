import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import AppRoutes from '../routes/AppRoutes'

vi.mock('../services/locais', () => ({
  listarLocais: vi.fn().mockResolvedValue({
    data: [],
    error: null,
  }),
}))

function renderizarApp(caminhoInicial = '/') {
  render(
    <MemoryRouter initialEntries={[caminhoInicial]}>
      <AppRoutes />
    </MemoryRouter>,
  )
}

describe('Navegação entre páginas', () => {
  it('clicar em "Sobre" troca a página e o link ativo', async () => {
    const user = userEvent.setup()
    renderizarApp('/')

    const navegacao = within(
      screen.getByRole('navigation', {
        name: 'Navegação principal',
        hidden: true,
      }),
    )

    await user.click(navegacao.getByRole('link', { name: 'Sobre' }))

    expect(
      await screen.findByRole('heading', { name: 'Sobre o projeto' }),
    ).toBeInTheDocument()

    expect(navegacao.getByRole('link', { name: 'Sobre' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it('o link do rodapé abre a página de Acessibilidade', async () => {
    const user = userEvent.setup()
    renderizarApp('/')

    await user.click(
      screen.getByRole('link', { name: 'Acessibilidade' }),
    )

    expect(
      await screen.findByRole('heading', {
        name: 'Acessibilidade do portal',
      }),
    ).toBeInTheDocument()
  })
})