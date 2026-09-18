# Plano de QA — rotas, navegação e teclado

Issue de QA: #91. Estado: **planejado, execução pendente**. Este documento não
registra aprovação. O QA deve preencher resultados após revisão técnica dos PRs.

## Versões a testar

| Item do backlog | PR | Branch | Commit de referência |
| --- | --- | --- | --- |
| 01 Rotas | #93 | `feature/backlog-01-rotas` | `0708bc9` |
| 02 Rodapé | #94 | `feature/backlog-02-footer` | `7e4dcb4` |
| 03 Menu ativo | #95 | `feature/backlog-03-menu-ativo` | `2ca4ac0` |
| 04 Sobre | #96 | `feature/backlog-04-pagina-sobre` | `9b6b603` |
| 05 Acessibilidade | #97 | `feature/backlog-05-pagina-acessibilidade` | `71a3633` |
| 06 Menu móvel | #98 | `feature/backlog-06-menu-responsivo` | `a296129` |
| 16 Link de salto | #107 | `feature/backlog-16-skip-link` | `a707ebc` |

Os PRs #94, #95, #97 e #98 têm bases de feature por dependência. Registrar a
base e o commit exatos antes de cada execução; repetir o ciclo após os merges
autorizados no futuro.

## Preparação

1. Fazer checkout limpo da branch e anotar `git rev-parse HEAD`.
2. Executar `npm ci`, `npm run lint` e `npm run build`.
3. Iniciar `npm run dev` e anotar navegador, sistema, resolução e zoom.
4. Registrar captura ou vídeo sem dados pessoais.

## Cenários

| ID | Ação | Resultado esperado | Encontrado |
| --- | --- | --- | --- |
| R01 | Abrir `/`, `/locais`, `/cadastro`, `/sobre` e `/acessibilidade` por links. | Cada rota mostra a página correspondente; Header e Footer aparecem uma vez. | Pendente |
| R02 | Abrir as mesmas URLs diretamente e atualizar a página. | Página permanece acessível. | Pendente |
| R03 | Abrir `/pagina-que-nao-existe`. | Página 404 aparece dentro do layout. | Pendente |
| N01 | Navegar com Tab, Shift+Tab e Enter. | Foco visível, ordem lógica e links funcionais. | Pendente |
| N02 | Visitar cada rota principal. | Um link do menu recebe `aria-current="page"` e borda ativa. | Pendente |
| N03 | Abrir e fechar menu móvel com teclado; selecionar rota; pressionar Escape. | Estado `aria-expanded` correto, menu fecha e foco retorna ao botão no Escape. | Pendente |
| N04 | Ativar “Ir para o conteúdo” no primeiro Tab. | Foco vai para um único `main`. | Pendente |
| F01 | Abrir links institucionais do rodapé. | Nenhum leva à 404. | Pendente |
| V01 | Conferir 320 px, 768 px e largura de desktop. | Sem perda de links ou rolagem horizontal causada pelo cabeçalho. | Pendente |
| V02 | Conferir zoom de 200%. | Conteúdo principal e controles permanecem utilizáveis. | Pendente |

## Registro final

- Navegador / sistema / resolução: a preencher.
- PR e commit efetivamente testados: a preencher.
- Evidências: a preencher.
- Defeitos e passos de reprodução: a preencher.
- Decisão: **pendente** (`Aprovado`, `Aprovado com ressalva`, `Reprovado` ou `Bloqueado`).
