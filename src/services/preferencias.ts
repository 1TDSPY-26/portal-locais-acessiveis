//preferecias de acessibilidade
export type Preferencias = {
  textoGrande: boolean;
  altoContraste: boolean;
};

//nome q vai ser usado p salvar as preferencias no navegador
export const CHAVE_PREFERENCIAS = "portal-acessivel:preferencias";

//valores iniciais
export const PREFERENCIAS_PADRAO: Preferencias = {
  textoGrande: false,
  altoContraste: false,
};

export function lerPreferencias(): Preferencias {
  try {
    //pega as preferencias salvas no localstorage
    const salvo = localStorage.getItem(CHAVE_PREFERENCIAS);

    //se n tiver nada salvo, usa os valores padrao
    if (!salvo) {
      return PREFERENCIAS_PADRAO;
    }

    //texto == obj
    const preferencias = JSON.parse(salvo);

    //so aceita true como opcao ativada
    return {
      textoGrande: preferencias.textoGrande === true,
      altoContraste: preferencias.altoContraste === true,
    };
  } catch {
    //se der algm erro qnd acessar ou ler o localstorage, usa o padrao
    return PREFERENCIAS_PADRAO;
  }
}

export function salvarPreferencias(preferencias: Preferencias) {
  try {
    // transforma as preferências em texto e salva no navegador
    localStorage.setItem(CHAVE_PREFERENCIAS, JSON.stringify(preferencias));
  } catch {
    // se o navegador não deixar salvar, não quebra o site
  }
}

export function aplicarPreferencias(preferencias: Preferencias) {
  // html == atributos de acessibilidade
  const html = document.documentElement;

  //data-fonte == escolha do usuario
  html.dataset.fonte = preferencias.textoGrande ? "grande" : "normal";

  //data-contraste == escolha do usuario
  html.dataset.contraste = preferencias.altoContraste ? "alto" : "normal";
}
