import type { Local } from "../types/Local";
import { normalizarNota } from "./nota";

export type ErrosLocal = {
  nome?: string;
  endereco?: string;
  categoria?: string;
  descricao?: string;
  tiposAcessibilidade?: string;
  notaAcessibilidade?: string;
};

const TAMANHO_MAXIMO_DESCRICAO = 500;

function estaVazio(texto: string) {
  return texto.trim() === "";
}

function validarDescricao(descricao: string) {
  if (estaVazio(descricao)) return "Escreva uma breve descrição do local.";
  if (descricao.length > TAMANHO_MAXIMO_DESCRICAO)
    return "A descrição pode ter no máximo 500 caracteres.";
  return undefined;
}

function ehNotaValida(nota: number | null) {
  return normalizarNota(nota) !== null;
}

export function validarLocal(dados: Local) {
  const erros: ErrosLocal = {};
  const erroDescricao = validarDescricao(dados.descricao);

  if (dados.nome.trim().length < 3)
    erros.nome = "Informe o nome do local com pelo menos 3 letras.";
  if (estaVazio(dados.endereco))
    erros.endereco = "Informe o endereço. Exemplo: Rua das Flores, 100.";
  if (estaVazio(dados.categoria))
    erros.categoria = "Informe a categoria. Exemplo: Cultura.";
  if (erroDescricao) erros.descricao = erroDescricao;
  if (dados.tiposAcessibilidade.length === 0)
    erros.tiposAcessibilidade =
      "Selecione pelo menos um recurso de acessibilidade.";
  if (!ehNotaValida(dados.notaAcessibilidade))
    erros.notaAcessibilidade = "Escolha uma nota de 1 a 5.";

  return erros;
}

export function primeiroCampoComErro(erros: ErrosLocal) {
  return Object.keys(erros)[0];
}