// =============================================================================
// src/middlewares/authMiddleware.ts — Autenticação e Controle de Acesso (RBAC)
//
// Exporta dois middlewares independentes:
//
//   autenticarToken  — Valida o JWT no header Authorization.
//                      Anexa o payload decodificado em req.usuario.
//                      Retorna 401 se ausente/inválido/expirado.
//
//   verificarPerfil  — Fábrica de middleware de autorização.
//                      Recebe uma lista de TipoPerfil permitidos e retorna
//                      403 se req.usuario.tipo_perfil não estiver na lista.
//                      Deve ser usado APÓS autenticarToken na cadeia de
//                      middlewares da rota.
// =============================================================================

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { TipoPerfil } from '@prisma/client';
import { JwtPayload } from '../services/AuthService';

// ---------------------------------------------------------------------------
// Helper — lê o segredo sem lançar na importação do módulo
// ---------------------------------------------------------------------------

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET não definido nas variáveis de ambiente.');
  return secret;
}

// ---------------------------------------------------------------------------
// autenticarToken
// ---------------------------------------------------------------------------

/**
 * Middleware global de autenticação via Bearer Token.
 *
 * Espera o header:  Authorization: Bearer <jwt>
 *
 * Em caso de sucesso, popula `req.usuario` com o payload decodificado e chama
 * `next()`. Em caso de falha, encerra a requisição com 401.
 */
export function autenticarToken(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      sucesso: false,
      mensagem: 'Token de autenticação não fornecido.',
    });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, getJwtSecret()) as JwtPayload;

    req.usuario = {
      id_usuario: payload.id_usuario,
      email: payload.email,
      tipo_perfil: payload.tipo_perfil,
    };

    next();
  } catch (erro) {
    const expirado = erro instanceof jwt.TokenExpiredError;

    res.status(401).json({
      sucesso: false,
      mensagem: expirado
        ? 'Token expirado. Faça login novamente.'
        : 'Token inválido ou mal-formado.',
    });
  }
}

// ---------------------------------------------------------------------------
// verificarPerfil
// ---------------------------------------------------------------------------

/**
 * Fábrica de middleware de autorização baseada em perfis (RBAC).
 *
 * Uso:
 *   router.post('/enviar', autenticarToken, verificarPerfil(['PROFESSOR']), controller.acao)
 *
 * @param perfisPermitidos  Lista de TipoPerfil que têm acesso à rota.
 *
 * Retorna 403 se o perfil do usuário autenticado não constar na lista.
 * Pressupõe que `autenticarToken` já foi executado (req.usuario populado).
 */
export function verificarPerfil(perfisPermitidos: TipoPerfil[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const usuario = req.usuario;

    if (!usuario) {
      // Salvaguarda: não deveria acontecer se autenticarToken vier antes
      res.status(401).json({ sucesso: false, mensagem: 'Não autenticado.' });
      return;
    }

    if (!perfisPermitidos.includes(usuario.tipo_perfil)) {
      res.status(403).json({
        sucesso: false,
        mensagem: `Acesso negado. Esta rota é restrita a: ${perfisPermitidos.join(', ')}.`,
      });
      return;
    }

    next();
  };
}
