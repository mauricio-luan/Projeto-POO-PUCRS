import { validate } from "bycontract";

export default class RelatoriosGerenciais {
  #registroEntradasESaidas;
  #registroClientes;

  constructor(registroEntradasESaidas, registroClientes) {
    this.#registroEntradasESaidas = registroEntradasESaidas;
    this.#registroClientes = registroClientes;
  }

  geraRelatorioArrecadacao(dataInicial, dataFinal) {
    validate(arguments, ["Date", "Date"]);
    const tickets = this.#registroEntradasESaidas.historicoTicketsToJSON;

    return tickets.filter(
      (ticket) =>
        ticket.valorCobrado > 1 &&
        ticket.dataHoraEntrada >= dataInicial &&
        ticket.dataHoraSaida <= dataFinal,
    );
  }

  geraSituacaoClienteCadastrado(identificador) {
    validate(identificador, "String");

    const cliente = this.#registroClientes.getClienteComoObjeto(identificador);

    cliente.estacionados = [];
    cliente.veiculos.forEach((placa) => {
      if (this.#registroEntradasESaidas.veiculoEstaEstacionado(placa)) {
        cliente.estacionados.push(placa);
      }
    });

    return cliente;
  }

  geraHistoricoRegistroEstacionamentoPorCliente(
    identificador,
    dataInicial,
    dataFinal,
  ) {
    validate(arguments, ["String", "Date", "Date"]);
    const cliente = this.#registroClientes.getClienteComoObjeto(identificador);
    const tickets = this.#registroEntradasESaidas.historicoTicketsToJSON;

    const historico = cliente.veiculos.map((placa) => {
      return {
        placa,
        registros: tickets.filter(
          (ticket) =>
            ticket.placa === placa &&
            ticket.dataHoraEntrada >= dataInicial &&
            ticket.dataHoraSaida <= dataFinal,
        ),
      };
    });
    return JSON.stringify(historico, null, 2);
  }

  geraHistoricoClienteAvulso(placa, dataInicial, dataFinal) {
    validate(arguments, ["String", "Date", "Date"]);
    const tickets = this.#registroEntradasESaidas.historicoTicketsToJSON;
    return {
      placa,
      registros: tickets.filter(
        (ticket) =>
          ticket.placa === placa &&
          ticket.dataHoraEntrada >= dataInicial &&
          ticket.dataHoraSaida <= dataFinal,
      ),
    };
  }

  geraRelatorioListaNegra() {
    return this.#registroEntradasESaidas.listaNegraToJSON;
  }

  geraTop10ClientesFrequentes() {
    const tickets = this.#registroEntradasESaidas.historicoTicketsToJSON;

    const lista = {};
    for (const ticket of tickets) {
      if (!lista[ticket.placa]) {
        lista[ticket.placa] = 1;
      } else {
        lista[ticket.placa] = lista[ticket.placa] + 1;
      }
    }

    return Object.entries(lista)
      .map(([placa, qtdUso]) => ({ placa, qtdUso }))
      .sort((a, b) => b.qtdUso - a.qtdUso)
      .slice(0, 10);
  }
}
