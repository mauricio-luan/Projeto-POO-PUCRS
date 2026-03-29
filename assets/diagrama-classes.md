# Diagrama de Classes

Diagrama fiel ao estado atual do código em `src/entities` e ao bootstrap em `app.js`.

```mermaid
classDiagram
direction TB

class Cliente {
  -String nome
  -String documento
  -String tipo
  -Set~String~ veiculos
  +String nome
  +String documento
  +String tipo
  +String[] veiculos
  +constructor(nome, documento, tipo, veiculos)
  +String toString()
  +boolean validaDocumento(doc)
  +boolean cadastrarVeiculo(placa)
  +boolean removerVeiculo(placa)
  +number calcularTarifa(ticket)
}

class Professor {
  +constructor(nome, documento, veiculos)
  +void cadastrarVeiculo(placa)
  +number calcularTarifa(ticket)
}

class Estudante {
  -number saldo
  +number saldo
  +constructor(nome, documento, veiculos, saldo)
  +void adicionaSaldo(valor)
  +number descontarSaldo(valor)
  +boolean creditosNegativos(valor)
  +String toString()
  +void cadastrarVeiculo(placa)
  +number calcularTarifa(ticket)
}

class Empresa {
  -number debitos
  -boolean adimplente
  +number debitos
  +boolean adimplente
  +constructor(nome, documento, veiculos, debitos)
  +boolean estaAdimplente()
  +void imputarDebito(valor)
  +number quitarDebitos(pagamento)
  +String toString()
  +number calcularTarifa(ticket)
}

class Avulso {
  -String[] veiculos
  +constructor(veiculos)
  +number calcularTarifa(ticket)
}

class CadastroCliente {
  -Map~String,Cliente~ clientes
  +Cliente[] clientes
  +number qtdClientes
  +constructor()
  +Cliente|null obterClientePorPlaca(placa)
  +object[] clientesToJSON()
  +boolean cadastrarCliente(cliente)
  +boolean excluirCliente(documentoCliente)
  +Cliente getCliente(documentoCliente)
  +object getClienteComoObjeto(documentoCliente)
  +boolean isEmpty()
}

class TicketEstacionamento {
  -String placa
  -String tipoCliente
  -Date dataHoraEntrada
  -Date dataHoraSaida
  -number qtdDiasUso
  -number valorCobrado
  +constructor(placa, tipoCliente, dataHoraEntrada)
  +String placa
  +String tipoCliente
  +Date dataHoraEntrada
  +Date dataHoraSaida
  +number qtdDiasUso
  +number valorCobrado
  +boolean estaEmAberto()
  +String toString()
}

class RegistroDeEntradasESaidas {
  -CadastroCliente clientes
  -Map~String,TicketEstacionamento~ patio
  -Set~String~ listaNegra
  -TicketEstacionamento[] historicoTickets
  +constructor(cadastroCliente)
  +TicketEstacionamento registraEntrada(placa)
  +TicketEstacionamento registraSaida(placa, pgtoAprovado)
  +Map~String,TicketEstacionamento~ patio
  +Set~String~ listaNegra
  +object[] listaNegraToJSON
  +void reinserePlacaNaListaNegra(placa)
  +void historicoTickets(ticket)
  +object[] historicoTicketsToJSON
  +void reinsereTicketEmAberto(ticket)
  +boolean veiculoEstaEstacionado(placa)
}

class CSV {
  -CadastroCliente clientes
  -RegistroDeEntradasESaidas historicoTickets
  -RegistroDeEntradasESaidas listaNegra
  -String caminhoCSV
  -String caminhoCSVHistoricoTickets
  -String caminhoCSVListaNegra
  -String csv
  -String csvHistoricoTickets
  -String csvListaNegra
  +constructor(cadastroCliente, estacionamento)
  +Promise~String[]~ getCSVClientes()
  +Promise~String[]~ getCSVHistoricoTickets()
  +Promise~String[]~ getCSVListaNegra()
  +Promise~boolean~ geraCSV()
}

class RelatoriosGerenciais {
  -RegistroDeEntradasESaidas registroEntradasESaidas
  -CadastroCliente registroClientes
  +constructor(registroEntradasESaidas, registroClientes)
  +object[] geraRelatorioArrecadacao(dataInicial, dataFinal)
  +object geraSituacaoClienteCadastrado(identificador)
  +String geraHistoricoRegistroEstacionamentoPorCliente(identificador, dataInicial, dataFinal)
  +object geraHistoricoClienteAvulso(placa, dataInicial, dataFinal)
  +void geraRelatorioListaNegra()
  +void geraTop10ClientesFrequentes(ano)
}

class Menu {
  -CadastroCliente cadastroCliente
  -RegistroDeEntradasESaidas registroDeEntradasESaidas
  -CSV CSV
  -RelatoriosGerenciais relatoriosGerenciais
  +constructor(cadastroCliente, registroDeEntradasESaidas, CSV, relatoriosGerenciais)
  +Promise~void~ menu()
  +Promise~void~ cadastrar()
  +void listar()
  +Promise~void~ entrada()
  +Promise~void~ saida()
  +void verPatio()
  +void verListaNegra()
  +Promise~boolean~ salvarClientesCSV()
  +Promise~void~ chamaRelatorioArrecadacao()
  +Promise~void~ chamaRelatorioSituacaoClienteCadastrado()
  +Promise~object~ capturaDatas()
  +Promise~void~ chamaHistoricoRegistroEstacionamentoPorCliente()
}

Cliente <|-- Professor
Cliente <|-- Estudante
Cliente <|-- Empresa

CadastroCliente "1" o-- "*" Cliente : armazena
RegistroDeEntradasESaidas --> "1" CadastroCliente : consulta clientes
RegistroDeEntradasESaidas *-- "*" TicketEstacionamento : historico/patio
RegistroDeEntradasESaidas ..> Avulso : instancia em saida avulsa

Cliente ..> TicketEstacionamento : calcularTarifa(ticket)
Avulso ..> TicketEstacionamento : calcularTarifa(ticket)

CSV --> CadastroCliente : serializa clientes
CSV --> RegistroDeEntradasESaidas : serializa tickets/lista negra

RelatoriosGerenciais --> CadastroCliente : consulta cliente
RelatoriosGerenciais --> RegistroDeEntradasESaidas : consulta patio/historico

Menu --> CadastroCliente : operacoes de cadastro
Menu --> RegistroDeEntradasESaidas : entrada/saida/patio/lista negra
Menu --> CSV : persistencia
Menu --> RelatoriosGerenciais : relatorios
```

## Observações de fidelidade

- `Avulso` não herda de `Cliente`; ele só é instanciado por `RegistroDeEntradasESaidas` para calcular tarifa de saída avulsa.
- A lista negra não é modelada como coleção de clientes. No código, ela é um `Set<String>` de placas dentro de `RegistroDeEntradasESaidas`.
- O bootstrap em `app.js` instancia `CadastroCliente`, `RegistroDeEntradasESaidas`, `CSV`, `RelatoriosGerenciais` e `Menu`, depois reidrata clientes, tickets e lista negra a partir dos CSVs.
- `TicketEstacionamento` calcula `qtdDiasUso` internamente ao definir `dataHoraSaida`.
- `RelatoriosGerenciais` possui dois métodos ainda sem implementação: `geraRelatorioListaNegra()` e `geraTop10ClientesFrequentes(ano)`.

## Referências principais

- [app.js](/home/luan/Projects/projeto-fase1-POO/app.js)
- [Cliente.js](/home/luan/Projects/projeto-fase1-POO/src/entities/cliente/Cliente.js)
- [Professor.js](/home/luan/Projects/projeto-fase1-POO/src/entities/cliente/Professor.js)
- [Estudante.js](/home/luan/Projects/projeto-fase1-POO/src/entities/cliente/Estudante.js)
- [Empresa.js](/home/luan/Projects/projeto-fase1-POO/src/entities/cliente/Empresa.js)
- [Avulso.js](/home/luan/Projects/projeto-fase1-POO/src/entities/cliente/Avulso.js)
- [CadastroCliente.js](/home/luan/Projects/projeto-fase1-POO/src/entities/cliente/CadastroCliente.js)
- [TicketEstacionamento.js](/home/luan/Projects/projeto-fase1-POO/src/entities/estacionamento/TicketEstacionamento.js)
- [RegistroDeEntradasESaidas.js](/home/luan/Projects/projeto-fase1-POO/src/entities/estacionamento/RegistroDeEntradasESaidas.js)
- [CSV.js](/home/luan/Projects/projeto-fase1-POO/src/entities/csv/CSV.js)
- [RelatoriosGerenciais.js](/home/luan/Projects/projeto-fase1-POO/src/entities/relatorio/RelatoriosGerenciais.js)
- [Menu.js](/home/luan/Projects/projeto-fase1-POO/src/entities/menu/Menu.js)
