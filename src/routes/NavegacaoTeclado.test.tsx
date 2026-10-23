import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import AppRoutes from './AppRoutes'

function renderizarApp(rota = '/cadastro') {
  return render(
    <MemoryRouter initialEntries={[rota]}>
      <AppRoutes />
    </MemoryRouter>,
  )
}

function linksDoMenu() {
  const menu = screen.getByRole('navigation', { name: 'Navegação principal' })
  return within(menu).getAllByRole('link')
}

describe('Navegação por teclado no menu', () => {
  it('percorre os links do menu com Tab, na ordem esperada', async () => {
    const user = userEvent.setup()
    renderizarApp()

    const links = linksDoMenu()
    expect(links.map((link) => link.textContent)).toEqual([
      'Home',
      'Locais',
      'Cadastro',
      'Sobre',
    ])

    links[0].focus()
    expect(links[0]).toHaveFocus()

    for (const proximo of links.slice(1)) {
      await user.tab()
      expect(proximo).toHaveFocus()
    }
  })

  it('navega com Enter e marca o link ativo com aria-current', async () => {
    const user = userEvent.setup()
    renderizarApp('/locais/1')

    await screen.findByRole('heading', { name: 'Detalhe do Local' })

    const cadastro = linksDoMenu().find((link) => link.textContent === 'Cadastro')!
    cadastro.focus()
    await user.keyboard('{Enter}')

    expect(
      await screen.findByRole('heading', { name: 'Cadastro' }),
    ).toBeInTheDocument()

    const ativo = linksDoMenu().find((link) => link.textContent === 'Cadastro')!
    expect(ativo).toHaveAttribute('aria-current', 'page')
  })

  it('abre o menu móvel com Enter e fecha com Escape devolvendo o foco ao botão', async () => {
    const user = userEvent.setup()
    renderizarApp()

    const botao = screen.getByRole('button', { name: 'Abrir menu' })
    botao.focus()
    await user.keyboard('{Enter}')

    expect(screen.getByRole('button', { name: 'Fechar menu' })).toHaveAttribute(
      'aria-expanded',
      'true',
    )

    await user.keyboard('{Escape}')

    const botaoFechado = screen.getByRole('button', { name: 'Abrir menu' })
    expect(botaoFechado).toHaveAttribute('aria-expanded', 'false')
    expect(botaoFechado).toHaveFocus()
  })
})