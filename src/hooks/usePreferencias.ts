import { useEffect, useState } from "react";
import {
  aplicarPreferencias,
  lerPreferencias,
  salvarPreferencias,
} from "../services/preferencias";
import type { Preferencias } from "../types/Preferenciais";

export function usePreferencias() {
  //pega as preferencias que ja estao salvas
  const [preferencias, setPreferencias] =
    useState<Preferencias>(lerPreferencias());

  useEffect(() => {
    // aplica as preferencias na pagin
    aplicarPreferencias(preferencias);

    //salva as preferencias no navegador
    salvarPreferencias(preferencias);
  }, [preferencias]);

  function alternarTextoGrande() {
    // muda o texto para grande
    setPreferencias({
      ...preferencias,
      textoGrande: !preferencias.textoGrande,
    });
  }

  function alternarAltoContraste() {
    // muda para o alto contraste
    setPreferencias({
      ...preferencias,
      altoContraste: !preferencias.altoContraste,
    });
  }

  return {
    preferencias,
    alternarTextoGrande,
    alternarAltoContraste,
  };
}
