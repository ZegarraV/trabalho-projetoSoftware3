// =============================================================================
// src/controllers/AuthController.ts — Controller de Autenticação
//
// Trata somente a camada HTTP: extrai credenciais do body, aciona o
// AuthService e devolve a resposta adequada. Nenhuma regra de negócio aqui.
// =============================================================================

import { Request, Response } from 'express';
import AuthService from '../services/AuthService';

class AuthController {
  /**
   * POST /api/auth/login
   * Body: { email, senha }
   *
   * Respostas:
   *   200 — Login bem-sucedido. Retorna token JWT e dados básicos do usuário.
   *   400 — Body incompleto (email ou senha ausentes).
   *   401 — Credenciais inválidas ou conta inativa.
   *   500 — Erro interno inesperado.
   */
  async login(req: Request, res: Response): Promise<void> {
    const { email, senha } = req.body;

    if (!email || !senha) {
      res.status(400).json({
        sucesso: false,
        mensagem: 'Os campos "email" e "senha" são obrigatórios.',
      });
      return;
    }

    try {
      const resultado = await AuthService.login(String(email).trim(), String(senha));

      res.status(200).json({
        sucesso: true,
        mensagem: 'Login realizado com sucesso.',
        dados: {
          token: resultado.token,
          usuario: resultado.usuario,
        },
      });
    } catch (erro: unknown) {
      const mensagem = erro instanceof Error ? erro.message : 'Erro interno do servidor.';

      const status =
        mensagem.includes('inválidos') || mensagem.includes('desativada') ? 401 : 500;

      res.status(status).json({ sucesso: false, mensagem });
    }
  }

  /**
   * GET /api/auth/me
   * Retorna os dados do usuário autenticado e seu id_perfil.
   * Requer autenticarToken no middleware da rota.
   */
  async me(req: Request, res: Response): Promise<void> {
    try {
      const { id_usuario, email, tipo_perfil } = req.usuario!;
      const dados = await AuthService.me(id_usuario, tipo_perfil);

      res.status(200).json({
        sucesso: true,
        dados: { ...dados, email },
      });
    } catch (erro: unknown) {
      const mensagem = erro instanceof Error ? erro.message : 'Erro interno do servidor.';
      res.status(500).json({ sucesso: false, mensagem });
    }
  }
}

export default new AuthController();
