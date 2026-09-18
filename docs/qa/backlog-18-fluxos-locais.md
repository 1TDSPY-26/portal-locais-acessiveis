# Plano de QA — consulta e cadastro de locais

Issue de QA: #92. Estado: **planejado, execução pendente**. A URL em
`.env.example` é ilustrativa; cenários de rede exigem uma API de teste
confirmada ou uma fixture aprovada. Nenhuma aprovação está implícita.

## Versões a testar

| Trabalho | PR | Branch | Commit de referência |
| --- | --- | --- | --- |
| CardLocal | #99 | `feature/backlog-07-card-local` | `3d70a76` |
| Estados | #100 | `feature/backlog-08-estados` | `57bead7` |
| Campo de pesquisa | #101 | `feature/backlog-09-campo-pesquisa` | `14cfd8e` |
| Filtros | #102 | `feature/backlog-10-filtros-locais` | `bb74f6e` |
| Integração da lista | #103 | `feature/backlog-11-integracao-locais` | `0f64075` |
| Navegação do detalhe | #104 | `feature/backlog-12-navegacao-detalhe` | `9840c8f` |
| Cadastro acessível | #105 | `feature/backlog-13-formulario-acessivel` | `9a03288` |
| Indisponibilidade da API | #109 | `feature/backlog-14-cadastro-api` | `5f369fe` |
| Contrato de dados | #106 | `feature/backlog-15-contrato-api` | `c92f365` |

PR #104 depende do PR #67; PR #105 depende do PR #61; PR #109 depende do PR
#105. O PR #103 inclui os commits dos componentes de CardLocal, pesquisa e
filtros para permitir teste antes dos merges autorizados.

## Preparação

1. Registrar PR, branch, base e `git rev-parse HEAD` antes de cada cenário.
2. Executar `npm ci`, `npm run lint`, `npm run build` e `npm run test -- --run`.
3. Registrar URL e contrato da API de teste; não usar dados pessoais.
4. Abrir a aplicação em desktop e 320 px; registrar navegador e sistema.

## Cenários de consulta

| ID | Ação | Resultado esperado | Encontrado |
| --- | --- | --- | --- |
| L01 | API devolve vários locais. | Cards, endereços e contagem corretos. | Pendente |
| L02 | API devolve lista vazia. | Mensagem de lista vazia, sem estado de erro. | Pendente |
| L03 | API falha. | Mensagem de erro e tentativa de novo carregamento. | Pendente |
| L04 | Local possui campo opcional ausente, se contrato permitir. | Card e detalhe permanecem legíveis. | Pendente |
| L05 | Abrir Ver detalhes de um card. | ID da rota corresponde ao card. | Pendente |
| P01 | Buscar nome completo, parcial e em maiúsculas. | Resultados correspondentes sem diferenciar caixa. | Pendente |
| P02 | Selecionar categoria e recurso juntos. | Apenas locais que atendem aos critérios aparecem. | Pendente |
| P03 | Buscar texto inexistente. | Zero resultados é distinto de falha da API. | Pendente |
| P04 | Limpar pesquisa e filtros. | Lista completa e contagem restauradas. | Pendente |

## Cenários de detalhe e cadastro

| ID | Ação | Resultado esperado | Encontrado |
| --- | --- | --- | --- |
| D01 | Abrir ID válido, inexistente e URL direta. | Detalhe ou erro adequado; breadcrumb e retorno funcionam. | Pendente |
| D02 | Simular falha da API no detalhe. | Erro compreensível sem perda de navegação. | Pendente |
| C01 | Enviar formulário vazio. | Erros por campo; foco no primeiro inválido. | Pendente |
| C02 | Corrigir campo inválido e usar só teclado. | Erro removido e fluxo de foco compreensível. | Pendente |
| C03 | Enviar dados válidos. | Um envio por vez e confirmação após resposta real. | Bloqueado por API |
| C04 | Simular falha de envio. | Mensagem clara e dados preservados. | Bloqueado por API |
| A01 | Repetir busca, filtros, detalhe e formulário em 320 px somente por teclado. | Controles visíveis, foco perceptível e sem rolagem horizontal. | Pendente |

## Registro final

- PR e commit efetivamente testados: a preencher.
- Navegador / sistema / resolução: a preencher.
- Fixture ou API usada: a preencher.
- Evidências e bugs reproduzíveis: a preencher.
- Decisão: **pendente** (`Aprovado`, `Aprovado com ressalva`, `Reprovado` ou `Bloqueado`).
