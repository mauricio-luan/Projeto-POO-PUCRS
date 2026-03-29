import readline from "readline";
import Professor from "../../entities/cliente/Professor.js";
import Estudante from "../../entities/cliente/Estudante.js";
import Empresa from "../../entities/cliente/Empresa.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ask = (q) => new Promise((r) => rl.question(q, r));

export default class Menu {
  #cadastroCliente;
  #registroDeEntradasESaidas;
  #CSV;
  #relatoriosGerenciais;

  constructor(
    cadastroCliente,
    registroDeEntradasESaidas,
    CSV,
    relatoriosGerenciais,
  ) {
    this.#cadastroCliente = cadastroCliente;
    this.#registroDeEntradasESaidas = registroDeEntradasESaidas;
    this.#CSV = CSV;
    this.#relatoriosGerenciais = relatoriosGerenciais;
  }

  async menu() {
    console.log(`
=== ESTACIONAMENTO ===
1. Cadastrar cliente
2. Listar clientes
3. Registrar entrada
4. Registrar saída
5. Ver pátio
6. Ver lista negra
7. Relatório Arrecadação por período
8. Relatório Situação de cliente cadastrado
9. Relatório Histórico de Registro de Estacionamento por Cliente
10. Relatório Histórico de Registro de Estacionamento por Cliente Avulso
11. Relatório Clientes na Lista Negra
12. Relatório Top 10 Clientes mais frequentes do ano
0. Sair`);

    const op = (await ask("\nOpção: ")).trim();

    try {
      switch (op) {
        case "1":
          await this.cadastrar();
          break;
        case "2":
          this.listar();
          break;
        case "3":
          await this.entrada();
          break;
        case "4":
          await this.saida();
          break;
        case "5":
          this.verPatio();
          break;
        case "6":
          this.verListaNegra();
          break;
        case "7":
          await this.chamaRelatorioArrecadacao();
          break;
        case "8":
          await this.chamaRelatorioSituacaoClienteCadastrado();
          break;
        case "9":
          await this.chamaHistoricoRegistroEstacionamentoPorCliente();
          break;
        case "10":
          await this.chamaHistoricoRegistroEstacionamentoPorClienteAvulso();
          break;
        case "11":
          const r = this.#relatoriosGerenciais.geraRelatorioListaNegra();
          console.log(r);
          break;
        case "12":
          const top10 =
            this.#relatoriosGerenciais.geraTop10ClientesFrequentes();
          console.log(top10);
          break;
        case "0":
          await this.salvarClientesCSV();
          console.log("Encerrando.");
          rl.close();
          return;
        default:
          console.log("Opção inválida.");
      }
    } catch (e) {
      console.log(`Erro: ${e.message}`);
    }

    await this.menu();
  }

  async cadastrar() {
    const tipo = (
      await ask("Tipo (1-Estudante 2-Professor 3-Empresa): ")
    ).trim();
    const nome = (await ask("Nome: ")).trim();
    const doc = (await ask("Documento (CPF/CNPJ): ")).trim();
    const veiculos = (await ask("Placas (separadas por vírgula): "))
      .trim()
      .split(",")
      .map((v) => v.trim().toUpperCase())
      .filter(Boolean);

    let cliente;
    switch (tipo) {
      case "1": {
        const saldo = parseFloat((await ask("Saldo inicial: ")).trim());
        cliente = new Estudante({ nome, documento: doc, veiculos, saldo });
        break;
      }
      case "2":
        cliente = new Professor({ nome, documento: doc, veiculos });
        break;
      case "3": {
        const debitos = parseFloat(
          (await ask("Débitos (padrão 0): ")).trim() || "0",
        );
        cliente = new Empresa({ nome, documento: doc, veiculos, debitos });
        break;
      }
      default:
        console.log("Tipo inválido.");
        return;
    }

    this.#cadastroCliente.cadastrarCliente(cliente);
    console.log(`Cadastrado: ${cliente.toString()}`);
  }

  listar() {
    if (this.#cadastroCliente.isEmpty()) {
      console.log("Nenhum cliente.");
      return;
    }
    this.#cadastroCliente.clientes.forEach((c) =>
      console.log(`  ${c.toString()}`),
    );
  }

  async entrada() {
    const placa = (await ask("Placa: ")).trim().toUpperCase();
    const ticket = this.#registroDeEntradasESaidas.registraEntrada(placa);
    console.log(`Entrada OK: ${ticket.toString()}`);
  }

  async saida() {
    const placa = (await ask("Placa: ")).trim().toUpperCase();
    const cliente = this.#cadastroCliente.obterClientePorPlaca(placa);
    let pgto = true;

    if (!cliente) {
      pgto =
        (await ask("Avulso — pagamento aprovado? (s/n): "))
          .trim()
          .toLowerCase() === "s";
    }

    const ticket = this.#registroDeEntradasESaidas.registraSaida(placa, pgto);
    console.log(`Saída OK: ${ticket.toString()}`);

    if (!cliente && !pgto)
      console.log(`Placa ${placa} adicionada à lista negra.`);
  }

  verPatio() {
    const p = this.#registroDeEntradasESaidas.patio;
    if (p.size === 0) {
      console.log("Pátio vazio.");
      return;
    }
    for (const [, t] of p) console.log(`  ${t.toString()}`);
  }

  verListaNegra() {
    const ln = this.#registroDeEntradasESaidas.listaNegra;
    if (ln.size === 0) {
      console.log("Lista negra vazia.");
      return;
    }
    for (const placa of ln) console.log(`  ${placa}`);
  }

  async salvarClientesCSV() {
    try {
      return await this.#CSV.geraCSV();
    } catch (e) {
      console.error("Erro ao salvar CSV:", e.message || e);
    }
  }

  async chamaRelatorioArrecadacao() {
    const { dataInicial, dataFinal } = await this.capturaDatas();
    const tickets = this.#relatoriosGerenciais.geraRelatorioArrecadacao(
      dataInicial,
      dataFinal,
    );
    tickets.forEach((t) => console.log(t));
  }

  async chamaRelatorioSituacaoClienteCadastrado() {
    const doc = (await ask("Documento (CPF/CNPJ): ")).trim();
    const r = this.#relatoriosGerenciais.geraSituacaoClienteCadastrado(doc);
    console.log(r);
  }

  async capturaDatas() {
    console.log("Formato de data: DD/MM/AAAA");

    const hoje = new Date();
    hoje.setHours(23, 59, 59, 999);

    let fDataInicial;
    while (!fDataInicial) {
      const entrada = (await ask("Digite a data inicial: ")).trim();

      if (!/^\d{2}\/\d{2}\/\d{4}$/.test(entrada)) {
        console.log("Formato invalido. Use DD/MM/AAAA.");
        continue;
      }

      const [diaStr, mesStr, anoStr] = entrada.split("/");
      const dia = Number.parseInt(diaStr, 10);
      const mes = Number.parseInt(mesStr, 10);
      const ano = Number.parseInt(anoStr, 10);

      const data = new Date(ano, mes - 1, dia, 0, 0, 0, 0);
      const dataValida =
        data.getFullYear() === ano &&
        data.getMonth() === mes - 1 &&
        data.getDate() === dia;

      if (!dataValida) {
        console.log("Data inicial invalida.");
        continue;
      }

      if (data > hoje) {
        console.log("Data inicial nao pode ser maior que hoje.");
        continue;
      }

      fDataInicial = data;
    }

    let fDataFinal;
    while (!fDataFinal) {
      const entrada = (await ask("Digite a data final: ")).trim();

      if (!/^\d{2}\/\d{2}\/\d{4}$/.test(entrada)) {
        console.log("Formato invalido. Use DD/MM/AAAA.");
        continue;
      }

      const [diaStr, mesStr, anoStr] = entrada.split("/");
      const dia = Number.parseInt(diaStr, 10);
      const mes = Number.parseInt(mesStr, 10);
      const ano = Number.parseInt(anoStr, 10);

      const data = new Date(ano, mes - 1, dia, 23, 59, 59, 999);
      const dataValida =
        data.getFullYear() === ano &&
        data.getMonth() === mes - 1 &&
        data.getDate() === dia;

      if (!dataValida) {
        console.log("Data final invalida.");
        continue;
      }

      if (data > hoje) {
        console.log("Data final nao pode ser maior que hoje.");
        continue;
      }

      if (data < fDataInicial) {
        console.log("Data final nao pode ser anterior a data inicial.");
        continue;
      }

      fDataFinal = data;
    }

    return {
      dataInicial: fDataInicial,
      dataFinal: fDataFinal,
    };
  }

  async chamaHistoricoRegistroEstacionamentoPorCliente() {
    const doc = (await ask("Documento (CPF/CNPJ): ")).trim();
    const { dataInicial, dataFinal } = await this.capturaDatas();
    const r =
      this.#relatoriosGerenciais.geraHistoricoRegistroEstacionamentoPorCliente(
        doc,
        dataInicial,
        dataFinal,
      );
    console.log(r);
  }

  async chamaHistoricoRegistroEstacionamentoPorClienteAvulso() {
    const placa = (await ask("Placa: ")).trim().toUpperCase();
    const { dataInicial, dataFinal } = await this.capturaDatas();
    const r = this.#relatoriosGerenciais.geraHistoricoClienteAvulso(
      placa,
      dataInicial,
      dataFinal,
    );
    console.log(r);
  }
}
