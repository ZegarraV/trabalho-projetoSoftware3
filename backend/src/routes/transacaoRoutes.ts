// =============================================================================
// src/routes/transacaoRoutes.ts — Rotas de Transferência de Moedas
// Perfil exigido: PROFESSOR
// =============================================================================

import { Router } from 'express';
import TransacaoController from '../controllers/TransacaoController';
import { validarCampos } from '../middlewares/validationMiddleware';
import { autenticarToken, verificarPerfil } from '../middlewares/authMiddleware';

const router = Router();

/**
 * POST /api/transacoes/enviar
 * Transfere moedas de um Professor para um Aluno.
 * Acesso: somente PROFESSOR autenticado.
 */
router.post(
  '/enviar',
  autenticarToken,
  verificarPerfil(['PROFESSOR']),
  validarCampos(['idProfessor', 'idAluno', 'quantidade', 'motivo']),
  TransacaoController.enviarMoedas.bind(TransacaoController)
);

export default router;
