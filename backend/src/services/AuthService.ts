// =============================================================================
// src/services/AuthService.ts — Autenticação e Emissão de Token JWT
//
// Responsabilidades:
//   1. Localizar o usuario pelo e-mail.
//   2. Comparar a senha em texto puro com o hash armazenado (bcryptjs).
//   3. Gerar e retornar um JWT assinado contendo id_usuario, email e tipo_perfil.
//
// O segredo JWT é lido de `process.env.JWT_SECRET`. Se ausente em produção,
// a aplicação lança um erro imediato para evitar tokens inseguros.
// =============================================================================

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/database';
import { TipoPerfil } from '@prisma/client';

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

export interface JwtPayload {
  id_usuario: number;
  email: string;
  tipo_perfil: TipoPerfil;
}

/** Shape completo retornado na resposta de login (mais o id do perfil vinculado). */
export interface LoginResultado {
  token: string;
  usuario: JwtPayload & { id_perfil: number | null };
}

// ---------------------------------------------------------------------------
// Helpers privados
// ---------------------------------------------------------------------------

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error(
      'JWT_SECRET não definido nas variáveis de ambiente. ' +
      'Adicione JWT_SECRET=<segredo-forte> ao arquivo .env antes de iniciar o servidor.'
    );
  }
  return secret;
}

/**
 * Retorna o tempo de expiração em segundos.
 * Lê JWT_EXPIRES_IN_SECONDS do .env (padrão: 28800 = 8 horas).
 */
function getJwtExpiresIn(): number {
  const raw = process.env.JWT_EXPIRES_IN_SECONDS;
  const parsed = raw ? parseInt(raw, 10) : NaN;
  return isNaN(parsed) ? 28800 : parsed;
}

// ---------------------------------------------------------------------------
// Serviço
// ---------------------------------------------------------------------------

class AuthService {
  /**
   * Autentica um usuário pelo e-mail e senha.
   * Retorna o token JWT, os dados do payload e o id_perfil específico
   * (id_professor, id_aluno ou id_empresa) para uso imediato no front-end.
   *
   * Lança erro descritivo em caso de credenciais inválidas ou conta inativa.
   */
  async login(email: string, senha: string): Promise<LoginResultado> {
    // PASSO 1: Localiza o usuário pelo e-mail
    const usuario = await prisma.usuario.findUnique({
      where: { email_login: email },
    });

    // Mensagem genérica intencional — não revela se o e-mail existe ou não
    const erroCredenciais = new Error('E-mail ou senha inválidos.');

    if (!usuario) throw erroCredenciais;

    // PASSO 2: Verifica se a conta está ativa
    if (!usuario.ativo) {
      throw new Error('Conta desativada. Entre em contato com o suporte.');
    }

    // PASSO 3: Compara a senha com o hash armazenado
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha_hash);
    if (!senhaCorreta) throw erroCredenciais;

    // PASSO 4: Monta o payload e assina o token
    const payload: JwtPayload = {
      id_usuario: usuario.id_usuario,
      email: usuario.email_login,
      tipo_perfil: usuario.tipo_perfil,
    };

    const token = jwt.sign(payload, getJwtSecret(), {
      expiresIn: getJwtExpiresIn(),
    });

    // PASSO 5: Busca o id do perfil vinculado para evitar fetch extra no front-end
    const id_perfil = await this.resolverIdPerfil(usuario.id_usuario, usuario.tipo_perfil);

    return { token, usuario: { ...payload, id_perfil } };
  }

  /**
   * Retorna os dados do usuário autenticado (via token JWT) incluindo id_perfil.
   * Usado pelo endpoint GET /api/auth/me.
   */
  async me(id_usuario: number, tipo_perfil: TipoPerfil): Promise<{ id_usuario: number; tipo_perfil: TipoPerfil; id_perfil: number | null }> {
    const id_perfil = await this.resolverIdPerfil(id_usuario, tipo_perfil);
    return { id_usuario, tipo_perfil, id_perfil };
  }

  /**
   * Resolve o id específico do perfil (id_professor, id_aluno, id_empresa)
   * a partir do id_usuario genérico da tabela `usuarios`.
   */
  private async resolverIdPerfil(id_usuario: number, tipo_perfil: TipoPerfil): Promise<number | null> {
    if (tipo_perfil === 'PROFESSOR') {
      const prof = await prisma.professor.findUnique({ where: { id_usuario } });
      return prof?.id_professor ?? null;
    }
    if (tipo_perfil === 'ALUNO') {
      const aluno = await prisma.aluno.findUnique({ where: { id_usuario } });
      return aluno?.id_aluno ?? null;
    }
    if (tipo_perfil === 'EMPRESA') {
      const empresa = await prisma.empresaParceira.findUnique({ where: { id_usuario } });
      return empresa?.id_empresa ?? null;
    }
    return null;
  }
}

export default new AuthService();
