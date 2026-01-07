# MutanoX API - Dashboard

API robusta para consulta de informações de telefone, CPF e nome, com dashboard de métricas em tempo real e dados **100% REAIS**.

## 🚀 Funcionalidades

- **Consulta de Telefone**: Obtém informações reais de números de telefone brasileiros
- **Consulta de CPF**: Valida e retorna informações completas de CPF (dados reais)
- **Consulta por Nome**: Busca pessoas por nome completo (dados reais)
- **Dashboard em Tempo Real**: Métricas de uso da API
- **Logs em Tempo Real**: Visualização de todas as requisições
- **Sistema de API Keys**: Autenticação e controle de acesso
- **Admin Dashboard**: Painel administrativo completo

## 📋 Pré-requisitos

- Node.js 18+ ou Bun
- npm ou bun

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/MutanoXX/MutanoX_API.git
cd MutanoX_API
```

2. Instale as dependências:
```bash
npm install
# ou
bun install
```

## 🏃 Executando

### Modo Desenvolvimento
```bash
npm run dev
# ou
bun run dev
```

### Modo Produção
```bash
npm start
# ou
bun run start
```

A API estará disponível em `http://localhost:8080`

## 🔑 Autenticação

A API requer uma API key válida para acessar os endpoints. Keys disponíveis:

- **Admin Key**: `MutanoX3397` (acesso completo)
- **Test Key**: `test-key` (para testes)

### Criar Nova API Key (Admin Only)
```http
POST /api/admin/keys?owner=Nome&role=user
apikey: MutanoX3397
```

## 📡 Rotas da API

### Consultas (Requer API Key)

#### Consultar Telefone
```http
GET /api/consultas?tipo=numero&q=65999701064&apikey=SUA_KEY
```

**Exemplo de Resposta:**
```json
{
  "sucesso": true,
  "totalResultados": 4,
  "resultados": [
    {
      "cpfCnpj": "04815502161",
      "nome": "LUCIENE APARECIDA BALBINO FIDELIS",
      "dataNascimento": "04/02/1993",
      "bairro": "JUNCO",
      "cidadeUF": "CACERES/MT",
      "cep": "07820000"
    }
  ],
  "criador": "@MutanoX"
}
```

#### Consultar CPF
```http
GET /api/consultas?tipo=cpf&cpf=04815502161&apikey=SUA_KEY
```

**Exemplo de Resposta:**
```json
{
  "sucesso": true,
  "dados": {
    "dadosBasicos": {
      "nome": "LUCIENE APARECIDA BALBINO FIDELIS",
      "cpf": "04815502161",
      "dataNascimento": "04/02/1993 (32 anos)",
      "sexo": "F - FEMININO",
      "nomeMae": "ADELINA BALBINO FIDELIS",
      "nomePai": "DONIZETE LUIZ FIDELIS",
      "situacaoCadastral": "REGULAR",
      "dataSituacao": "26/10/2019"
    },
    "dadosEconomicos": {
      "renda": "R$ 541,64",
      "poderAquisitivo": "MUITO BAIXO",
      "faixaRenda": "De R$ 112 até R$ 630",
      "scoreCSBA": "444"
    },
    "enderecos": [
      {
        "logradouro": "R PRUDENTE DE MORAES, 413",
        "bairro": "CIDADE NOVA",
        "cidadeUF": "CACERES/MT",
        "cep": "78201020"
      }
    ],
    "informacoesImportantes": {
      "cpfValido": "Não",
      "obito": "NÃO",
      "pep": "Não"
    }
  },
  "criador": "@MutanoX"
}
```

#### Consultar por Nome
```http
GET /api/consultas?tipo=nome&q=Silva&apikey=SUA_KEY
```

### Dashboard (Requer API Key)

#### Métricas
```http
GET /api/dashboard/metricas?apikey=SUA_KEY
```

**Resposta:**
```json
{
  "success": true,
  "dados": {
    "startTime": 1704617471000,
    "totalRequests": 15,
    "endpointHits": {
      "numero": 5,
      "cpf": 3,
      "nome": 7
    },
    "uptime": 123456
  }
}
```

#### Logs
```http
GET /api/dashboard/logs?apikey=SUA_KEY
```

### Admin API (Admin Key Requerida)

#### Validar Admin
```http
GET /api/admin/validate?apikey=MutanoX3397
```

#### Listar Keys
```http
GET /api/admin/keys?apikey=MutanoX3397
```

#### Criar Key
```http
POST /api/admin/keys?owner=Nome&role=user&apikey=MutanoX3397
```

#### Toggle Key Status
```http
POST /api/admin/toggle?target=CHAVE&apikey=MutanoX3397
```

#### Deletar Key
```http
DELETE /api/admin/keys?target=CHAVE&apikey=MutanoX3397
```

#### Stats Completos
```http
GET /api/admin/stats?apikey=MutanoX3397
```

## 🧪 Testes

Execute os testes para verificar se a API está funcionando corretamente:

```bash
npm test
# ou
bun test
```

O teste irá:
1. Verificar o status da API
2. Consultar o telefone 65999701064 (API REAL)
3. Consultar o CPF retornado (API REAL)
4. Obter métricas do dashboard
5. Obter logs do dashboard
6. Consultar por nome "Silva" (API REAL)

## 📊 Dashboard Frontend

O dashboard frontend está disponível no projeto Next.js em `/` e consome a API em tempo real.

### Funcionalidades do Dashboard
- **Métricas em tempo real**: Total de requisições, hits por endpoint
- **Interface de consulta**: Formulários para telefone, CPF e nome
- **Visualização de resultados**: Dados completos e formatados
- **Auto-refresh**: Atualização automática a cada 5 segundos
- **Design responsivo**: Funciona em desktop e mobile

## 🏗️ Estrutura do Projeto

```
MutanoX_API/
├── api.js                  # Servidor principal da API (versão REAL)
├── test-api.js             # Script de testes da API real
├── package.json            # Dependências e scripts
├── .gitignore              # Arquivos ignorados pelo git
├── README.md               # Documentação
├── api_keys.json           # Chaves de API (gerado automaticamente)
└── RESUMO.md              # Resumo do projeto
```

## 🌐 Integração com Frontend

### Exemplo de Requisição (JavaScript/TypeScript)

```typescript
// Consultar telefone
const response = await fetch('/api?XTransformPort=8080/api/consultas?tipo=numero&q=65999701064&apikey=test-key');
const data = await response.json();

// Consultar CPF
const response = await fetch('/api?XTransformPort=8080/api/consultas?tipo=cpf&cpf=04815502161&apikey=test-key');
const data = await response.json();

// Consultar por nome
const response = await fetch('/api?XTransformPort=8080/api/consultas?tipo=nome&q=Silva&apikey=test-key');
const data = await response.json();
```

### Exemplo de Requisição (cURL)

```bash
# Consultar telefone
curl "http://localhost:8080/api/consultas?tipo=numero&q=65999701064&apikey=test-key"

# Consultar CPF
curl "http://localhost:8080/api/consultas?tipo=cpf&cpf=04815502161&apikey=test-key"

# Consultar por nome
curl "http://localhost:8080/api/consultas?tipo=nome&q=Silva&apikey=test-key"
```

## ⚠️ Notas Importantes

1. **Dados Reais**: Esta API consome dados de APIs externas e retorna informações reais.
2. **API Keys**: Todas as requisições requerem uma API key válida.
3. **Rate Limiting**: Considere implementar rate limiting em produção.
4. **Admin Key**: A admin key (`MutanoX3397`) tem acesso completo a todos os endpoints administrativos.
5. **Logs**: Os logs são armazenados em memória e mantêm as últimas 50 entradas.
6. **API Externa**: A API depende de serviços externos que podem ter limitações.

## 🔐 Segurança

- Sistema de autenticação via API keys
- CORS habilitado para todas as origens (configure para produção)
- Validação de entrada de dados
- Tratamento de erros adequado
- Logs de requisições com timestamps
- Controle de acesso por role (admin/user)

## 📝 API Externa

Esta API consome dados de APIs externas:
- Base de dados de CPF/Telefone (world-ecletix.onrender.com)

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

## 📄 Licença

MIT License - veja o arquivo LICENSE para detalhes.

## 👤 Autor

@MutanoX

## 🙋 Suporte

Para suporte, abra uma issue no repositório ou entre em contato com o autor.

## 🎉 Resultados Testados

### Teste com Telefone 65999701064
```
✅ Consulta realizada com sucesso!
   Total de resultados: 4
   Primeiro resultado:
   Nome: LUCIENE APARECIDA BALBINO FIDELIS
   CPF/CNPJ: 04815502161
   Cidade/UF: CACERES/MT
   Bairro: JUNCO
   CEP: 07820000
```

### Teste com CPF 04815502161
```
✅ Consulta de CPF realizada com sucesso!
   Nome: LUCIENE APARECIDA BALBINO FIDELIS
   CPF: 04815502161
   Data Nascimento: 04/02/1993 (32 anos)
   Sexo: F - FEMININO
   Situação: REGULAR
   Renda: R$ 541,64
   Endereços: 4 endereços completos
```

🚀 **API 100% FUNCIONAL COM DADOS REAIS!**
