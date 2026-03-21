import fs from "node:fs/promises";
import path from "path";
import { TIPOS } from "../../constants.js";
import { validate } from "bycontract";

export default class CSV {
  #clientes;
  #caminhoCSV;
  #csv;

  constructor(cadastroCliente) {
    validate(cadastroCliente, "Object");
    this.#clientes = cadastroCliente;
    this.#caminhoCSV = path.resolve("./clientes.CSV");
    this.#csv = "";
  }

  async getClientesDoCSV() {
    try {
      const csv = await fs.readFile(this.#caminhoCSV, "utf-8");
      if (!csv) return [];

      return csv.split(/\r?\n/).filter((l) => l.trim().length > 0);
    } catch (error) {
      console.error("Erro ao ler CSV:", error.message || error);
    }
  }

  #CSVEstaPreenchido() {
    return this.#csv !== "";
  }

  #populaCSV() {
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

  async geraCSV() {
    if (this.#CSVEstaPreenchido()) this.#csv += "\n";

    this.#populaCSV();

    try {
      await fs.writeFile(this.#caminhoCSV, this.#csv, "utf-8");
      console.log(`CSV salvo em: ${this.#caminhoCSV}`);
      return true;
    } catch (e) {
      console.error("Erro ao salvar CSV:", e.message || e);
      throw e;
    }
  }
}
