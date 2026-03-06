import { validate } from "bycontract";
import Cliente from "./Cliente.js";

export default class CadastroCliente {
  #clientes;

  constructor() {
    this.#clientes = new Map();
  }

  cadastrarCliente(cliente) {
    validate(cliente, Cliente);
    this.#clientes.set(cliente.documento, cliente);
    return true;
  }

  excluirCliente(documentoCliente) {
    validate(documentoCliente, "String");
    if (!this.#clientes.has(documentoCliente)) throw new Error("Cliente não encontrado");

    this.#clientes.delete(documentoCliente);
    return true;
  }

  getCliente(documentoCliente) {
    return this.#clientes.get(documentoCliente);
  }

  obterClientePorPlaca(placa) {
    validate(placa, "String");
    for (const cliente of this.clientes) {
      if (cliente.veiculos.includes(placa)) {
        return cliente;
      }
    }
    return null;
  }

  get clientes() {
    return Array.from(this.#clientes.values());
  }

  get qtdClientes() {
    return this.#clientes.size;
  }

  isEmpty() {
    return this.#clientes.size === 0;
  }
}
