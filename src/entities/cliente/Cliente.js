import { validate } from "bycontract";

export class Cliente {
  #nome;
  #documento;
  #tipo;
  #veiculos;

  constructor(nome, documento, tipo, veiculos) {
    validate(arguments, [String, String, String, "Array.<String>"]);
    this.#nome = nome;
    this.#documento = documento;
    this.#tipo = tipo;

    switch (this.#tipo) {
      case "Professor":
        if (veiculos.length > 2)
          throw new Error("Professores podem cadastrar no máximo 2 veículos.");
        this.#veiculos = [...veiculos];
        break;

      case "Estudante":
        if (veiculos.length > 1)
          throw new Error("Estudantes podem cadastrar no máximo 1 veículo.");
        this.#veiculos = veiculos;
        break;

      case "Empresa":
        this.#veiculos = [...veiculos];
        break;

      default:
        throw new Error("Tipo de cliente inválido.");
    }
  }

  get nome() {
    return this.#nome;
  }

  get documento() {
    return this.#documento;
  }

  get tipo() {
    return this.#tipo;
  }

  get veiculos() {
    return this.#veiculos;
  }
}
