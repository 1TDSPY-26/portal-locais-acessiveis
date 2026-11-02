import { describe, it, expect, vi } from "vitest";
import { render, screen } from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import HistoricoPesquisas from "./HistoricoPesquisas";

describe('HistoricoPesquisas', () => {
  it('Não renderiza nada se a lista de pesquisas estiver vazia', () => {
    const { container } = render(
      <HistoricoPesquisas pesquisas={[]} onSelecionar={() => {}}/>
    );
    expect(container.firstChild).toBeNull();
  });

  it('Renderiza a lista de botões de histórico corretamente', () => {
    const pesquisas = ['biblioteca', 'museu'];
    render(
      <HistoricoPesquisas pesquisas={pesquisas} onSelecionar={() => {}}/>
    );

    const botoes = screen.getAllByRole('button');
    expect(botoes).toHaveLength(2);
    expect(screen.getByRole('button', { name: 'biblioteca' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'museu' })).toBeInTheDocument();
  });

  it('Chama a função onSelecionar com o texto correto ao clicar em um item do histórico', async () => {
    const onSelecionarMock = vi.fn();
    const pesquisas = ['biblioteca', 'museu'];

    render(
      <HistoricoPesquisas pesquisas={pesquisas} onSelecionar={onSelecionarMock}/>
    );

    const botaoBiblioteca = screen.getByRole('button', { name: 'biblioteca'});
    await userEvent.click(botaoBiblioteca);

    expect(onSelecionarMock).toHaveBeenCalledTimes(1);
    expect(onSelecionarMock).toHaveBeenCalledWith('biblioteca');
  });

  it('Não exibe o botão de limpar quando onLimpar não é informado', () => {
    render(
      <HistoricoPesquisas pesquisas={['biblioteca']} onSelecionar={() => {}}/>
    );

    expect(
      screen.queryByRole('button', {
        name: 'Limpar histórico de pesquisas',
      })
    ).not.toBeInTheDocument();
  });

  it('Chama onLimpar ao clicar no botão de limpar histórico', async () => {
    const onLimparMock = vi.fn();

    render(
      <HistoricoPesquisas
        pesquisas={['biblioteca']}
        onSelecionar={() => {}}
        onLimpar={onLimparMock}
      />
    );

    await userEvent.click(
      screen.getByRole('button', {
        name: 'Limpar histórico de pesquisas',
      })
    );

    expect(onLimparMock).toHaveBeenCalledTimes(1);
  });
});