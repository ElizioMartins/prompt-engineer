import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Importar rotas
import analyzeRoutes from './routes/analyze.routes.js';

// Configuração ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos do frontend (Angular build)
const publicPath = path.join(__dirname, '..', '..', 'public');
app.use(express.static(publicPath));

// Rota de diagnóstico
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Prompt Engineer API está funcionando',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Rotas da API
app.use('/api/analyze', analyzeRoutes);

// Rotas futuras (Part 4)
// app.use('/api/prompts', promptRoutes);
// app.use('/api/templates', templateRoutes);

// Catch-all: retorna index.html para rotas do Angular
app.get('*', (req, res) => {
  const indexPath = path.join(publicPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(404).json({ 
        erro: 'Frontend não encontrado. Execute ng build no diretório frontend.' 
      });
    }
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✓ Servidor rodando na porta ${PORT}`);
  console.log(`✓ Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✓ Health check: http://localhost:${PORT}/api/health`);
});

export default app;
