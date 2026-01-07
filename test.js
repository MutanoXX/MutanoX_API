import http from 'http';

function fazerRequisicao(opcoes) {
  return new Promise((resolve, reject) => {
    const req = http.request(opcoes, (res) => {
      let dados = '';
      res.on('data', (chunk) => dados += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(dados));
        } catch (e) {
          resolve(dados);
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function testarAPI() {
  const PORT = 3001;
  const HOST = 'localhost';
  let cpfParaTestar = '52998224725'; // CPF válido de teste

  console.log('🧪 Iniciando testes da MutanoX API...\n');

  // Teste 1: Status da API
  console.log('Teste 1: Verificando status da API...');
  try {
    const resposta = await fazerRequisicao({
      hostname: HOST,
      port: PORT,
      path: '/mutanox/status',
      method: 'GET'
    });
    console.log('✅ Status:', resposta.status);
    console.log('   Versão:', resposta.versao);
    console.log('   Timestamp:', resposta.timestamp);
  } catch (erro) {
    console.log('❌ Erro:', erro.message);
  }

  console.log('\n---\n');

  // Teste 2: Consulta de Telefone
  console.log('Teste 2: Consultando telefone 65999701064...');
  try {
    const resposta = await fazerRequisicao({
      hostname: HOST,
      port: PORT,
      path: '/mutanox/telefone/65999701064',
      method: 'GET'
    });
    if (resposta.sucesso) {
      console.log('✅ Consulta realizada com sucesso!');
      console.log('   Telefone:', resposta.dados.formato);
      console.log('   DDD:', resposta.dados.ddd);
      console.log('   Estado:', resposta.dados.estado);
      console.log('   Tipo:', resposta.dados.tipo);
      console.log('   Operadora:', resposta.dados.operadora);
      console.log('   CPF:', resposta.dados.cpf);
      cpfParaTestar = resposta.dados.cpf;
    } else {
      console.log('❌ Erro na consulta:', resposta.mensagem);
    }
  } catch (erro) {
    console.log('❌ Erro:', erro.message);
  }

  console.log('\n---\n');

  // Teste 3: Consulta de CPF (usando CPF válido para teste)
  console.log(`Teste 3: Consultando CPF ${cpfParaTestar}...`);
  try {
    const resposta = await fazerRequisicao({
      hostname: HOST,
      port: PORT,
      path: `/mutanox/cpf/${cpfParaTestar}`,
      method: 'GET'
    });
    if (resposta.sucesso) {
      console.log('✅ Consulta realizada com sucesso!');
      console.log('   CPF:', resposta.dados.cpf);
      console.log('   Nome:', resposta.dados.nome);
      console.log('   Situação:', resposta.dados.situacao);
      console.log('   Data Nascimento:', resposta.dados.dataNascimento);
      console.log('   UF:', resposta.dados.uf);
      console.log('   Cidade:', resposta.dados.cidade);
    } else {
      console.log('❌ Erro na consulta:', resposta.mensagem);
    }
  } catch (erro) {
    console.log('❌ Erro:', erro.message);
  }

  console.log('\n---\n');

  // Teste 4: Métricas do Dashboard
  console.log('Teste 4: Obtendo métricas do dashboard...');
  try {
    const resposta = await fazerRequisicao({
      hostname: HOST,
      port: PORT,
      path: '/mutanox/dashboard/metricas',
      method: 'GET'
    });
    if (resposta.sucesso) {
      console.log('✅ Métricas obtidas com sucesso!');
      console.log('   Total de Consultas:', resposta.dados.totalConsultas);
      console.log('   Consultas de Telefone:', resposta.dados.consultasTelefone);
      console.log('   Consultas de CPF:', resposta.dados.consultasCPF);
      console.log('   Erros:', resposta.dados.erros);
    }
  } catch (erro) {
    console.log('❌ Erro:', erro.message);
  }

  console.log('\n---\n');

  // Teste 5: Histórico de Consultas
  console.log('Teste 5: Obtendo histórico de consultas de telefone...');
  try {
    const resposta = await fazerRequisicao({
      hostname: HOST,
      port: PORT,
      path: '/mutanox/dashboard/historico/telefone?limite=5',
      method: 'GET'
    });
    if (resposta.sucesso) {
      console.log('✅ Histórico obtido com sucesso!');
      console.log('   Total:', resposta.dados.total);
      console.log('   Registros:', resposta.dados.registros.length);
    }
  } catch (erro) {
    console.log('❌ Erro:', erro.message);
  }

  console.log('\n---\n');

  // Teste 6: Telefone inválido
  console.log('Teste 6: Testando validação com telefone inválido...');
  try {
    const resposta = await fazerRequisicao({
      hostname: HOST,
      port: PORT,
      path: '/mutanox/telefone/123',
      method: 'GET'
    });
    if (!resposta.sucesso) {
      console.log('✅ Validação funcionou!');
      console.log('   Mensagem:', resposta.mensagem);
    } else {
      console.log('❌ Validação falhou!');
    }
  } catch (erro) {
    console.log('❌ Erro:', erro.message);
  }

  console.log('\n---\n');

  // Teste 7: CPF inválido
  console.log('Teste 7: Testando validação com CPF inválido...');
  try {
    const resposta = await fazerRequisicao({
      hostname: HOST,
      port: PORT,
      path: '/mutanox/cpf/123456789',
      method: 'GET'
    });
    if (!resposta.sucesso) {
      console.log('✅ Validação funcionou!');
      console.log('   Mensagem:', resposta.mensagem);
    } else {
      console.log('❌ Validação falhou!');
    }
  } catch (erro) {
    console.log('❌ Erro:', erro.message);
  }

  console.log('\n🎉 Testes finalizados!\n');
}

testarAPI();
