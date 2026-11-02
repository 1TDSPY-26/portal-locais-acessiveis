
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { criarLocal } from '../../services/locais'
import Cadastro from './Cadastro'

vi.mock('../../services/locais')

const museu = {
    id: 10,
    nome: 'Museu Aberto',
    endereco: 'Rua A, 1',
    categoria: 'Cultura',
    descricao: 'Museu com rampa',
    tiposAcessibilidade: ['Rampa'],
    notaAcessibilidade: 4,
}

const erroApi = {
    error: {
        message: 'Erro na requisição',
        status: 500,
    },
}

async function preencherFormulario(
    usuario: ReturnType<typeof userEvent.setup>,
) {
    await usuario.type(
        screen.getByLabelText(/nome do local/i),
        museu.nome,
    )
    await usuario.type(
        screen.getByLabelText(/endereço/i),
        museu.endereco,
    )
    await usuario.type(
        screen.getByLabelText(/categoria/i),
        museu.categoria,
    )
    await usuario.type(
        screen.getByLabelText(/^descrição/i),
        museu.descricao,
    )
    await usuario.click(screen.getByLabelText('Rampa'))
    await usuario.selectOptions(
        screen.getByLabelText(/nota de acessibilidade/i),
        '4',
    )
}

function renderizarCadastro() {
    render(
        <MemoryRouter>
            <Cadastro />
        </MemoryRouter>,
    )
}

async function enviarCadastro(
    usuario: ReturnType<typeof userEvent.setup>,
) {
    await usuario.click(
        screen.getByRole('button', { name: /cadastrar local/i }),
    )
}

describe('Foco após cadastro', () => {
    beforeEach(() => {
        vi.resetAllMocks()
    })

    it('não move o foco ao abrir a página', () => {
        renderizarCadastro()

        expect(document.body).toHaveFocus()
        expect(screen.queryByRole('status')).not.toBeInTheDocument()
        expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })

    it('leva o foco para a mensagem de sucesso depois de cadastrar', async () => {
        vi.mocked(criarLocal).mockResolvedValue({ data: museu })

        const usuario = userEvent.setup()
        renderizarCadastro()

        await preencherFormulario(usuario)
        await enviarCadastro(usuario)

        const mensagem = await screen.findByRole('status')

        await waitFor(() => expect(mensagem).toHaveFocus())

        expect(mensagem).toHaveAttribute('tabindex', '-1')
        expect(mensagem).toHaveTextContent('Museu Aberto')
        expect(criarLocal).toHaveBeenCalledTimes(1)
    })

    it('o próximo Tab depois do sucesso vai para o link do local', async () => {
        vi.mocked(criarLocal).mockResolvedValue({ data: museu })

        const usuario = userEvent.setup()
        renderizarCadastro()

        await preencherFormulario(usuario)
        await enviarCadastro(usuario)

        const mensagem = await screen.findByRole('status')

        await waitFor(() => expect(mensagem).toHaveFocus())

        await usuario.tab()

        const link = screen.getByRole('link', {
            name: /ver local cadastrado/i,
        })

        await waitFor(() => expect(link).toHaveFocus())
    })

    it('leva o foco para a mensagem de erro quando o cadastro falha', async () => {
        vi.mocked(criarLocal).mockResolvedValue(erroApi)

        const usuario = userEvent.setup()
        renderizarCadastro()

        await preencherFormulario(usuario)
        await enviarCadastro(usuario)

        const mensagem = await screen.findByRole('alert')

        await waitFor(() => expect(mensagem).toHaveFocus())

        expect(mensagem).toHaveAttribute('tabindex', '-1')
        expect(mensagem).toHaveTextContent(
            'Não foi possível cadastrar',
        )
        expect(screen.getByLabelText(/nome do local/i)).toHaveValue(
            'Museu Aberto',
        )
    })

    it('leva o foco para o erro de novo quando o segundo envio falha', async () => {
        vi.mocked(criarLocal).mockResolvedValue(erroApi)

        const usuario = userEvent.setup()
        renderizarCadastro()

        await preencherFormulario(usuario)
        await enviarCadastro(usuario)

        const primeiraMensagem = await screen.findByRole('alert')

        await waitFor(() =>
            expect(primeiraMensagem).toHaveFocus(),
        )

        await enviarCadastro(usuario)

        await waitFor(() =>
            expect(criarLocal).toHaveBeenCalledTimes(2),
        )

        const segundaMensagem = await screen.findByRole('alert')

        await waitFor(() =>
            expect(segundaMensagem).toHaveFocus(),
        )
    })

    it('leva o foco para o sucesso depois de um erro', async () => {
        vi.mocked(criarLocal)
            .mockResolvedValueOnce(erroApi)
            .mockResolvedValueOnce({ data: museu })

        const usuario = userEvent.setup()
        renderizarCadastro()

        await preencherFormulario(usuario)
        await enviarCadastro(usuario)

        const mensagemErro = await screen.findByRole('alert')

        await waitFor(() =>
            expect(mensagemErro).toHaveFocus(),
        )

        await enviarCadastro(usuario)

        const mensagemSucesso = await screen.findByRole('status')

        await waitFor(() =>
            expect(mensagemSucesso).toHaveFocus(),
        )

        expect(screen.queryByRole('alert')).not.toBeInTheDocument()
        expect(criarLocal).toHaveBeenCalledTimes(2)
    })

    it('erro de validação não chama o serviço nem move o foco para mensagens', async () => {
        const usuario = userEvent.setup()
        renderizarCadastro()

        await enviarCadastro(usuario)

        const nome = screen.getByRole('textbox', {
            name: /nome do local/i,
        })

        await waitFor(() => expect(nome).toHaveFocus())

        expect(criarLocal).not.toHaveBeenCalled()
        expect(screen.queryByRole('status')).not.toBeInTheDocument()
        expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })
})
