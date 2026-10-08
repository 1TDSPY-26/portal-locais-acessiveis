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

