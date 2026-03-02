import { Cliente } from "./Cliente";

export class Professor extends Cliente {
  constructor(nome, documento) {
    super(nome, documento);
  }
}
