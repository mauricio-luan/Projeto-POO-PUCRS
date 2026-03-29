Introdução
Sistema de Controle de Estacionamento de Veículos de Passeio

Uma importante incorporadora desenvolveu um complexo composto por três empreendimentos distintos: um shopping center, um edifício corporativo e uma universidade. Todos compartilham um estacionamento subterrâneo de grande porte, administrado pela empresa EstACME, com capacidade total de 9.000 vagas numeradas para veículos de passeio.

O estacionamento atende clientes avulsos e clientes pré-cadastrados.

Os clientes pré-cadastrados podem ser empresas, estudantes ou professores, cada qual sujeito a regras específicas de utilização e cobrança.

Na entrada e na saída do estacionamento, câmeras registram automaticamente a placa do veículo, bem como a data e o horário. A cobrança é realizada conforme o tipo de cliente, e todas as operações ficam armazenadas para posterior consulta e geração de relatórios.

O objetivo deste projeto é implementar um sistema de controle de estacionamento que contemple:

• O gerenciamento do cadastro de clientes pré-cadastrados;

• O controle de entrada e saída de veículos;

• O cálculo e registro de cobranças;

• A consulta e geração de relatórios gerenciais.

O sistema deve atender tanto clientes pré-cadastrados quanto clientes avulsos.

O projeto será desenvolvido em duas fases, com foco progressivo em modelagem, implementação, persistência, interface e relatórios gerenciais. Cada fase possui atividades obrigatórias e entregas específicas.

• Fase 1: Modelagem do sistema e implementação do núcleo funcional

• Fase 2: Funcionalidades avançadas, persistência de dados, interface e relatórios

Confira abaixo o documento complementar “Sistema de Controle de Estacionamento” com orientações para o desenvolvimento do projeto.

Atenção:

• Seu trabalho deve ser autoral e individual.

• O sistema deve seguir rigorosamente as regras estabelecidas para a realização do projeto.

• A não implementação de funcionalidades obrigatórias impactará diretamente a nota.

Enunciado da fase 1

Fase 1 – MODELAGEM E IMPLEMENTAÇÃO BÁSICA

Objetivos da Fase 1:

Nesta fase, o objetivo é modelar corretamente o sistema e implementar seu núcleo, aplicando os princípios de Programação Orientada a Objetos, com ênfase em:

• Modelagem adequada do domínio;

• Uso correto de classes, herança, encapsulamento e polimorfismo;

• Implementação das principais regras de negócio;

• Código organizado e bem documentado.

Atividades da Fase 1 que você deve realizar:

a) Elaborar o Diagrama de Classes

• Seguir rigorosamente o diagrama base fornecido na Figura 1 (documento complementar “Sistema de Controle de Estacionamento”);

• Respeitar as classes obrigatórias, seus relacionamentos e heranças;

• Podem ser criadas classes adicionais, desde que não violem o modelo mínimo exigido.

b) Implementar as Classes de Domínio

• Clientes (Avulso, Professor, Estudante, Empresa);

• Veículos e placas;

• Registros de estacionamento;

• Mecanismo de descontos (com possibilidade de extensão futura);

• Demais classes necessárias ao funcionamento do sistema.

c) Implementar o Controle de Entrada, Saída e Cobrança

• Autorização de entrada conforme tipo de cliente;

• Registro de data e hora de entrada;

• Processamento da saída do veículo;

• Cálculo correto das cobranças conforme regras estabelecidas;

• Tratamento de bloqueios, inadimplência e exceções.

d) Organizar e Documentar o Código

• Separação clara de responsabilidades entre classes;

• Comentários explicativos;

• Código legível, sem duplicações desnecessárias.

O que você deve entregar na fase 1 do projeto:

Um arquivo “.zip” contendo:

• Diagrama de Classes (PDF ou imagem);

• Código-fonte do sistema, contendo:

- As classes de domínio implementadas;

- O controle de entrada, saída e cobrança;

- Código executável e organizado em módulos/classes.

Nesta fase, não é obrigatória a implementação de persistência em arquivos nem de interface completa com o usuário.

Quais aulas você deve assistir par realizar a fase 1 do projeto:

Aulas 1 a 5.

Enunciado da fase 2

Fase 2 – FUNCIONALIDADES AVANÇADAS E PERSISTÊNCIA

Objetivos da Fase 2:

Nesta fase, o objetivo é completar o sistema, adicionando:

• Persistência de dados em arquivos CSV;

• Interface com o usuário;

• Relatórios gerenciais;

• Uso eficiente de estruturas de dados (sets e dicionários).

Atividades da Fase 2 que você deve realizar:

a) Implementar Persistência em Arquivos CSV

• Leitura dos arquivos CSV na inicialização do sistema;

• Manutenção dos dados em memória durante a execução;

• Salvamento automático ou manual dos dados atualizados ao final;

• Uso correto do formato especificado.

b) Implementar a Interface com o Usuário

• Interface em classe separada;

• Permitir:

- Cadastro de clientes;

- Entrada e saída de veículos;

- Consultas e geração de relatórios.

• Interface clara, organizada e funcional.

c) Implementar os Relatórios Gerenciais

O sistema deve gerar, no mínimo, os seguintes relatórios:

• Valor total arrecadado por período e/ou categoria de cliente;

• Situação de um cliente cadastrado;

• Registros de estacionamento de cliente cadastrado por período;

• Registros de estacionamento de cliente não cadastrado por período;

• Relação de clientes impedidos de entrar no estacionamento;

• Relação dos 10 clientes mais frequentes do ano.

d) Utilizar Estruturas de Dados Adequadas

• Uso obrigatório de:

- set para evitar placas duplicadas e controlar bloqueios;

- dictionary/map para associação entre clientes, veículos e registros.

• Garantir eficiência e consistência dos dados.

O que você deve entregar na fase 2 do projeto:

Um arquivo “.zip” contendo:

• Código-fonte completo do sistema, incluindo:

- Persistência em arquivos CSV;

- Interface com o usuário;

- Relatórios gerenciais.

• Arquivos CSV utilizados para cadastro de clientes e registros de estacionamento;

• O sistema deve estar totalmente funcional e executar sem erros.

Quais aulas você deve assistir par realizar a fase 2 do projeto:

Aulas 6 a 10.
