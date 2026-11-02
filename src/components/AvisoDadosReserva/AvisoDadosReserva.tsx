
export const AVISO_DADOS_RESERVA =
    'Aviso: estes locais vêm do servidor de reserva, usado em testes, porque o endereço oficial dos dados não foi configurado. As informações podem estar incompletas ou desatualizadas: confirme com o local antes de ir.'

export default function AvisoDadosReserva() {
    return (
        <p
            id="aviso-dados-reserva"
            role="note"
            className="rounded-md border border-yellow-500 bg-yellow-50 p-4 text-yellow-900"
        >
            {AVISO_DADOS_RESERVA}
        </p>
    )
}
