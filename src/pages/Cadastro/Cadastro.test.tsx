import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { criarLocal } from '../../services/locais'
import Cadastro from './Cadastro'

vi.mock('../../services/locais')

const museu = {
    id: 10,
    nome: 'Museu Aberto',
    endereco: 'Rua A, 1',
    categoria: 'Cultura',
    descricao: 'Museu com rampa',
    tiposAcessibilidade: ['Rampa'],
    notaAcessibilidade: 4,
}

async function preencherEEnviar(espacos = '') {
  const usuario = userEvent.setup()
  render(
    <MemoryRouter>
      <Cadastro />
    </MemoryRouter>,
  )

  await usuario.type(screen.getByLabelText(/nome do local/i), `${espacos}${museu.nome}${espacos}`)
  await usuario.type(screen.getByLabelText(/endereço/i), `${espacos}${museu.endereco}${espacos}`)
  await usuario.type(screen.getByLabelText(/categoria/i), `${espacos}${museu.categoria}${espacos}`)
  await usuario.type(screen.getByLabelText(/descrição/i), `${espacos}${museu.descricao}${espacos}`)
  await usuario.click(screen.getByLabelText('Rampa'))
  await usuario.selectOptions(screen.getByLabelText(/nota de acessibilidade/i), '4')
  await usuario.click(screen.getByRole('button', { name: /cadastrar local/i }))
}

describe('Cadastro integrado à API', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('envia os dados e mostra o sucesso com link para o local', async () => {
    vi.mocked(criarLocal).mockResolvedValue({ data: museu })

    await preencherEEnviar()

    expect(criarLocal).toHaveBeenCalledTimes(1)
    expect(await screen.findByRole('status')).toHaveTextContent('Museu Aberto')
    expect(screen.getByRole('link', { name: /ver local cadastrado/i })).toHaveAttribute('href', '/locais/10')
  })

  it('mantém os dados quando a API falha', async () => {
    vi.mocked(criarLocal).mockResolvedValue({ error: { message: 'Erro na requisição', status: 500 } })

    await preencherEEnviar()

    expect(await screen.findByRole('alert')).toHaveTextContent(/não foi possível cadastrar/i)
    expect(screen.getByLabelText(/nome do local/i)).toHaveValue('Museu Aberto')
  })

  it('envia os textos sem espaços nas pontas', async () => {
    vi.mocked(criarLocal).mockResolvedValue({ data: museu })

    await preencherEEnviar('  ')

    expect(criarLocal).toHaveBeenCalledWith(
      expect.objectContaining({
        nome: 'Museu Aberto',
        endereco: 'Rua A, 1',
        categoria: 'Cultura',
        descricao: 'Museu com rampa',
      }),
    )
  })
})