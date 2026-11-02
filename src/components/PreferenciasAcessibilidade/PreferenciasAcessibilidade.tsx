import { usePreferencias } from "../../hooks/usePreferencias";

export default function PreferenciasAcessibilidade() {
  //pega as preferencias e as funcoes para alterar cada opcao
  const { preferencias, alternarTextoGrande, alternarAltoContraste } =
    usePreferencias();

  return (
    <fieldset>
      <legend>Preferências de leitura</legend>

      <label className="flex min-h-[44px] items-center gap-2">
        <input
          type="checkbox"
          checked={preferencias.textoGrande}
          onChange={alternarTextoGrande}
        />
        Texto maior
      </label>

      <label className="flex min-h-[44px] items-center gap-2">
        <input
          type="checkbox"
          checked={preferencias.altoContraste}
          onChange={alternarAltoContraste}
        />
        Alto contraste
      </label>

      <p>Suas escolhas ficam salvas neste navegador.</p>
    </fieldset>
  );
}
