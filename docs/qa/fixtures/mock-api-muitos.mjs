import { createServer } from 'node:http'

const mode = process.argv[2] ?? 'success'
const categorias = ['Cultura', 'Lazer', 'Saúde']
const recursos = [['Rampa'], ['Rampa', 'Elevador'], ['Libras'], ['Rampa', 'Libras']]

function criarLocal(numero) {
  return {
    id: numero,
    nome: `Local ${String(numero).padStart(2, '0')}`,
    endereco: `Rua ${numero}, ${numero * 10}`,
    categoria: categorias[numero % 3],
    tiposAcessibilidade: recursos[numero % 4],
    descricao: 'Local gerado para teste',
    notaAcessibilidade: (numero % 5) + 1,
  }
}

const locais = []
for (let numero = 1; numero <= 25; numero++) {
  locais.push(criarLocal(numero))
}

createServer((request, response) => {
  response.setHeader('Access-Control-Allow-Origin', '*')
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  response.setHeader('Content-Type', 'application/json; charset=utf-8')
  if (request.method === 'OPTIONS') { response.writeHead(204).end(); return }
  if (mode === 'error') { response.writeHead(503).end(JSON.stringify({ error:'indisponível' })); return }
  if (request.url === '/locais') {
    response.writeHead(200).end(JSON.stringify(mode === 'empty' ? [] : locais))
    return
  }
  const id = Number(request.url?.match(/^\/locais\/(\d+)$/)?.[1])
  const local = locais.find((item) => item.id === id)
  response.writeHead(local ? 200 : 404).end(JSON.stringify(local ?? { error:'não encontrado' }))
}).listen(4000, '127.0.0.1', () => console.log(`mock-api:${mode}:4000`))
