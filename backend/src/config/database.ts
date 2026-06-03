// =============================================================================
// src/config/database.ts — Singleton do PrismaClient
// Padrão Singleton garante uma única instância de conexão no ciclo de vida
// da aplicação, evitando o esgotamento do pool de conexões do PostgreSQL.
// =============================================================================

import { PrismaClient } from '@prisma/client';

// Cria o cliente Prisma com logging habilitado para ambiente de desenvolvimento.
// Em produção, remova ou reduza os níveis de log para 'warn' e 'error'.
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development'
    ? ['query', 'info', 'warn', 'error']
    : ['warn', 'error'],
});

export default prisma;
