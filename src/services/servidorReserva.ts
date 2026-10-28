
export function ehEnderecoVazio(valor: unknown): boolean {
    if (typeof valor !== 'string') {
        return true
    }

    return valor.trim() === ''
}

export function estaUsandoServidorReserva(): boolean {
    return ehEnderecoVazio(import.meta.env.VITE_API_URL)
}
