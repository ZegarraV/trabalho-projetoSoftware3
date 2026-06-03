// =============================================================================
// src/routes/alunoRoutes.ts — Definição das Rotas para a entidade Aluno
//
// Cada rota aplica os middlewares de validação antes de chegar ao Controller,
// seguindo o fluxo: Middleware (validação) → Controller → Service → Prisma
// =============================================================================

import { Router } from 'express';
import AlunoController from '../controllers/AlunoController';
import {
  validarCampos,
  validarFormatoCPF,
} from '../middlewares/validationMiddleware';
import { autenticarToken, verificarPerfil } from '../middlewares/authMiddleware';

const router = Router();

// Campos obrigatórios para o cadastro de um Aluno
const camposObrigatoriosCadastro = [
  'email_login',
  'senha',
  'nome_completo',
  'cpf',
];

/**
 * POST /api/alunos — Cadastra um novo aluno
 * Middlewares: validação de campos obrigatórios → validação de formato CPF
 */
router.post(
  '/',
  validarCampos(camposObrigatoriosCadastro),
  validarFormatoCPF,
  AlunoController.criar.bind(AlunoController)
);

/**
 * GET /api/alunos — Lista todos os alunos
 * Acesso: PROFESSOR ou EMPRESA autenticados.
 */
router.get(
  '/',
  autenticarToken,
  verificarPerfil(['PROFESSOR', 'EMPRESA']),
  AlunoController.listar.bind(AlunoController)
);

/**
 * GET /api/alunos/:id — Busca um aluno por ID
 * Acesso: qualquer usuário autenticado.
 */
router.get('/:id', autenticarToken, AlunoController.buscarPorId.bind(AlunoController));

/**
 * PUT /api/alunos/:id — Atualiza um aluno
 * Acesso: somente ALUNO autenticado (atualiza o próprio perfil).
 */
router.put(
  '/:id',
  autenticarToken,
  verificarPerfil(['ALUNO']),
  validarFormatoCPF,
  AlunoController.atualizar.bind(AlunoController)
);

/**
 * DELETE /api/alunos/:id — Remove um aluno
 * Acesso: somente ALUNO autenticado.
 */
router.delete(
  '/:id',
  autenticarToken,
  verificarPerfil(['ALUNO']),
  AlunoController.deletar.bind(AlunoController)
);

export default router;
