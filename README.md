# MutanoX API

API robusta para consulta de informações de telefone e CPF, com dashboard de métricas em tempo real.

## 🚀 Funcionalidades

- **Consulta de Telefone**: Obtém informações detalhadas de números de telefone brasileiros
- **Consulta de CPF**: Valida e retorna informações de CPF
- **Dashboard em Tempo Real**: Métricas de uso da API
- **Histórico de Consultas**: Registro de todas as requisições
- **Validação de Dados**: Validação robusta de entrada

## 📋 Pré-requisitos

- Node.js 18+ ou Bun
- npm ou bun

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd MutanoX_API
```

2. Instale as dependências:
```bash
npm install
# ou
bun install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
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

A API estará disponível em `http://localhost:3001`

## 📡 Rotas da API

### Consultas

#### Consultar Telefone
```http
GET /api/telefone/:numero
```

**Parâmetros:**
- `numero`: Número de telefone (com ou sem formatação)

**Exemplo:**
```bash
curl http://localhost:3001/api/telefone/65999701064
```

**Resposta:**
```json
{
  "sucesso": true,
  "dados": {
    "telefone": "65999701064",
    "formato": "(65) 99970-1064",
    "ddd": "65",
    "estado": "MT",
    "tipo": "Celular",
    "operadora": "Vivo",
    "cpf": "123.456.789-00",
    "dataConsulta": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Consultar CPF
```http
GET /api/cpf/:cpf
```

**Parâmetros:**
- `cpf`: CPF (com ou sem formatação)

**Exemplo:**
```bash
curl http://localhost:3001/api/cpf/12345678900
```

**Resposta:**
```json
{
  "sucesso": true,
  "dados": {
    "cpf": "123.456.789-00",
    "nome": "João Silva",
    "situacao": "Regular",
    "dataNascimento": "15/03/1985",
    "uf": "SP",
    "cidade": "São Paulo",
    "genero": "Masculino",
    "dataConsulta": "2024-01-15T10:30:00.000Z"
  }
}
```

### Dashboard

#### Métricas do Dashboard
```http
GET /api/dashboard/metricas
```

**Resposta:**
```json
{
  "sucesso": true,
  "dados": {
    "totalConsultas": 150,
    "consultasTelefone": 100,
    "consultasCPF": 50,
    "consultasHoje": 25,
    "erros": 3,
    "consultasRecentes": {
      "telefone": [...],
      "cpf": [...]
    }
  }
}
```

#### Histórico de Consultas
```http
GET /api/dashboard/historico/:tipo?limite=50
```

**Parâmetros:**
- `tipo`: "telefone" ou "cpf"
- `limite`: Número de registros (opcional, padrão: 50)

**Exemplo:**
```bash
curl http://localhost:3001/api/dashboard/historico/telefone?limite=10
```

#### Limpar Histórico
```http
DELETE /api/dashboard/historico/:tipo
```

**Parâmetros:**
- `tipo`: "telefone" ou "cpf"

### Sistema

#### Status da API
```http
GET /api/status
```

**Resposta:**
```json
{
  "sucesso": true,
  "status": "online",
  "versao": "1.0.0",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600.5
}
```

#### Rotas Disponíveis
```http
GET /
```

## 🧪 Testes

Execute os testes para verificar se a API está funcionando corretamente:

```bash
npm test
# ou
bun run test
```

O teste irá:
1. Verificar o status da API
2. Consultar o telefone 65999701064
3. Consultar um CPF de teste
4. Obter métricas do dashboard
5. Obter histórico de consultas
6. Testar validação de telefone inválido
7. Testar validação de CPF inválido

## 📊 Dashboard Frontend

Para visualizar o dashboard frontend, acesse a aplicação Next.js em `/dashboard`.

## 🏗️ Estrutura do Projeto

```
MutanoX_API/
├── server.js              # Servidor principal da API
├── test.js                # Script de testes
├── package.json           # Dependências e scripts
├── .env.example           # Exemplo de variáveis de ambiente
├── README.md              # Documentação
└── .env                   # Variáveis de ambiente (criado pelo usuário)
```

## 🔐 Segurança

- CORS habilitado para todas as origens (configure para produção)
- Validação de entrada de dados
- Tratamento de erros adequado
- Logs de erro no console

## 📝 Notas

- Os dados retornados são simulados para fins de demonstração
- Em produção, integre com APIs reais de consulta
- Considere implementar autenticação para proteger as rotas
- Adicione rate limiting para prevenir abuso

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

## 📄 Licença

MIT License - veja o arquivo LICENSE para detalhes.

## 👤 Autor

MutanoX

## 🙋 Suporte

Para suporte, abra uma issue no repositório ou entre em contato com o autor.
