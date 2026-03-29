# Diagrama de Classes

Diagrama de classes fiel ao estado atual do código da aplicação.

```mermaid
classDiagram
direction TB

class Cliente {
  <<abstract>>
  -String #nome
  -String #documento
  -String #tipo
  -Set~String~ #veiculos
  +String nome
  +String documento
  +String tipo
  +String[] veiculos
  +toString() String
  +validaDocumento(doc) boolean
  +cadastrarVeiculo(placa) boolean
  +removerVeiculo(placa) boolean
  +calcularTarifa(ticket) number
}

class Professor {
  +constructor(nome, documento, veiculos)
  +cadastrarVeiculo(placa) void
  +calcularTarifa(ticket) number
}

class Estudante {
  -number #saldo
  +constructor(nome, documento, veiculos, saldo)
  +number saldo
  +adicionaSaldo(valor) void
  +descontarSaldo(valor) number
  +creditosNegativos(valor) boolean
  +toString() String
  +cadastrarVeiculo(placa) void
  +calcularTarifa(ticket) number
}

class Empresa {
  -number #debitos
  -boolean #adimplente
  +constructor(nome, documento, veiculos, debitos)
  +number debitos
  +boolean adimplente
  +estaAdimplente() boolean
  +imputarDebito(valor) void
  +quitarDebitos(pagamento) number|void
  +toString() String
  +calcularTarifa(ticket) number
}

class Avulso {
  -String[] #veiculos
  +constructor(veiculos)
  +calcularTarifa(ticket) number
}

class CadastroCliente {
  -Map~String, Cliente~ #clientes
  +constructor()
  +obterClientePorPlaca(placa) Cliente|null
  +Cliente[] clientes
  +number qtdClientes
  +clientesToJSON() object[]
  +cadastrarCliente(cliente) boolean
  +excluirCliente(documentoCliente) boolean
  +getCliente(documentoCliente) Cliente|undefined
  +getClienteComoObjeto(documentoCliente) object
  +isEmpty() boolean
}

class TicketEstacionamento {
  -String #placa
  -String #tipoCliente
  -Date #dataHoraEntrada
  -Date #dataHoraSaida
  -number #qtdDiasUso
  -number #valorCobrado
  +constructor(placa, tipoCliente, dataHoraEntrada)
  +String placa
  +String tipoCliente
  +Date dataHoraEntrada
  +Date dataHoraSaida
  +number qtdDiasUso
  +number valorCobrado
  +dataHoraSaida(data) void
  +qtdDiasUso(dias) void
  +estaEmAberto() boolean
  +toString() String
}

class RegistroDeEntradasESaidas {
  -CadastroCliente #clientes
  -Map~String, TicketEstacionamento~ #patio
  -Set~String~ #listaNegra
  -TicketEstacionamento[] #historicoTickets
  +constructor(cadastroCliente)
  +registraEntrada(placa) TicketEstacionamento
  +registraSaida(placa, pgtoAprovado) TicketEstacionamento
  +Map patio
  +Set listaNegra
  +listaNegraToJSON() object[]
  +historicoTickets(ticket) void
  +historicoTicketsToJSON() object[]
  +reinsereTicketEmAberto(ticket) void
  +reinserePlacaNaListaNegra(placa) void
  +veiculoEstaEstacionado(placa) boolean
}

class CSV {
  -CadastroCliente #clientes
  -RegistroDeEntradasESaidas #historicoTickets
  -RegistroDeEntradasESaidas #listaNegra
  -String #caminhoCSV
  -String #caminhoCSVHistoricoTickets
  -String #caminhoCSVListaNegra
  -String #csv
  -String #csvHistoricoTickets
  -String #csvListaNegra
  +constructor(cadastroCliente, estacionamento)
  +getCSVClientes() Promise~String[]~
  +getCSVHistoricoTickets() Promise~String[]~
  +getCSVListaNegra() Promise~String[]~
  +geraCSV() Promise~boolean~
}

class RelatoriosGerenciais {
  -RegistroDeEntradasESaidas #registroEntradasESaidas
  -CadastroCliente #registroClientes
  +constructor(registroEntradasESaidas, registroClientes)
  +geraRelatorioArrecadacao(dataInicial, dataFinal) object[]
  +geraSituacaoClienteCadastrado(identificador) object
  +geraHistoricoRegistroEstacionamentoPorCliente(identificador, dataInicial, dataFinal) String
  +geraHistoricoClienteAvulso(placa, dataInicial, dataFinal) object
  +geraRelatorioListaNegra() void
  +geraTop10ClientesFrequentes(ano) void
}

class Menu {
  -CadastroCliente #cadastroCliente
  -RegistroDeEntradasESaidas #registroDeEntradasESaidas
  -CSV #CSV
  -RelatoriosGerenciais #relatoriosGerenciais
  +constructor(cadastroCliente, registroDeEntradasESaidas, CSV, relatoriosGerenciais)
  +menu() Promise~void~
  +cadastrar() Promise~void~
  +listar() void
  +entrada() Promise~void~
  +saida() Promise~void~
  +verPatio() void
  +verListaNegra() void
  +salvarClientesCSV() Promise~boolean~
  +chamaRelatorioArrecadacao() Promise~void~
  +chamaRelatorioSituacaoClienteCadastrado() Promise~void~
  +capturaDatas() Promise~object~
  +chamaHistoricoRegistroEstacionamentoPorCliente() Promise~void~
}

Cliente <|-- Professor
Cliente <|-- Estudante
Cliente <|-- Empresa

CadastroCliente o-- "0..*" Cliente : armazena
RegistroDeEntradasESaidas --> CadastroCliente : consulta clientes
RegistroDeEntradasESaidas *-- "0..*" TicketEstacionamento : historico
RegistroDeEntradasESaidas *-- "0..*" TicketEstacionamento : patio
RegistroDeEntradasESaidas ..> Avulso : cria na saida avulsa

Cliente ..> TicketEstacionamento : calcularTarifa
Avulso ..> TicketEstacionamento : calcularTarifa

CSV --> CadastroCliente : serializa clientes
CSV --> RegistroDeEntradasESaidas : serializa tickets/lista negra

RelatoriosGerenciais --> CadastroCliente : consulta cadastro
RelatoriosGerenciais --> RegistroDeEntradasESaidas : consulta patio/historico

Menu --> CadastroCliente
Menu --> RegistroDeEntradasESaidas
Menu --> CSV
Menu --> RelatoriosGerenciais
```

## Observações

- O diagrama representa apenas classes reais do código atual. `app.js` foi omitido porque faz a orquestração via funções, não por classe.
- `Avulso` não herda de `Cliente`; ele é um tipo independente usado pontualmente em `RegistroDeEntradasESaidas`.
- `TicketEstacionamento` não mantém referência direta a `Cliente`; ele guarda apenas `tipoCliente` e os dados da estadia.
- `RegistroDeEntradasESaidas` mantém a `listaNegra` como `Set<String>`, então a relação foi representada como estado interno, não como classe separada.
- `RelatoriosGerenciais.geraRelatorioListaNegra()` e `geraTop10ClientesFrequentes()` existem no código, mas ainda estão sem implementação.
- Em `Menu.cadastrar()`, o código atual chama `this.#cadastroCliente(cliente)`, embora a modelagem da aplicação indique uso de `cadastrarCliente(cliente)`.
