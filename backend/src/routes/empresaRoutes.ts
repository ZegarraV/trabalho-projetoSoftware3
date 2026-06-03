// =============================================================================
// src/routes/empresaRoutes.ts — Definição das Rotas para EmpresaParceira
// =============================================================================

import { Router } from 'express';
import EmpresaController from '../controllers/EmpresaController';
import {
  validarCampos,
  validarFormatoCNPJ,
} from '../middlewares/validationMiddleware';
import { autenticarToken, verificarPerfil } from '../middlewares/authMiddleware';

const router = Router();

// Campos obrigatórios para o cadastro de uma Empresa
const camposObrigatoriosCadastro = [
  'email_login',
  'senha',
  'razao_social',
  'cnpj',
];

/**
 * POST /api/empresas — Cadastra uma nova empresa parceira
 */
router.post(
  '/',
  validarCampos(camposObrigatoriosCadastro),
  validarFormatoCNPJ,
  EmpresaController.criar.bind(EmpresaController)
);

/**
 * GET /api/empresas — Lista todas as empresas parceiras
 * Acesso: ALUNO autenticado (para ver onde resgatar vantagens).
 */
router.get(
  '/',
  autenticarToken,
  verificarPerfil(['ALUNO', 'EMPRESA']),
  EmpresaController.listar.bind(EmpresaController)
);

/**
 * GET /api/empresas/:id — Busca uma empresa por ID
 * Acesso: qualquer usuário autenticado.
 */
router.get('/:id', autenticarToken, EmpresaController.buscarPorId.bind(EmpresaController));

/**
 * PUT /api/empresas/:id — Atualiza uma empresa
 * Acesso: somente EMPRESA autenticada (atualiza o próprio perfil).
 */
router.put(
  '/:id',
  autenticarToken,
  verificarPerfil(['EMPRESA']),
  validarFormatoCNPJ,
  EmpresaController.atualizar.bind(EmpresaController)
);

/**
 * DELETE /api/empresas/:id — Remove uma empresa
 * Acesso: somente EMPRESA autenticada.
 */
router.delete(
  '/:id',
  autenticarToken,
  verificarPerfil(['EMPRESA']),
  EmpresaController.deletar.bind(EmpresaController)
);

export default router;
