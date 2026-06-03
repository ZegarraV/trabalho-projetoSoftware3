// =============================================================================
// src/routes/vantagemRoutes.ts — Unicred
// ATENÇÃO: A ordem das rotas importa no Express.
// =============================================================================

import { Router } from 'express';
import VantagemController from '../controllers/VantagemController';
import { autenticarToken, verificarPerfil } from '../middlewares/authMiddleware';

const router = Router();

// GET /api/vantagens — Lista vantagens ativas
router.get('/', autenticarToken, VantagemController.listar.bind(VantagemController));

// GET /api/vantagens/resgates — Lista resgates (EMPRESA)
router.get('/resgates', autenticarToken, verificarPerfil(['EMPRESA']), VantagemController.listarResgates.bind(VantagemController));

// GET /api/vantagens/:id — Busca vantagem específica
router.get('/:id', autenticarToken, VantagemController.buscarPorId.bind(VantagemController));

// POST /api/vantagens/resgatar — Resgata vantagem (ALUNO)
router.post('/resgatar', autenticarToken, verificarPerfil(['ALUNO']), VantagemController.resgatar.bind(VantagemController));

// POST /api/vantagens/validar-cupom — Valida cupom (EMPRESA)
router.post('/validar-cupom', autenticarToken, verificarPerfil(['EMPRESA']), VantagemController.validarCupom.bind(VantagemController));

// POST /api/vantagens — Cadastra vantagem (EMPRESA)
router.post('/', autenticarToken, verificarPerfil(['EMPRESA']), VantagemController.criar.bind(VantagemController));

// PUT /api/vantagens/:id — Atualiza vantagem (EMPRESA)
router.put('/:id', autenticarToken, verificarPerfil(['EMPRESA']), VantagemController.atualizar.bind(VantagemController));

// DELETE /api/vantagens/:id — Desativa vantagem (EMPRESA)
router.delete('/:id', autenticarToken, verificarPerfil(['EMPRESA']), VantagemController.desativar.bind(VantagemController));

export default router;
