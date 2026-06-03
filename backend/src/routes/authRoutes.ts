// =============================================================================
// src/routes/authRoutes.ts — Rotas Públicas de Autenticação
//
// Estas rotas NÃO passam pelo middleware autenticarToken porque são o ponto
// de entrada: o usuário ainda não possui um token ao fazer login.
// =============================================================================

import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import { autenticarToken } from '../middlewares/authMiddleware';

const router = Router();

/**
 * POST /api/auth/login
 * Autentica o usuário e retorna um JWT assinado.
 */
router.post('/login', AuthController.login.bind(AuthController));

/**
 * GET /api/auth/me
 * Retorna os dados do usuário autenticado (id_usuario, tipo_perfil, id_perfil).
 * Requer Bearer token válido.
 */
router.get('/me', autenticarToken, AuthController.me.bind(AuthController));

export default router;
