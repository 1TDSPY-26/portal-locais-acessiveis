import type { CoordenadaVerificada } from '../services/coordenadasLocais'

export const COORDENADAS_LOCAIS: CoordenadaVerificada[] = [
  // Coordenadas conferidas no OpenStreetMap. Fontes e passo a passo em docs/coordenadas-locais.md.
  {
    idLocal: 1,
    enderecoVerificado: 'Rua da Consolação, 94 - São Paulo',
    latitude: -23.5473897,
    longitude: -46.6421048,
    fonte: 'https://www.openstreetmap.org/way/48661210',
    dataVerificacao: '2026-10-17',
  },
  {
    idLocal: 2,
    enderecoVerificado: 'Av. Pedro Álvares Cabral - São Paulo',
    latitude: -23.5877126,
    longitude: -46.6585214,
    fonte: 'https://www.openstreetmap.org/way/125450993',
    dataVerificacao: '2026-10-17',
  },
  {
    idLocal: 3,
    enderecoVerificado: 'Praça da Luz - São Paulo',
    latitude: -23.5349655,
    longitude: -46.6350987,
    fonte: 'https://www.openstreetmap.org/way/191591082',
    dataVerificacao: '2026-10-17',
  },
  {
    idLocal: 4,
    enderecoVerificado: 'Rua Vergueiro, 1000 - São Paulo',
    latitude: -23.5715436,
    longitude: -46.6400111,
    fonte: 'https://www.openstreetmap.org/node/4599903700',
    dataVerificacao: '2026-10-17',
  },
  {
    idLocal: 5,
    enderecoVerificado: 'Praça da Liberdade - São Paulo',
    latitude: -23.554974,
    longitude: -46.6354952,
    fonte: 'https://www.openstreetmap.org/way/237212801',
    dataVerificacao: '2026-10-17',
  },
]