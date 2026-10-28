import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
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

describe('Caminhos para continuar a partir da página não encontrada', () => {
  function renderizarComRotas() {
    return render(
      <MemoryRouter initialEntries={['/rota-inexistente']}>
        <Routes>
          <Route path="/" element={<p>Está na Home</p>} />
          <Route path="/locais" element={<p>Está na listagem</p>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </MemoryRouter>,
    )
  }

  it('ao clicar em "Voltar para a página inicial", vai para a Home', async () => {
    const user = userEvent.setup()
    renderizarComRotas()

    await user.click(screen.getByRole('link', { name: 'Voltar para a página inicial' }))

    expect(screen.getByText('Está na Home')).toBeInTheDocument()
    expect(screen.queryByText(TITULO_NAO_ENCONTRADO)).not.toBeInTheDocument()
  })

  it('ao clicar em "Ver locais acessíveis", vai para a listagem', async () => {
    const user = userEvent.setup()
    renderizarComRotas()

    await user.click(screen.getByRole('link', { name: 'Ver locais acessíveis' }))

    expect(screen.getByText('Está na listagem')).toBeInTheDocument()
    expect(screen.queryByText(TITULO_NAO_ENCONTRADO)).not.toBeInTheDocument()
  })

  it('os dois links são alcançáveis pelo teclado antes de sair da página', async () => {
    const user = userEvent.setup()
    renderizarComRotas()

    await user.tab()
    expect(screen.getByRole('link', { name: 'Voltar para a página inicial' })).toHaveFocus()

    await user.tab()
    expect(screen.getByRole('link', { name: 'Ver locais acessíveis' })).toHaveFocus()
  })
})
