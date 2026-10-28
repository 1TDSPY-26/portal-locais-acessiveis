import type { Local } from '../../types/Local'

export const locaisDeTeste: Local[] = [
  {
    id: 1,
    nome: 'Biblioteca Central',
    endereco: 'Rua A, 10',
    categoria: 'Cultura',
    tiposAcessibilidade: ['Rampa', 'Elevador'],
    descricao: 'Leitura',
    notaAcessibilidade: 4,
  },
  {
    id: 2,
    nome: 'Parque Verde',
    endereco: 'Rua B, 20',
    categoria: 'Lazer',
    tiposAcessibilidade: ['Rampa'],
    descricao: 'Lazer',
    notaAcessibilidade: 3,
  },
  {
    id: 3,
    nome: 'Centro Cultural Ação',
    endereco: 'Rua C, 30',
    categoria: 'Cultura',
    tiposAcessibilidade: ['Libras'],
    descricao: 'Eventos',
    notaAcessibilidade: 5,
  },
]