import CadastroCliente from "./src/entities/cliente/CadastroCliente.js";
import RegistroDeEntradasESaidas from "./src/entities/estacionamento/RegistroDeEntradasESaidas.js";
import CSV from "./src/entities/csv/CSV.js";
import Menu from "./src/entities/menu/Menu.js";
import RelatoriosGerenciais from "./src/entities/relatorio/RelatoriosGerenciais.js";
import carregarDados from "./src/bootstrap/carregarDados.js";

async function main() {
  const cadastroCliente = new CadastroCliente();
  const estacionamento = new RegistroDeEntradasESaidas(cadastroCliente);
  const csv = new CSV(cadastroCliente, estacionamento);
  const relatoriosGerenciais = new RelatoriosGerenciais(
    estacionamento,
    cadastroCliente,
  );
  const menu = new Menu(
    cadastroCliente,
    estacionamento,
    csv,
    relatoriosGerenciais,
  );

  await carregarDados(cadastroCliente, estacionamento, csv);
  await menu.menu();
}

main();
