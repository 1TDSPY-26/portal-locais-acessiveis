import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import NotFound, {
  DESCRICAO_NAO_ENCONTRADO,
  ROTULO_ERRO_404,
  TITULO_NAO_ENCONTRADO,
} from './NotFound'

function renderizarNotFound() {
  return render(
    <MemoryRouter>
      <NotFound />
    </MemoryRouter>,
  )
}

describe('Estado vazio da página não encontrada', () => {
  it('mostra "Página não encontrada" como único h1', () => {
    renderizarNotFound()

    const titulos = screen.getAllByRole('heading', { level: 1 })

    expect(titulos).toHaveLength(1)
    expect(titulos[0]).toHaveTextContent(TITULO_NAO_ENCONTRADO)
  })

  it('mostra o código do erro e a explicação', () => {
    renderizarNotFound()

    expect(screen.getByText(ROTULO_ERRO_404)).toBeInTheDocument()
    expect(screen.getByText(DESCRICAO_NAO_ENCONTRADO)).toBeInTheDocument()
  })

  it('o link "Voltar para a página inicial" leva para a Home', () => {
    renderizarNotFound()

    expect(
      screen.getByRole('link', { name: 'Voltar para a página inicial' }),
    ).toHaveAttribute('href', '/')
  })

  it('o link "Ver locais acessíveis" leva para a listagem', () => {
    renderizarNotFound()

    expect(
      screen.getByRole('link', { name: 'Ver locais acessíveis' }),
    ).toHaveAttribute('href', '/locais')
  })
})
