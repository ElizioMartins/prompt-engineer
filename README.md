# Prompt Engineer 🚀

Plataforma Node.js para engenharia de prompts de alta precisão com interface de 9 pilares, análise multi-modelo via OpenRouter e exportação JSON/TOON.

## 🎯 Características

- **Interface de 3 Colunas**: Navegação dos 9 pilares fundamentais, inputs dinâmicos e análise em tempo real
- **OpenRouter Integration**: Acesso a 200+ modelos com fallback automático entre 3 modelos configuráveis
- **Exportação JSON/TOON**: Economia de 30-60% de tokens com formato TOON
- **9 Pilares de Prompt Engineering**:
  1. Task Context
  2. Tone Context
  3. Background Data
  4. Detailed Task & Rules
  5. Examples
  6. Conversation History
  7. Immediate Task
  8. Thinking Step by Step
  9. Output Formatting

## 🛠️ Stack Tecnológica

- **Backend**: Express.js 4.18.x + MySQL2
- **Frontend**: Angular 18 (standalone components)
- **IA**: OpenRouter API (14,400 requests/dia gratuitos)
- **Deploy**: HaskHosting NodeJS (R$ 3.99-6.99/mês)

## 📦 Instalação

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Edite .env com suas credenciais MySQL
npm run init-db  # Criar tabelas
npm run dev      # Desenvolvimento
```

### Frontend (próximas partes)

```bash
cd frontend
npm install
ng serve
```

## 🚀 Deploy HaskHosting

1. Criar banco MySQL via painel HaskHosting
2. Build frontend: `cd frontend && ng build`
3. Copiar dist para `/public`
4. Configurar `.env` no servidor
5. `npm start` no backend

## 📝 Configuração OpenRouter

1. Obtenha API Key gratuita em [openrouter.ai/keys](https://openrouter.ai/keys)
2. Configure no frontend via Config Panel (localStorage)
3. Defina 3 modelos para fallback automático:
   - Modelo 1: `google/gemma-4-26b-a4b-it:free`
   - Modelo 2: `minimax/minimax-m2.5:free`
   - Modelo 3: `nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free`

## 🗂️ Estrutura do Projeto

```
prompt-engineer/
├── backend/
│   ├── src/
│   │   ├── server.js           # Express server
│   │   ├── config/             # (Part 2)
│   │   ├── routes/             # (Part 3-4)
│   │   └── scripts/            # (Part 2)
│   ├── package.json
│   └── .env.example
├── frontend/                   # (Part 5+)
├── public/                     # Angular build output
└── README.md
```

## 📊 Custos

- **Hospedagem**: R$ 3.99-6.99/mês (HaskHosting NodeJS)
- **IA**: R$ 0 (OpenRouter tier gratuito: 14,400 req/dia)
- **Total**: R$ 3.99-6.99/mês

## 🔗 Links Úteis

- [OpenRouter API](https://openrouter.ai/)
- [Formato TOON](https://github.com/toon-format/toon)
- [HaskHosting](https://haskhosting.com.br/)

## 📄 Licença

MIT

---

**Status**: Part 1 ✅ - Backend scaffolding completo
