import { useState } from 'react';
import { criarLocal } from '../../services/locais';

function Cadastro() {
  const [nome, setNome] = useState('');
  const [endereco, setEndereco] = useState('');
  const [categoria, setCategoria] = useState('');
  const [descricao, setDescricao] = useState('');
  const [acessibilidade, setAcessibilidade] = useState<string[]>([]);
  const [erros, setErros] = useState<string[]>([]);
  const [enviando, setEnviando] = useState(false);
  const [mensagem, setMensagem] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const novosErros: string[] = [];

    if (!nome.trim()) {
      novosErros.push('O nome do local é obrigatório.');
    }

    if (!endereco.trim()) {
      novosErros.push('O endereço é obrigatório.');
    }

    if (!categoria.trim()) {
      novosErros.push('A categoria é obrigatória.');
    }

    if (!descricao.trim()) {
      novosErros.push('A descrição é obrigatória.');
    }

    if (acessibilidade.length === 0) {
      novosErros.push('Selecione pelo menos um tipo de acessibilidade.');
    }

    setErros(novosErros);
    setMensagem('');

    if (novosErros.length > 0) {
      return;
    }

    setEnviando(true);

    const resultado = await criarLocal({
      nome,
      endereco,
      categoria,
      descricao,
      tiposAcessibilidade: acessibilidade,
    });

    setEnviando(false);

    if (resultado.error) {
      setMensagem(resultado.error.message);
      return;
    }

    setMensagem('Local cadastrado com sucesso!');
  }

  return (
    <main>
      <h1>Cadastrar novo local</h1>
      {mensagem && (
        <p role="status">
          {mensagem}
        </p>
      )}

      {erros.length > 0 && (
        <div role="alert">
          <h2>Corrija os seguintes erros:</h2>

          <ul>
            {erros.map((erro) => (
              <li key={erro}>{erro}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="nome">Nome do local</label>

          <input
            id="nome"
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="endereco">Endereço</label>

          <input
            id="endereco"
            type="text"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="categoria">Categoria</label>

          <input
            id="categoria"
            type="text"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="descricao">Descrição</label>

          <textarea
            id="descricao"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
        </div>

        <fieldset>
          <legend>Tipos de acessibilidade</legend>

          <label>
            <input
              type="checkbox"
              value="Cadeira de rodas"
              checked={acessibilidade.includes('Cadeira de rodas')}
              onChange={(e) => {
                if (e.target.checked) {
                  setAcessibilidade([
                    ...acessibilidade,
                    e.target.value,
                  ]);
                } else {
                  setAcessibilidade(
                    acessibilidade.filter(
                      (item) => item !== e.target.value
                    )
                  );
                }
              }}
            />

            Acesso para cadeira de rodas
          </label>

          <label>
            <input
              type="checkbox"
              value="Deficiência visual"
              checked={acessibilidade.includes('Deficiência visual')}
              onChange={(e) => {
                if (e.target.checked) {
                  setAcessibilidade([
                    ...acessibilidade,
                    e.target.value,
                  ]);
                } else {
                  setAcessibilidade(
                    acessibilidade.filter(
                      (item) => item !== e.target.value
                    )
                  );
                }
              }}
            />

            Acessibilidade para deficiência visual
          </label>

          <label>
            <input
              type="checkbox"
              value="Deficiência auditiva"
              checked={acessibilidade.includes('Deficiência auditiva')}
              onChange={(e) => {
                if (e.target.checked) {
                  setAcessibilidade([
                    ...acessibilidade,
                    e.target.value,
                  ]);
                } else {
                  setAcessibilidade(
                    acessibilidade.filter(
                      (item) => item !== e.target.value
                    )
                  );
                }
              }}
            />

            Acessibilidade para deficiência auditiva
          </label>
        </fieldset>

        <button type="submit" disabled={enviando}>
          {enviando ? 'Cadastrando...' : 'Cadastrar local'}
        </button>
      </form>
    </main>
  );
}

export default Cadastro;