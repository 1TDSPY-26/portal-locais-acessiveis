import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import AppRoutes from './AppRoutes'

function renderizarRota(rota: string) {
  return render(
    <MemoryRouter initialEntries={[rota]}>
      <AppRoutes />
    </MemoryRouter>,
  )
}

describe('AppRoutes', () => {
  it.each([
    ['/cadastro', 'Cadastro'],
    ['/locais/1', 'Detalhe do Local'],
  ])('a rota %s exibe a página "%s"', async (rota, titulo) => {
    renderizarRota(rota)

    expect(
      await screen.findByRole('heading', { name: titulo }),
    ).toBeInTheDocument()
  })

  it('redireciona /cadastrar para /cadastro', async () => {
    renderizarRota('/cadastrar')

    expect(
      await screen.findByRole('heading', { name: 'Cadastro' }),
    ).toBeInTheDocument()
  })

  it('renderiza a página dentro do layout, com um único <main>', async () => {
    renderizarRota('/cadastro')

    await screen.findByRole('heading', { name: 'Cadastro' })

    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getAllByRole('main')).toHaveLength(1)
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })
})