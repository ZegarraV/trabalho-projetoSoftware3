// =============================================================================
// src/routes/professorRoutes.ts — Rotas para Professor
// =============================================================================

// =============================================================================
// src/routes/professorRoutes.ts — Rotas para Professor
// POST (cadastro) é público; leituras exigem autenticação.
// =============================================================================

import { Router } from 'express';
import ProfessorController from '../controllers/ProfessorController';
import { validarCampos, validarFormatoCPF } from '../middlewares/validationMiddleware';
import { autenticarToken, verificarPerfil } from '../middlewares/authMiddleware';

const router = Router();

/**
 * POST /api/professores — Cadastra um novo professor (rota pública de registro)
 */
router.post(
  '/',
  validarCampos(['email_login', 'senha', 'nome_completo', 'cpf']),
  validarFormatoCPF,
  ProfessorController.criar.bind(ProfessorController)
);

/**
 * GET /api/professores — Lista professores
 * Acesso: ALUNO (para montar o select de destinatário) ou PROFESSOR.
 */
router.get(
  '/',
  autenticarToken,
  verificarPerfil(['PROFESSOR', 'ALUNO']),
  ProfessorController.listar.bind(ProfessorController)
);

/**
 * GET /api/professores/:id — Busca professor por ID
 * Acesso: qualquer usuário autenticado.
 */
router.get('/:id', autenticarToken, ProfessorController.buscarPorId.bind(ProfessorController));

export default router;
