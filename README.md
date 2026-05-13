# 🚀 Prompt Engineer

**Plataforma de Engenharia de Prompts de Alta Precisão**

Sistema completo para criação, análise e otimização de prompts estruturados usando 9 pilares fundamentais, análise multi-modelo via OpenRouter e exportação em formatos otimizados (JSON/TOON).

---

## ✨ Features

### 🎯 9 Pilares Fundamentais
- **Task Context**: Contexto e papel da IA
- **Tone Context**: Tom e estilo de comunicação
- **Background Data**: Dados, documentos e contexto
- **Detailed Task & Rules**: Descrição detalhada com regras
- **Examples**: Few-shot learning
- **Conversation History**: Histórico para continuidade
- **Immediate Task**: Solicitação específica
- **Thinking Step**: Chain-of-Thought
- **Output Format**: Formato de saída desejado

### 🤖 Análise OpenRouter
- **3 Modelos com Fallback**: Tenta sequencialmente modelo 1 → 2 → 3
- **Métricas em Tempo Real**: Clareza, Altitude e Precisão (0-10)
- **Feedback Detalhado**: Sugestões de melhoria do prompt
- **Modelos Gratuitos**: 14,400 requests/dia

### 💾 Exportação Inteligente
- **Texto**: Formato legível com delimitadores
- **JSON**: Estrutura nativa para APIs
- **TOON**: 30-60% economia de tokens (Token-Oriented Object Notation)
- **Copy/Download**: Compartilhamento rápido

### 📊 Playground
- 3 tabs (Texto/JSON/TOON) com contador de tokens
- Análise visual de métricas
- Botões de ação: copiar, download, compartilhar

---

## 🛠️ Stack Técnico

### Backend
- **Node.js** 18+ com Express 4.18.2
- **MySQL2** 3.6.5 (connection pooling)
- **OpenRouter API** (200+ modelos disponíveis)
- **CORS** habilitado para desenvolvimento

### Frontend
- **Angular 18** (standalone components)
- **RxJS** 7.8 (reactive state management)
- **TypeScript** 5.4
- **localStorage** para configurações

### Banco de Dados
```sql
-- 2 tabelas
CREATE TABLE prompts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  taskContext TEXT,
  toneContext TEXT,
  backgroundData TEXT,
  detailedTask TEXT,
  examples TEXT,
  conversationHistory TEXT,
  immediateTask TEXT,
  thinkingStep TEXT,
  outputFormat TEXT,
  jsonOutput LONGTEXT,
  toonOutput LONGTEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE templates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  categoria VARCHAR(100),
  /* mesmos campos de prompts */
);
```

---

## 📦 Instalação

### 1. Clone o Repositório
```bash
git clone https://github.com/ElizioMartins/prompt-engineer.git
cd prompt-engineer
```

### 2. Backend Setup
```bash
cd backend
npm install

# Configurar .env
cp .env.example .env
# Editar .env com suas credenciais MySQL

# Inicializar banco de dados
npm run init-db

# Iniciar servidor
npm run dev  # Desenvolvimento (nodemon)
npm start    # Produção
```

### 3. Frontend Setup
```bash
cd frontend
npm install

# Desenvolvimento
npm start  # http://localhost:4200

# Build de produção (output: ../public)
npm run build:prod
```

### 4. Configurar OpenRouter
1. Obtenha sua API Key gratuita: https://openrouter.ai/keys
2. Abra http://localhost:4200
3. Clique em "⚙️ Configurações OpenRouter"
4. Cole sua API Key (`sk-or-v1-...`)
5. Configure 3 modelos gratuitos (ou mantenha os padrões):
   - `google/gemma-4-26b-a4b-it:free`
   - `minimax/minimax-m2.5:free`
   - `nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free`

---

## 🚀 Deploy (HaskHosting)

### Requisitos
- **NodeJS 2GB Plan** (R$ 3,99/mês) ou 4GB (R$ 6,99/mês)
- **MySQL** 5.7+ incluído no plano
- **RAM**: 80-150MB (Express otimizado)

### Passos
1. **Build do Frontend**:
   ```bash
   cd frontend
   npm run build:prod  # Output: ../public
   ```

2. **Upload via FTP/SFTP**:
   - Envie pasta `backend/` completa
   - Envie pasta `public/` (com build Angular)

3. **Configurar no Painel HaskHosting**:
   - Node Version: 18 ou superior
   - Entry Point: `backend/src/server.js`
   - Environment Variables:
     ```
     DB_HOST=localhost
     DB_USER=seu_usuario
     DB_PASSWORD=sua_senha
     DB_DATABASE=PromptEngineer
     PORT=3000
     NODE_ENV=production
     APP_URL=https://seudominio.com
     ```

4. **Inicializar Banco**:
   ```bash
   ssh usuario@servidor
   cd backend
   npm run init-db
   ```

5. **Reiniciar App** via painel do HaskHosting

---

## 📖 Uso

### 1. Criar um Novo Prompt
1. Navegue pelos **9 pilares** na coluna esquerda
2. Preencha cada campo na coluna central
3. Visualize o progresso (%) no navegador
4. Veja o output atualizar em tempo real no Playground (coluna direita)

### 2. Analisar Prompt
1. Preencha pelo menos 3 pilares
2. Clique em **🔍 Analisar** no Playground
3. Aguarde a análise (fallback automático entre 3 modelos)
4. Veja métricas:
   - **Clareza** (0-10): Quão compreensível é o prompt
   - **Altitude** (0-10): Nível de contexto fornecido
   - **Precisão** (0-10): Especificidade das instruções

### 3. Exportar Prompt
1. Escolha a aba: **Texto**, **JSON** ou **TOON**
2. Clique em **📋 Copiar**, **💾 Download** ou **🔗 Compartilhar**
3. Use o conteúdo exportado em sua aplicação

---

## 💰 Custos

### Infraestrutura
- **HaskHosting NodeJS**: R$ 3,99-6,99/mês
- **OpenRouter API**: Gratuito (14,400 requests/dia com modelos free)

### Modelos Pagos (Opcional)
Se precisar usar modelos premium via OpenRouter:
- GPT-4o: ~$0.0025-0.01 por 1K tokens
- Claude 3.5 Sonnet: ~$0.003-0.015 por 1K tokens
- Gemini 1.5 Pro: ~$0.00125-0.005 por 1K tokens

**Total estimado**: R$ 3,99/mês (apenas hospedagem + API gratuita)

---

## 🔗 Endpoints da API

### Análise
```http
POST /api/analyze
Content-Type: application/json

{
  "prompt": { /* PromptData */ },
  "models": ["model1", "model2", "model3"],
  "apiKey": "sk-or-v1-..."
}

Response:
{
  "success": true,
  "model": "google/gemma-4-26b-a4b-it:free",
  "attemptNumber": 1,
  "totalAttempts": 3,
  "timestamp": "2026-05-13T12:00:00.000Z",
  "analysis": {
    "clarity": 8,
    "altitude": 7,
    "precision": 9,
    "feedback": "Prompt bem estruturado..."
  }
}
```

### Prompts CRUD
```http
GET    /api/prompts       # Listar todos (limit 100)
GET    /api/prompts/:id   # Buscar por ID
POST   /api/prompts       # Criar novo
PUT    /api/prompts/:id   # Atualizar
DELETE /api/prompts/:id   # Deletar
```

### Templates CRUD
```http
GET    /api/templates              # Listar todos
GET    /api/templates/categorias   # Listar categorias
GET    /api/templates/:id          # Buscar por ID
POST   /api/templates              # Criar template
PUT    /api/templates/:id          # Atualizar
DELETE /api/templates/:id          # Deletar
```

### Health Check
```http
GET /api/health

Response:
{
  "status": "healthy",
  "timestamp": "2026-05-13T12:00:00.000Z"
}
```

---

## 🧩 Arquitetura

```
prompt-engineer/
├── backend/
│   ├── src/
│   │   ├── server.js              # Express app principal
│   │   ├── config/
│   │   │   └── database.js        # MySQL connection pool
│   │   ├── routes/
│   │   │   ├── analyze.routes.js  # OpenRouter proxy + fallback
│   │   │   ├── prompt.routes.js   # CRUD prompts
│   │   │   └── template.routes.js # CRUD templates
│   │   └── scripts/
│   │       └── initDb.js          # Database initialization
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   ├── config-panel/
│   │   │   │   │   └── config-panel.component.ts
│   │   │   │   ├── pillar-navigator/
│   │   │   │   │   └── pillar-navigator.component.ts
│   │   │   │   ├── pillar-input/
│   │   │   │   │   └── pillar-input.component.ts
│   │   │   │   └── playground/
│   │   │   │       └── playground.component.ts
│   │   │   ├── services/
│   │   │   │   ├── config.service.ts
│   │   │   │   ├── analyze.service.ts
│   │   │   │   ├── prompt.service.ts
│   │   │   │   └── prompt-api.service.ts
│   │   │   └── app.component.ts
│   │   ├── environments/
│   │   │   ├── environment.ts      # Dev (localhost:3000)
│   │   │   └── environment.prod.ts # Prod (/api)
│   │   ├── index.html
│   │   ├── main.ts
│   │   └── styles.css
│   ├── angular.json               # Build output: ../public
│   ├── tsconfig.json
│   └── package.json
│
├── public/                        # Angular build output (served by Express)
│   └── .gitkeep
│
├── .gitignore
└── README.md
```

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit: `git commit -am 'feat: adiciona nova funcionalidade'`
4. Push: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

---

## 📄 Licença

**MIT License** - Veja [LICENSE](LICENSE) para mais detalhes.

---

## 📚 Referências

- [OpenRouter API](https://openrouter.ai/docs)
- [TOON Format](https://github.com/toon-format/toon)
- [Anthropic: Context Engineering](https://www.anthropic.com/news/context-engineering)
- [OpenAI: Prompt Engineering](https://platform.openai.com/docs/guides/prompt-engineering)
- [Claude: Prompting Best Practices](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/best-practices)

---

## 🙋 Suporte

- **Issues**: https://github.com/ElizioMartins/prompt-engineer/issues
- **Discussões**: https://github.com/ElizioMartins/prompt-engineer/discussions

---

**Desenvolvido com ❤️ para otimizar a engenharia de prompts**
