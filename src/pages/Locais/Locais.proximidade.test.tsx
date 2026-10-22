import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Local } from '../../types/Local'
import type { Coordenadas } from '../../services/coordenadasLocais'
import { listarLocais } from '../../services/locais'
import { obterCoordenadasDoLocal } from '../../services/coordenadasLocais'
import Locais from './Locais'

// O vi.mock é içado para o topo: as fábricas só criam funções vazias, e o beforeEach diz o que elas devolvem.
vi.mock('../../services/locais', () => ({ listarLocais: vi.fn() }))
vi.mock('../../services/coordenadasLocais', () => ({ obterCoordenadasDoLocal: vi.fn() }))

// Dados inventados só para o teste: o catálogo real (src/data/coordenadasLocais.ts) não é usado nem alterado.
function criarLocal(id: number, nome: string, categoria: string): Local {
  return {
    id,
    nome,
    endereco: `Rua Sintética, ${id}`,
    categoria,
    tiposAcessibilidade: ['Rampa'],
    descricao: 'Local inventado para o teste',
    notaAcessibilidade: 3,
  }
}

const LOCAL_PERTO = criarLocal(1, 'Biblioteca Sintética Perto', 'Biblioteca')
const LOCAL_NO_LIMITE = criarLocal(2, 'Museu Sintético no Limite', 'Museu')
const LOCAL_LONGE = criarLocal(3, 'Parque Sintético Longe', 'Parque')
const LOCAL_SEM_COORDENADAS = criarLocal(4, 'Praça Sintética sem Coordenadas', 'Praça')
const LOCAIS_SINTETICOS = [LOCAL_PERTO, LOCAL_NO_LIMITE, LOCAL_LONGE, LOCAL_SEM_COORDENADAS]

// Distâncias a partir da POSICAO_SINTETICA (0, 0), pelo cálculo real de calcularDistanciaKm.
const COORDENADAS_SINTETICAS: Record<number, Coordenadas> = {
  1: { latitude: 0.009, longitude: 0 }, // cerca de 1 km
  2: { latitude: 0.04496608029593653, longitude: 0 }, // exatamente 5 km
  3: { latitude: 0.0451, longitude: 0 }, // cerca de 5,01 km
}
const POSICAO_SINTETICA = { latitude: 0, longitude: 0 }

const MENSAGEM_NEGADA =
  'Erro: localização negada. Continue pela busca ou verifique as permissões do navegador.'

type PedidoFalso = {
  sucesso: PositionCallback
  erro?: PositionErrorCallback | null
}

let pedidos: PedidoFalso[] = []

const getCurrentPosition = vi.fn((sucesso: PositionCallback, erro?: PositionErrorCallback | null) => {
  pedidos.push({ sucesso, erro })
})

function criarPosicao(coordenadas: Coordenadas): GeolocationPosition {
  const coords = {
    ...coordenadas,
    accuracy: 10,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    speed: null,
    toJSON: () => ({}),
  }

  return { coords, timestamp: 0, toJSON: () => ({}) }
}

function responderComSucesso(indice: number) {
  act(() => pedidos[indice].sucesso(criarPosicao(POSICAO_SINTETICA)))
}

function responderComErro(indice: number, code: number) {
  const callbackDeErro = pedidos[indice].erro
  if (!callbackDeErro) throw new Error('O pedido foi feito sem callback de erro')
  act(() => callbackDeErro({ code, message: '', PERMISSION_DENIED: 1, POSITION_UNAVAILABLE: 2, TIMEOUT: 3 }))
}

function nomesNaTela() {
  return screen.queryAllByRole('heading', { level: 3 }).map((titulo) => titulo.textContent)
}

async function abrirListagem() {
  const usuario = userEvent.setup()
  render(
    <MemoryRouter>
      <Locais />
    </MemoryRouter>,
  )
  await screen.findByText('4 locais encontrados')
  return usuario
}

async function ligarProximidade() {
  const usuario = await abrirListagem()
  await usuario.click(screen.getByRole('button', { name: 'Usar minha localização' }))
  responderComSucesso(0)
  await usuario.click(screen.getByRole('checkbox', { name: 'Até 5 km de mim' }))
  return usuario
}

beforeEach(() => {
  pedidos = []
  getCurrentPosition.mockClear()
  Object.defineProperty(navigator, 'geolocation', { value: { getCurrentPosition }, configurable: true })
  vi.mocked(listarLocais).mockResolvedValue({ data: LOCAIS_SINTETICOS })
  vi.mocked(obterCoordenadasDoLocal).mockImplementation((local) => COORDENADAS_SINTETICAS[local.id] ?? null)
})

afterEach(() => {
  Object.defineProperty(navigator, 'geolocation', { value: undefined, configurable: true })
})

describe('Locais: pedido de localização', () => {
  it('abrir a listagem não pede a localização e mostra a lista comum', async () => {
    await abrirListagem()

    expect(getCurrentPosition).not.toHaveBeenCalled()
    expect(nomesNaTela()).toHaveLength(4)

    const filtro = screen.getByRole('checkbox', { name: 'Até 5 km de mim' })
    expect(filtro).not.toBeChecked()
    expect(filtro).toBeDisabled()
  })

  it('o botão inicia o pedido e a tela mostra que está obtendo a localização', async () => {
    const usuario = await abrirListagem()

    await usuario.click(screen.getByRole('button', { name: 'Usar minha localização' }))

    expect(getCurrentPosition).toHaveBeenCalledTimes(1)
    expect(screen.getByText('Obtendo sua localização...')).toHaveAttribute('role', 'status')
    expect(screen.getByRole('checkbox', { name: 'Até 5 km de mim' })).toBeDisabled()
    expect(nomesNaTela()).toHaveLength(4)
  })
})

describe('Locais: filtro "Até 5 km de mim"', () => {
  it('mostra os locais até 5 km, inclusive, e tira os mais longe e os sem coordenadas', async () => {
    await ligarProximidade()

    expect(nomesNaTela()).toEqual([LOCAL_PERTO.nome, LOCAL_NO_LIMITE.nome])
    expect(screen.getByText('2 locais encontrados')).toBeInTheDocument()
  })

  it('marcar o filtro não pede a localização de novo, e desmarcar volta a lista comum', async () => {
    const usuario = await ligarProximidade()

    expect(getCurrentPosition).toHaveBeenCalledTimes(1)

    await usuario.click(screen.getByRole('checkbox', { name: 'Até 5 km de mim' }))

    expect(nomesNaTela()).toHaveLength(4)
  })

  it('soma com a busca por nome', async () => {
    const usuario = await ligarProximidade()

    await usuario.type(screen.getByLabelText('Buscar por nome'), 'museu')
    expect(nomesNaTela()).toEqual([LOCAL_NO_LIMITE.nome])

    await usuario.clear(screen.getByLabelText('Buscar por nome'))
    await usuario.type(screen.getByLabelText('Buscar por nome'), 'parque')
    expect(nomesNaTela()).toEqual([])
    expect(screen.getByText('Nenhum local corresponde à pesquisa e aos filtros selecionados.')).toBeInTheDocument()
  })

  it('"Limpar filtros e busca" limpa busca, categoria e recursos, mas mantém a proximidade', async () => {
    const usuario = await ligarProximidade()

    await usuario.type(screen.getByLabelText('Buscar por nome'), 'museu')
    await usuario.selectOptions(screen.getByLabelText('Categoria'), 'Museu')
    await usuario.click(screen.getByRole('checkbox', { name: 'Rampa' }))
    await usuario.click(screen.getByRole('button', { name: 'Limpar filtros e busca (3)' }))

    expect(screen.getByLabelText('Buscar por nome')).toHaveValue('')
    expect(screen.getByLabelText('Categoria')).toHaveValue('')
    expect(screen.getByRole('checkbox', { name: 'Rampa' })).not.toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'Até 5 km de mim' })).toBeChecked()
    expect(nomesNaTela()).toEqual([LOCAL_PERTO.nome, LOCAL_NO_LIMITE.nome])
  })
})

describe('Locais: localização sem resposta pronta', () => {
  it('com a localização negada, mostra o aviso e a busca continua funcionando', async () => {
    const usuario = await abrirListagem()

    await usuario.click(screen.getByRole('button', { name: 'Usar minha localização' }))
    responderComErro(0, 1)

    expect(screen.getByRole('alert')).toHaveTextContent(MENSAGEM_NEGADA)
    expect(screen.getByRole('checkbox', { name: 'Até 5 km de mim' })).toBeDisabled()
    expect(nomesNaTela()).toHaveLength(4)

    await usuario.type(screen.getByLabelText('Buscar por nome'), 'praça')
    expect(nomesNaTela()).toEqual([LOCAL_SEM_COORDENADAS.nome])
  })

  it('indisponível e tempo esgotado mostram avisos de erro diferentes da negação', async () => {
    const usuario = await abrirListagem()
    const botao = screen.getByRole('button', { name: 'Usar minha localização' })

    await usuario.click(botao)
    responderComErro(0, 2)
    const avisoIndisponivel = screen.getByRole('alert').textContent

    await usuario.click(botao)
    responderComErro(1, 3)
    const avisoTempoEsgotado = screen.getByRole('alert').textContent

    expect(avisoIndisponivel?.startsWith('Erro:')).toBe(true)
    expect(avisoTempoEsgotado?.startsWith('Erro:')).toBe(true)
    expect(new Set([avisoIndisponivel, avisoTempoEsgotado, MENSAGEM_NEGADA]).size).toBe(3)
    expect(nomesNaTela()).toHaveLength(4)
  })

  it('pedir de novo com o filtro ligado desliga a proximidade até a nova posição', async () => {
    const usuario = await ligarProximidade()

    await usuario.click(screen.getByRole('button', { name: 'Usar minha localização' }))

    const filtro = screen.getByRole('checkbox', { name: 'Até 5 km de mim' })
    expect(filtro).not.toBeChecked()
    expect(filtro).toBeDisabled()
    expect(nomesNaTela()).toHaveLength(4)

    responderComErro(1, 3)
    expect(nomesNaTela()).toHaveLength(4)
  })
})