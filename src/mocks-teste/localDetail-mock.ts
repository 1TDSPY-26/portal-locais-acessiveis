import type { Local } from "../types/Local";

export const localMockCompleto: Local = {
  id: 1,
  nome: "Praça Central",
  endereco: "Av. Principal, 100 - Centro",
  categoria: "Lazer",
  tiposAcessibilidade: ["rampa", "piso tátil", "banheiro adaptado"],
  descricao: "Espaço público amplo com rampas de acesso, piso tátil em 0todo o percurso e banheiro adaptado.",
  notaAcessibilidade: 4.5,
};

export const localMockSemAcessibilidade: Local = {
  id: 2,
  nome: "Museu Histórico",
  endereco: "Rua das Artes, 200",
  categoria: "Cultura",
  tiposAcessibilidade: [],
  descricao: "Museu com acervo histórico da cidade.",
  notaAcessibilidade: 2.0,
};