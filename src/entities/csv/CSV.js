import fs from "node:fs/promises";
import path from "path";
import { TIPOS } from "../../constants.js";

/**
 * Responsável por carregar e persistir clientes e tickets em arquivos CSV.
 */
export default class CSV {
  #clientes;
  #historicoTickets;
  #listaNegra;
  #caminhoCSV;
  #caminhoCSVHistoricoTickets;
  #caminhoCSVListaNegra;
  #csv;
  #csvHistoricoTickets;
  #csvListaNegra;

  /**
   * Cria o serviço de persistência CSV.
   * @param {import("../cliente/CadastroCliente.js").default} cadastroCliente - Repositório de clientes.
   * @param {import("../estacionamento/RegistroDeEntradasESaidas.js").default} estacionamento - Serviço com o histórico de tickets.
   */
  constructor(cadastroCliente, estacionamento) {
    this.#clientes = cadastroCliente;
    this.#historicoTickets = estacionamento;
    this.#listaNegra = estacionamento;
    this.#caminhoCSV = path.resolve("./database/clientes.CSV");
    this.#caminhoCSVHistoricoTickets = path.resolve(
      "./database/historico_tickets.CSV",
    );
    this.#caminhoCSVListaNegra = path.resolve("./database/lista_negra.CSV");
    this.#csv = "";
    this.#csvHistoricoTickets = "";
    this.#csvListaNegra = "";
  }

  /**
   * Lê o arquivo CSV de clientes e devolve suas linhas úteis.
   * @returns {Promise<string[]|undefined>}
   */
  async getCSVClientes() {
    try {
      const csv = await fs.readFile(this.#caminhoCSV, "utf-8");
      if (!csv) return [];

      return csv.split(/\r?\n/).filter((l) => l.trim().length > 0);
    } catch (error) {
      console.error("Erro ao ler CSV de clientes: ", error.message || error);
    }
  }

  /**
   * Lê o arquivo CSV do histórico de tickets e devolve suas linhas úteis.
   * @returns {Promise<string[]|undefined>}
   */
  async getCSVHistoricoTickets() {
    try {
      const csv = await fs.readFile(this.#caminhoCSVHistoricoTickets, "utf-8");
      if (!csv) return [];

      return csv.split(/\r?\n/).filter((l) => l.trim().length > 0);
    } catch (error) {
      console.error(
        "Erro ao ler CSV histórico de tickets: ",
        error.message || error,
      );
    }
  }

  /**
   * Lê o arquivo CSV da lista negra e devolve suas linhas úteis.
   * @returns {Promise<string[]|undefined>}
   */
  async getCSVListaNegra() {
    try {
      const csv = await fs.readFile(this.#caminhoCSVListaNegra, "utf-8");
      if (!csv) return [];

      return csv.split(/\r?\n/).filter((l) => l.trim().length > 0);
    } catch (error) {
      if (error.code === "ENOENT") return [];

      console.error("Erro ao ler CSV da lista negra: ", error.message || error);
    }
  }

  /**
   * Preenche o buffer de saída do CSV de clientes.
   * @returns {void}
   */
  #populaCSVClientes() {
    const clientes = this.#clientes.clientesToJSON();
    let linha = null;

    for (const cliente of clientes) {
      linha = `${cliente.documento},${cliente.tipo},${cliente.nome},"${cliente.veiculos.join(";")}"`;

      if (cliente.tipo === TIPOS.EMPRESA) {
        linha += `,${cliente.debitos},${cliente.adimplente}`;
      }

      if (cliente.tipo === TIPOS.ESTUDANTE) {
        linha += `,${cliente.saldo}`;
      }

      this.#csv += `${linha}\n`;
    }
  }

  /**
   * Preenche o buffer de saída do CSV de histórico de tickets.
   * @returns {void}
   */
  #populaCSVHistoricoTickets() {
    const tickets = this.#historicoTickets.historicoTicketsToJSON;
    let linha = "";

    for (const ticket of tickets) {
      const colunas = [
        ticket.placa,
        ticket.tipoCliente,
        ticket.dataHoraEntrada.toISOString(),
        ticket.dataHoraSaida ? ticket.dataHoraSaida.toISOString() : "",
        ticket.qtdDiasUso || "",
        ticket.valorCobrado ?? "",
      ];

      linha = `${colunas.join(",")}\n`;
      this.#csvHistoricoTickets += linha;
    }
  }

  /**
   * Preenche o buffer de saída do CSV de lista negra.
   * @returns {void}
   */
  #populaCSVListaNegra() {
    const listaNegra = this.#listaNegra.listaNegraToJSON;

    for (const registro of listaNegra) {
      this.#csvListaNegra += `${registro.placa}\n`;
    }
  }

  /**
   * Indica se o buffer de clientes já recebeu conteúdo.
   * @returns {boolean}
   */
  #CSVEstaPreenchido() {
    return this.#csv !== "";
  }

  /**
   * Gera os arquivos CSV de clientes e histórico de tickets.
   * @returns {Promise<boolean>}
   */
  async geraCSV() {
    if (this.#CSVEstaPreenchido()) this.#csv += "\n";

    this.#populaCSVClientes();
    this.#populaCSVHistoricoTickets();
    this.#populaCSVListaNegra();

    try {
      await fs.writeFile(this.#caminhoCSV, this.#csv, "utf-8");
      await fs.writeFile(
        this.#caminhoCSVHistoricoTickets,
        this.#csvHistoricoTickets,
        "utf-8",
      );
      await fs.writeFile(
        this.#caminhoCSVListaNegra,
        this.#csvListaNegra,
        "utf-8",
      );
      console.log(`CSV salvo em: ${this.#caminhoCSV}`);
      console.log(
        `CSV histórico de tickets salvo em: ${this.#caminhoCSVHistoricoTickets}`,
      );
      console.log(`CSV da lista negra salvo em: ${this.#caminhoCSVListaNegra}`);
      return true;
    } catch (e) {
      console.error("Erro ao salvar CSV:", e.message || e);
      throw e;
    }
  }
}
