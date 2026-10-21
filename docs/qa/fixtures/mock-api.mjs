import { createServer } from 'node:http'

const mode = process.argv[2] ?? 'success'
const locais = [
  { id:1, nome:'Biblioteca Central', endereco:'Rua A, 10', categoria:'Cultura', tiposAcessibilidade:['Rampa','Elevador'], descricao:'Espaço de leitura', notaAcessibilidade:4 },
  { id:2, nome:'Parque Verde', endereco:'Rua B, 20', categoria:'Lazer', tiposAcessibilidade:['Rampa'], descricao:'Área de lazer', notaAcessibilidade:3 },
  { id:3, nome:'Centro Cultural', endereco:'Rua C, 30', categoria:'Cultura', tiposAcessibilidade:['Libras'], descricao:'Eventos culturais', notaAcessibilidade:5 },
]

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
