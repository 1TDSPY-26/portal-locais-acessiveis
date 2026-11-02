import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { EmptyState } from './EmptyState'

describe('EmptyState', () => {
  it('continua aceitando a prop antiga message', () => {
    render(<EmptyState message="Nada aqui." />)
    expect(screen.getByText('Nada aqui.')).toBeInTheDocument()
  })

  it('mostra o link de ação', () => {
    render(
      <MemoryRouter>
        <EmptyState titulo="Vazio" link={{ rotulo: 'Cadastrar', para: '/cadastro' }} />
      </MemoryRouter>,
    )
    expect(screen.getByRole('link', { name: 'Cadastrar' })).toHaveAttribute('href', '/cadastro')
  })

  it('mostra o botão de ação e chama a função', async () => {
    const mostrarTodos = vi.fn()
    render(<EmptyState titulo="Vazio" botao={{ rotulo: 'Mostrar todos', onClick: mostrarTodos }} />)

    await userEvent.click(screen.getByRole('button', { name: 'Mostrar todos' }))

    expect(mostrarTodos).toHaveBeenCalledOnce()
  })

  it('garante que o ícone decorativo possui aria-hidden="true"', () => {
    render(<EmptyState titulo="Vazio" />)
    const icone = screen.getByText('🔎')
    expect(icone).toHaveAttribute('aria-hidden', 'true')
  })
})