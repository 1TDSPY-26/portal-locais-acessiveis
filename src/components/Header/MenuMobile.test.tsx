import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import MenuMobile from './MenuMobile'

function abrirMenu() {
  render(<MemoryRouter><MenuMobile /></MemoryRouter>)
  return userEvent.setup()
}

describe('Menu mobile após integração', () => {
  it('Esc fecha o menu e devolve o foco depois de navegar pelos links', async () => {
    const user = abrirMenu()
    const botao = screen.getByRole('button', { name: 'Menu' })
    await user.click(botao)
    await user.tab()
    expect(botao).not.toHaveFocus()
    await user.keyboard('{Escape}')
    expect(botao).toHaveFocus()
    expect(botao).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
  })

  it('fecha o menu ao escolher uma rota', async () => {
    const user = abrirMenu()
    await user.click(screen.getByRole('button', { name: 'Menu' }))
    await user.click(screen.getByRole('link', { name: 'Locais' }))
    expect(screen.getByRole('button', { name: 'Menu' })).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
  })
})
