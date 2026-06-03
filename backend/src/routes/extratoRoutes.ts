// =============================================================================
// src/routes/extratoRoutes.ts — Rotas de Extrato
// Perfis exigidos: PROFESSOR (extrato de professor) · ALUNO (extrato de aluno)
// =============================================================================

import { Router } from 'express';
import ExtratoController from '../controllers/ExtratoController';
import { autenticarToken, verificarPerfil } from '../middlewares/authMiddleware';

const router = Router();

/**
 * GET /api/extratos/professor/:id
 * Retorna o extrato completo de um Professor.
 * Acesso: somente PROFESSOR autenticado.
 */
router.get(
  '/professor/:id',
  autenticarToken,
  verificarPerfil(['PROFESSOR']),
  ExtratoController.extratoProfessor.bind(ExtratoController)
);

/**
 * GET /api/extratos/aluno/:id
 * Retorna o extrato completo de um Aluno.
 * Acesso: somente ALUNO autenticado.
 */
router.get(
  '/aluno/:id',
  autenticarToken,
  verificarPerfil(['ALUNO']),
  ExtratoController.extratoAluno.bind(ExtratoController)
);

export default router;
