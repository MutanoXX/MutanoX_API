import express from 'express';
import cors from 'cors';
import axios from 'axios';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Armazenamento em memória para as consultas (simulando um banco de dados)
const consultas = {
  telefone: [],
  cpf: []
};

// Métricas do dashboard
const metricas = {
  totalConsultas: 0,
  consultasTelefone: 0,
  consultasCPF: 0,
  consultasHoje: 0,
  erros: 0
};

// Formatar CPF
function formatarCPF(cpf) {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

// Validar CPF
function validarCPF(cpf) {
  cpf = cpf.replace(/[^\d]/g, '');
  if (cpf.length !== 11) return false;

  // Validação básica de CPF
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf[i]) * (10 - i);
  }
  let resto = 11 - (soma % 11);
  if (resto >= 10) resto = 0;
  if (resto !== parseInt(cpf[9])) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf[i]) * (11 - i);
  }
  resto = 11 - (soma % 11);
  if (resto >= 10) resto = 0;
  if (resto !== parseInt(cpf[10])) return false;

  return true;
}

// Gerar dados simulados para CPF
function gerarDadosCPF(cpf) {
  const nomes = ['João Silva', 'Maria Santos', 'Pedro Oliveira', 'Ana Costa', 'Carlos Ferreira'];
  const estados = ['SP', 'RJ', 'MG', 'RS', 'PR', 'SC', 'BA', 'PE'];
  const cidades = ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Porto Alegre', 'Curitiba', 'Salvador', 'Recife'];

  const randomIndex = Math.floor(Math.random() * nomes.length);

  return {
    cpf: formatarCPF(cpf),
    nome: nomes[randomIndex],
    situacao: 'Regular',
    dataNascimento: `${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}/${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}/${Math.floor(Math.random() * (2005 - 1950) + 1950)}`,
    uf: estados[Math.floor(Math.random() * estados.length)],
    cidade: cidades[Math.floor(Math.random() * cidades.length)],
    genero: Math.random() > 0.5 ? 'Masculino' : 'Feminino',
    dataConsulta: new Date().toISOString()
  };
}

// ROTA: Consulta de Telefone
app.get('/api/telefone/:numero', async (req, res) => {
  try {
    const { numero } = req.params;
    const numeroLimpo = numero.replace(/[^0-9]/g, '');

    if (numeroLimpo.length < 10 || numeroLimpo.length > 11) {
      metricas.erros++;
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Número de telefone inválido. Deve conter 10 ou 11 dígitos.'
      });
    }

    // Simulação de consulta a API externa
    const ddd = numeroLimpo.substring(0, 2);
    const tipo = numeroLimpo.length === 11 ? 'Celular' : 'Fixo';

    const resultado = {
      sucesso: true,
      dados: {
        telefone: numeroLimpo,
        formato: `(${ddd}) ${numeroLimpo.substring(2, 7)}-${numeroLimpo.substring(7)}`,
        ddd: ddd,
        estado: obterEstadoPorDDD(ddd),
        tipo: tipo,
        operadora: ['Claro', 'Vivo', 'TIM', 'Oi', 'Nextel'][Math.floor(Math.random() * 5)],
        cpf: gerarCPFParaTeste(),
        dataConsulta: new Date().toISOString()
      }
    };

    // Armazenar consulta
    metricas.totalConsultas++;
    metricas.consultasTelefone++;
    consultas.telefone.push(resultado.dados);

    // Manter apenas as últimas 100 consultas
    if (consultas.telefone.length > 100) {
      consultas.telefone.shift();
    }

    res.json(resultado);
  } catch (error) {
    metricas.erros++;
    console.error('Erro na consulta de telefone:', error);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao processar consulta de telefone',
      erro: error.message
    });
  }
});

// ROTA: Consulta de CPF
app.get('/api/cpf/:cpf', async (req, res) => {
  try {
    const { cpf } = req.params;
    const cpfLimpo = cpf.replace(/[^0-9]/g, '');

    if (cpfLimpo.length !== 11 || !validarCPF(cpfLimpo)) {
      metricas.erros++;
      return res.status(400).json({
        sucesso: false,
        mensagem: 'CPF inválido. Verifique o número digitado.'
      });
    }

    const resultado = {
      sucesso: true,
      dados: gerarDadosCPF(cpfLimpo)
    };

    // Armazenar consulta
    metricas.totalConsultas++;
    metricas.consultasCPF++;
    consultas.cpf.push(resultado.dados);

    // Manter apenas as últimas 100 consultas
    if (consultas.cpf.length > 100) {
      consultas.cpf.shift();
    }

    res.json(resultado);
  } catch (error) {
    metricas.erros++;
    console.error('Erro na consulta de CPF:', error);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao processar consulta de CPF',
      erro: error.message
    });
  }
});

// ROTA: Dashboard - Métricas
app.get('/api/dashboard/metricas', (req, res) => {
  res.json({
    sucesso: true,
    dados: {
      ...metricas,
      consultasRecentes: {
        telefone: consultas.telefone.slice(-10),
        cpf: consultas.cpf.slice(-10)
      }
    }
  });
});

// ROTA: Dashboard - Histórico de Consultas
app.get('/api/dashboard/historico/:tipo', (req, res) => {
  const { tipo } = req.params;
  const limite = parseInt(req.query.limite) || 50;

  if (!['telefone', 'cpf'].includes(tipo)) {
    return res.status(400).json({
      sucesso: false,
      mensagem: 'Tipo deve ser "telefone" ou "cpf"'
    });
  }

  const historico = consultas[tipo].slice(-limite).reverse();

  res.json({
    sucesso: true,
    dados: {
      tipo: tipo,
      total: consultas[tipo].length,
      registros: historico
    }
  });
});

// ROTA: Dashboard - Limpar Histórico
app.delete('/api/dashboard/historico/:tipo', (req, res) => {
  const { tipo } = req.params;

  if (!['telefone', 'cpf'].includes(tipo)) {
    return res.status(400).json({
      sucesso: false,
      mensagem: 'Tipo deve ser "telefone" ou "cpf"'
    });
  }

  consultas[tipo] = [];

  res.json({
    sucesso: true,
    mensagem: `Histórico de ${tipo} limpo com sucesso`
  });
});

// ROTA: Status da API
app.get('/api/status', (req, res) => {
  res.json({
    sucesso: true,
    status: 'online',
    versao: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// ROTA Padrão
app.get('/', (req, res) => {
  res.json({
    nome: 'MutanoX API',
    versao: '1.0.0',
    status: 'online',
    rotas: {
      telefone: '/api/telefone/:numero',
      cpf: '/api/cpf/:cpf',
      dashboardMetricas: '/api/dashboard/metricas',
      dashboardHistorico: '/api/dashboard/historico/:tipo?limite=50',
      status: '/api/status'
    }
  });
});

// Função auxiliar
function obterEstadoPorDDD(ddd) {
  const ddds = {
    '11': 'SP', '12': 'SP', '13': 'SP', '14': 'SP', '15': 'SP', '16': 'SP', '17': 'SP', '18': 'SP', '19': 'SP',
    '21': 'RJ', '22': 'RJ', '24': 'RJ',
    '27': 'ES', '28': 'ES',
    '31': 'MG', '32': 'MG', '33': 'MG', '34': 'MG', '35': 'MG', '37': 'MG', '38': 'MG',
    '41': 'PR', '42': 'PR', '43': 'PR', '44': 'PR', '45': 'PR', '46': 'PR',
    '47': 'SC', '48': 'SC', '49': 'SC',
    '51': 'RS', '53': 'RS', '54': 'RS', '55': 'RS',
    '61': 'DF',
    '62': 'GO', '64': 'GO',
    '63': 'TO',
    '65': 'MT', '66': 'MT',
    '67': 'MS',
    '68': 'AC', '69': 'RO',
    '71': 'BA', '73': 'BA', '74': 'BA', '75': 'BA', '77': 'BA',
    '79': 'SE',
    '81': 'PE', '87': 'PE',
    '82': 'AL',
    '83': 'PB',
    '84': 'RN',
    '85': 'CE', '88': 'CE',
    '86': 'PI',
    '89': 'PI',
    '91': 'PA', '93': 'PA', '94': 'PA',
    '92': 'AM', '97': 'AM',
    '95': 'RR',
    '96': 'AP',
    '98': 'MA', '99': 'MA'
  };
  return ddds[ddd] || 'Desconhecido';
}

function gerarCPFParaTeste() {
  return '529.982.247-25';
}

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor MutanoX API rodando na porta ${PORT}`);
  console.log(`📍 Dashboard disponível em: http://localhost:${PORT}/api/dashboard/metricas`);
});
