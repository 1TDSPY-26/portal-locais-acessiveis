import { beforeEach, describe, expect, it } from "vitest";
import {
  CHAVE_PREFERENCIAS,
  PREFERENCIAS_PADRAO,
  aplicarPreferencias,
  lerPreferencias,
  salvarPreferencias,
} from "./preferencias";

describe("preferências de acessibilidade", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("devolve o padrão quando nada foi salvo", () => {
    expect(lerPreferencias()).toEqual(PREFERENCIAS_PADRAO);
  });

  it("salva e lê de volta", () => {
    salvarPreferencias({ textoGrande: true, altoContraste: false });

    expect(lerPreferencias()).toEqual({
      textoGrande: true,
      altoContraste: false,
    });
  });

  it("ignora um valor salvo corrompido", () => {
    localStorage.setItem(CHAVE_PREFERENCIAS, "{quebrado");

    expect(lerPreferencias()).toEqual(PREFERENCIAS_PADRAO);
  });

  it("aplica os atributos no <html>", () => {
    aplicarPreferencias({ textoGrande: true, altoContraste: true });

    expect(document.documentElement.dataset.fonte).toBe("grande");
    expect(document.documentElement.dataset.contraste).toBe("alto");
  });
});
