// =============================================================================
// src/server.ts — Ponto de Entrada da Aplicação Express
//
// Inicializa o servidor, configura middlewares globais e registra as rotas.
// =============================================================================

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import alunoRoutes from './routes/alunoRoutes';
import empresaRoutes from './routes/empresaRoutes';
import professorRoutes from './routes/professorRoutes';
import transacaoRoutes from './routes/transacaoRoutes';
import extratoRoutes from './routes/extratoRoutes';
import authRoutes from './routes/authRoutes';
import vantagemRoutes from './routes/vantagemRoutes';

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3333;

// ---------------------------------------------------------------------------
// Middlewares Globais
// ---------------------------------------------------------------------------

// Habilita CORS para permitir requisições do front-end (localhost:5173 Vite)
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Interpreta o corpo das requisições como JSON
app.use(express.json());

// ---------------------------------------------------------------------------
// Rotas da API
// ---------------------------------------------------------------------------

// Rota de verificação de saúde da aplicação
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'OK',
    mensagem: 'Sistema de Moeda Estudantil — API operacional',
    timestamp: new Date().toISOString(),
  });
});

// Rotas dos recursos
app.use('/api/auth', authRoutes);
app.use('/api/alunos', alunoRoutes);
app.use('/api/empresas', empresaRoutes);
app.use('/api/professores', professorRoutes);
app.use('/api/transacoes', transacaoRoutes);
app.use('/api/extratos', extratoRoutes);
app.use('/api/vantagens', vantagemRoutes);

// ---------------------------------------------------------------------------
// Tratamento de rotas não encontradas (404)
// ---------------------------------------------------------------------------
app.use((_req, res) => {
  res.status(404).json({ sucesso: false, mensagem: 'Rota não encontrada.' });
});

// ---------------------------------------------------------------------------
// Inicialização do servidor
// ---------------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📋 API disponível em http://localhost:${PORT}/api/health\n`);
});

export default app;
