import { usePreferencias } from "../../hooks/usePreferencias";

export default function PreferenciasAcessibilidade() {
  const { preferencias, alternarTextoGrande, alternarAltoContraste } =
    usePreferencias();

  return (
    <fieldset>
      <legend>Preferências de leitura</legend>

      <label>
        <input
          type="checkbox"
          checked={preferencias.textoGrande}
          onChange={alternarTextoGrande}
        />
        Texto maior
      </label>

      <label>
        <input
          type="checkbox"
          checked={preferencias.altoContraste}
          onChange={alternarAltoContraste}
        />
        Contraste
      </label>
    </fieldset>
  );
}
