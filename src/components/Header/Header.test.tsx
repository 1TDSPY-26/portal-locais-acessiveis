import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import Cabecalho from './Header'

function abrirEm(url: string) {
  render(
    <MemoryRouter initialEntries={[url]}>
      <Cabecalho />
    </MemoryRouter>,
  )
}

function menuDesktop() {
  return within(
    screen.getByRole('navigation', {
      name: 'Navegação principal',
      hidden: true,
    }),
  )
}

function botaoDoMenu() {
  return screen.getByRole('button', { name: /menu/i })
}

describe('Header: menu principal', () => {
  it('marca só a página atual com aria-current', () => {
    abrirEm('/sobre')

    const links = menuDesktop().getAllByRole('link', { hidden: true })
    const linksAtivos = links.filter(
      (link) => link.getAttribute('aria-current') === 'page',
    )

    expect(linksAtivos.map((link) => link.textContent)).toEqual(['Sobre'])
  })

  it('"Home" não fica ativo em /locais', () => {
    abrirEm('/locais')

    expect(
      menuDesktop().getByRole('link', { name: 'Home', hidden: true }),
    ).not.toHaveAttribute('aria-current', 'page')
  })

  it('os quatro links têm os destinos corretos', () => {
    abrirEm('/')

    expect(
      menuDesktop().getByRole('link', { name: 'Home', hidden: true }),
    ).toHaveAttribute('href', '/')

    expect(
      menuDesktop().getByRole('link', { name: 'Locais', hidden: true }),
    ).toHaveAttribute('href', '/locais')

    expect(
      menuDesktop().getByRole('link', { name: 'Cadastro', hidden: true }),
    ).toHaveAttribute('href', '/cadastro')

    expect(
      menuDesktop().getByRole('link', { name: 'Sobre', hidden: true }),
    ).toHaveAttribute('href', '/sobre')
  })

  it('"Locais" fica ativo em /locais/1', () => {
    abrirEm('/locais/1')

    expect(
      menuDesktop().getByRole('link', { name: 'Locais', hidden: true }),
    ).toHaveAttribute('aria-current', 'page')
  })
})

describe('Header: menu mobile', () => {
  it('começa fechado e abre ao clicar', async () => {
    const user = userEvent.setup()
    abrirEm('/')

    expect(botaoDoMenu()).toHaveAttribute('aria-expanded', 'false')

    await user.click(botaoDoMenu())

    expect(botaoDoMenu()).toHaveAttribute('aria-expanded', 'true')
  })

  it('Escape fecha o menu e devolve o foco ao botão', async () => {
    const user = userEvent.setup()
    abrirEm('/')

    await user.click(botaoDoMenu())
    expect(botaoDoMenu()).toHaveAttribute('aria-expanded', 'true')

    await user.keyboard('{Escape}')

    expect(botaoDoMenu()).toHaveAttribute('aria-expanded', 'false')
    expect(botaoDoMenu()).toHaveFocus()
  })

  it('fecha o menu ao escolher um link', async () => {
    const user = userEvent.setup()
    abrirEm('/')

    await user.click(botaoDoMenu())
    expect(botaoDoMenu()).toHaveAttribute('aria-expanded', 'true')

    const menuMobile = within(
      screen.getByRole('navigation', {
        name: 'Navegação principal móvel',
      }),
    )

    await user.click(menuMobile.getByRole('link', { name: 'Sobre' }))

    expect(botaoDoMenu()).toHaveAttribute('aria-expanded', 'false')
  })
})