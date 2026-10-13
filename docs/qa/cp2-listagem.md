## Cenários executados
 
| ID | Esperado | Encontrado | Resultado | Evidência |
|---|---|---|---|---|
| B01 | Buscar "Local 01" retorna 1 resultado e atualiza o contador | 1 resultado e contador atualizado | Passou | evidencias/evidencias-b01.png |
| B02 | Buscar "local" em minúsculas retorna todos os locais | Todos os 25 locais listados | Passou | evidencias/evidencias-b02.png |
| B03 | Buscar "bibliotéca" (mock original) encontra "Biblioteca Central" | "Biblioteca Central" encontrada | Passou | evidencias/evidencias-b03.png |
| B04 | Buscar "xyz" mostra mensagem de nenhum resultado, diferente da de lista vazia | Mensagem de nenhum resultado, diferente da de lista vazia | Passou | evidencias/evidencias-b04.png e evidencias/evidencias-e02.png |
| B05 | "Limpar busca" restaura a lista e leva o foco ao campo | Lista completa restaurada e foco no campo de busca | Passou | evidencias/evidencias-b05-pt1.png e evidencias/evidencias-b05-pt2.png |
| F01 | Categoria "Cultura" mostra só locais de Cultura | 8 locais, todos de Cultura | Passou | evidencias/evidencias-f01.png |
| F02 | Cultura + Libras mostra só locais com as duas condições | Apenas locais com Cultura e Libras | Passou | evidencias/evidencias-f02.png |
| F03 | Busca + categoria juntas respeitam as duas | Resultado respeita busca e categoria | Passou | evidencias/evidencias-f03.png |
| F04 | "Limpar filtros e busca" volta tudo ao inicial | Campo vazio, filtros zerados e lista completa | Passou | evidencias/evidencias-f04-pt1.png e evidencias/evidencias-f04-pt2.png |
| F05 | Todos os controles funcionam só com teclado | Todos os controles operados com Tab, Espaço e setas | Passou | evidencias/evidencias-f05.mp4 |
| P01 | 25 locais: "Mostrando 1–9 de 25 locais" e botões 1, 2 e 3 | Não executado | Bloqueado | #125 sem PR |
| P02 | "Próxima" leva à página 2 e a página atual tem aria-current="page" | Não executado | Bloqueado | #125 sem PR |
| P03 | Na página 1, "Anterior" fica desabilitado | Não executado | Bloqueado | #125 sem PR |
| P04 | Filtrar estando na página 3 volta para a página 1 | Não executado | Bloqueado | #125 sem PR |
| P05 | Ordenar de Z a A mostra "Local 25" primeiro | Não há seletor de ordenação na tela; lista fixa de Local 01 em diante | Falhou | evidencias/evidencias-p05.png |
| P06 | Filtros aplicados ao copiar a URL e abrir em outra aba | Com "Cultura" selecionada (8 locais), a URL permanece `/locais`, sem `?categoria=...`; a outra aba abre sem filtro | Falhou | evidencias/evidencias-p06.png |
| P07 | Filtros preservados ao abrir um detalhe e voltar | Ao abrir o detalhe e voltar, os filtros são excluídos | Falhou | evidencias/evidencias-p07.mp4 |
| E01 | Modo success: lista aparece e "Carregando..." some | Lista com 25 locais e "Carregando..." removido | Passou | evidencias/evidencias-e01.mp4 |
| E02 | Modo empty: mensagem de lista vazia | "Nenhum local cadastrado até o momento." | Passou | evidencias/evidencias-e02-terminal.png e evidencias/evidencias-e02-web.png |
| E03 | Modo error: mensagem de erro e botão "Tentar novamente" | Alerta "Erro na requisição" e botão "Tentar novamente" | Passou | evidencias/evidencias-e03-terminal.png e evidencias/evidencias-e03-web.png |
| E04 | Após reiniciar o mock em success, "Tentar novamente" carrega a lista | Lista carregada após o clique | Passou | evidencias/evidencias-e04-terminal.png e evidencias/evidencias-e04-web.mp4 |
| E05 | Contador com `role="status"` e erro com `role="alert"` | Contador com `role="status"` e erro com `role="alert"` | Passou | evidencias/evidencias-e05.png |
| A01 | `npm run test -- --run src/tests/qa/locais-estados.test.tsx` passa | 2 testes passando (lista vazia sem erro; falha da API com "Tentar novamente") | Passou | evidencias/evidencias-a01.png |
 