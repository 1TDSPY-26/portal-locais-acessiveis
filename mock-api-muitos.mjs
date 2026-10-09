import fs from 'node:fs'

const locais = Array.from({ length: 25 }, (_, i) => ({
  id: String(i + 1),
  nome: `Local ${i + 1}`,
  endereco: `Rua Exemplo, ${i + 1}`,
  categoria: i % 2 === 0 ? 'Restaurante' : 'Parque',
  descricao: 'Descrição do local de teste',
  tiposAcessibilidade: ['Rampa de acesso', 'Sinalização tátil'],
  notaAcessibilidade: 4.5
}))

fs.writeFileSync('./public/locais.json', JSON.stringify(locais, null, 2))
console.log('✅ Mock com 25 locais gerado com sucesso em public/locais.json!')