import { useEffect, useState } from "react";
import {
  aplicarPreferencias,
  lerPreferencias,
  salvarPreferencias,
  type Preferencias,
} from "../services/preferencias";

export function usePreferencias() {
  //comeca usando as preferencias que ja estao salvas no navegador
  const [preferencias, setPreferencias] =
    useState<Preferencias>(lerPreferencias());

  useEffect(() => {
    // aplica as mudanças na pag.
    aplicarPreferencias(preferencias);

    // salva a mudanca
    salvarPreferencias(preferencias);
  }, [preferencias]);

  function alternarTextoGrande() {
    setPreferencias({
      ...preferencias,
      textoGrande: !preferencias.textoGrande,
    });
  }

  function alternarAltoContraste() {
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
