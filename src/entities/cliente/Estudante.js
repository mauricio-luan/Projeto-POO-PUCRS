import { Cliente } from "./Cliente";
import { validate } from "bycontract";

export class Estudante extends Cliente {
  #tipo;
  #saldo;

  constructor(nome, documento, tipoCliente, saldo) {
    super(nome, documento, tipoCliente);

    validate(saldo, Number);
    this.#saldo = saldo;
    this.#tipo = "Estudante";
  }

  get tipo() {
    return this.#tipo;
  }

  get saldo() {
    return this.#saldo;
  }

  set saldo(value) {
    validate(value, Number);
    this.#saldo = value;
  }
}
