import TicketEstacionamento from "../entities/estacionamento/TicketEstacionamento.js";
import Empresa from "../entities/cliente/Empresa.js";
import Professor from "../entities/cliente/Professor.js";
import Estudante from "../entities/cliente/Estudante.js";
import { TIPOS } from "../constants.js";

export default async function carregarDados(
  cadastroCliente,
  estacionamento,
  csv,
) {
  const clientesDoCsv = await csv.getCSVClientes();
  const historicoTicketsDoCsv = await csv.getCSVHistoricoTickets();
  const listaNegraDoCsv = await csv.getCSVListaNegra();

  setClientes(cadastroCliente, clientesDoCsv);
  setTickets(estacionamento, historicoTicketsDoCsv);
  setListaNegra(estacionamento, listaNegraDoCsv);
}

function setClientes(cadastroCliente, listaClientesCSV) {
  if (!listaClientesCSV || listaClientesCSV.length === 0) {
    return;
  }

  listaClientesCSV.forEach((linha) => {
    let novoCliente;
    const colunas = linha.split(",");

    const cliente = {
      nome: colunas[2],
      documento: colunas[0],
      tipo: colunas[1],
      veiculos: colunas[3].split(";").map((v) => v.replaceAll('"', "").trim()),
    };

    if (cliente.tipo === TIPOS.PROFESSOR) {
      novoCliente = new Professor({ ...cliente });
    }

    if (cliente.tipo === TIPOS.ESTUDANTE) {
      novoCliente = new Estudante({
        ...cliente,
        saldo: parseFloat(colunas[4]),
      });
    }

    if (cliente.tipo === TIPOS.EMPRESA) {
      novoCliente = new Empresa({
        ...cliente,
        debitos: parseFloat(colunas[4]),
        adimplente: colunas[5],
      });
    }

    cadastroCliente.cadastrarCliente(novoCliente);
  });
}

function setTickets(estacionamento, historicoTicketsDoCsv) {
  if (!historicoTicketsDoCsv || historicoTicketsDoCsv.length === 0) {
    return;
  }

  historicoTicketsDoCsv.forEach((linha) => {
    const [
      placa,
      tipoCliente,
      dataHoraEntrada,
      dataHoraSaida,
      qtdDiasUso,
      valorCobrado,
    ] = linha.trim().split(",");

    const ticket = new TicketEstacionamento({
      placa,
      tipoCliente,
      dataHoraEntrada: new Date(dataHoraEntrada),
    });

    if (dataHoraSaida) {
      ticket.dataHoraSaida = new Date(dataHoraSaida);
    }

    if (qtdDiasUso) {
      ticket.qtdDiasUso = parseInt(qtdDiasUso, 10);
    }

    if (valorCobrado) {
      ticket.valorCobrado = parseFloat(valorCobrado);
    }

    if (ticket.estaEmAberto()) {
      estacionamento.reinsereTicketEmAberto(ticket);
    }
    estacionamento.historicoTickets = ticket;
  });
}

function setListaNegra(estacionamento, listaNegraDoCsv) {
  if (!listaNegraDoCsv || listaNegraDoCsv.length === 0) {
    return;
  }

  listaNegraDoCsv.forEach((linha) => {
    const placa = linha.trim();
    if (!placa) {
      return;
    }

    estacionamento.reinserePlacaNaListaNegra(placa);
  });
}
