import type { Preferencias } from "../types/Preferenciais";

export const CHAVE_PREFERENCIAS = "portal-acessivel:preferencias";

export const PREFERENCIAS_PADRAO: Preferencias = {
  textoGrande: false,
  altoContraste: false,
};

export function lerPreferencias(): Preferencias {
  try {
    // pega as preferencias salvas no navegador
    const salvo = localStorage.getItem(CHAVE_PREFERENCIAS);

    // se não tiver nada salvo, usa as preferencias padrao
    if (!salvo) {
      return PREFERENCIAS_PADRAO;
    }

    // transforma o texto salvo em objeto
    const preferencias = JSON.parse(salvo);

    return {
      textoGrande: preferencias.textoGrande === true,
      altoContraste: preferencias.altoContraste === true,
    };
  } catch {
    // se der erro, usa as preferencias padrao
    return PREFERENCIAS_PADRAO;
  }
}

export function salvarPreferencias(preferencias: Preferencias) {
  try {
    // transforma as preferencias em texto e salva no navegador
    localStorage.setItem(CHAVE_PREFERENCIAS, JSON.stringify(preferencias));
  } catch {
    // se der erro, não quebra o site
  }
}

export function aplicarPreferencias(preferencias: Preferencias) {
  // pega o html da página
  const html = document.documentElement;

  // define se o texto fica grande ou normal
  html.dataset.fonte = preferencias.textoGrande ? "grande" : "normal";

  // define se o contraste fica alto ou normal
  html.dataset.contraste = preferencias.altoContraste ? "alto" : "normal";
}
