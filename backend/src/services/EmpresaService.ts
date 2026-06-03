// =============================================================================
// src/services/EmpresaService.ts — Camada de Regra de Negócio para Empresa
//
// REGRA CENTRAL (Lab03S02):
//   O cadastro de uma EmpresaParceira DEVE criar primeiro um registro em
//   `usuarios` com tipo_perfil = 'EMPRESA' e depois vincular o id_usuario.
//   Operações encapsuladas em transação para garantir atomicidade.
// =============================================================================

import bcrypt from 'bcryptjs';
import prisma from '../config/database';

// ---------------------------------------------------------------------------
// DTOs
// ---------------------------------------------------------------------------

export interface CriarEmpresaDTO {
  // Credenciais
  email_login: string;
  senha: string;

  // Dados da empresa
  razao_social: string;
  nome_fantasia?: string;
  cnpj: string;
  contato_nome?: string;
}

export interface AtualizarEmpresaDTO {
  email_login?: string;
  senha?: string;
  razao_social?: string;
  nome_fantasia?: string;
  contato_nome?: string;
}

// ---------------------------------------------------------------------------
// Serviço
// ---------------------------------------------------------------------------

class EmpresaService {
  /**
   * Cria uma EmpresaParceira e seu Usuario vinculado atomicamente.
   */
  async criarEmpresa(dados: CriarEmpresaDTO) {
    // Verifica duplicidade de e-mail
    const emailExistente = await prisma.usuario.findUnique({
      where: { email_login: dados.email_login },
    });
    if (emailExistente) {
      throw new Error('E-mail já cadastrado no sistema.');
    }

    // Verifica duplicidade de CNPJ
    const cnpjExistente = await prisma.empresaParceira.findUnique({
      where: { cnpj: dados.cnpj },
    });
    if (cnpjExistente) {
      throw new Error('CNPJ já cadastrado no sistema.');
    }

    const senha_hash = await bcrypt.hash(dados.senha, 10);

    const resultado = await prisma.$transaction(async (tx) => {
      // PASSO 1: Cria o registro base de autenticação com perfil EMPRESA
      const usuario = await tx.usuario.create({
        data: {
          email_login: dados.email_login,
          senha_hash,
          tipo_perfil: 'EMPRESA',
        },
      });

      // PASSO 2: Cria a EmpresaParceira vinculada
      const empresa = await tx.empresaParceira.create({
        data: {
          razao_social: dados.razao_social,
          nome_fantasia: dados.nome_fantasia,
          cnpj: dados.cnpj,
          contato_nome: dados.contato_nome,
          id_usuario: usuario.id_usuario,
        },
      });

      return { empresa, usuario };
    });

    const { empresa, usuario } = resultado;
    return {
      id_empresa: empresa.id_empresa,
      razao_social: empresa.razao_social,
      cnpj: empresa.cnpj,
      email_login: usuario.email_login,
      tipo_perfil: usuario.tipo_perfil,
      criado_em: usuario.criado_em,
    };
  }

  /**
   * Retorna todas as empresas com dados do usuário (sem senha).
   */
  async listarEmpresas() {
    return prisma.empresaParceira.findMany({
      include: {
        usuario: {
          select: {
            id_usuario: true,
            email_login: true,
            ativo: true,
            criado_em: true,
          },
        },
      },
      orderBy: { razao_social: 'asc' },
    });
  }

  /**
   * Busca uma empresa pelo seu ID primário.
   */
  async buscarEmpresaPorId(id: number) {
    const empresa = await prisma.empresaParceira.findUnique({
      where: { id_empresa: id },
      include: {
        usuario: {
          select: {
            id_usuario: true,
            email_login: true,
            ativo: true,
            criado_em: true,
          },
        },
      },
    });

    if (!empresa) {
      throw new Error('Empresa não encontrada.');
    }

    return empresa;
  }

  /**
   * Atualiza dados de uma EmpresaParceira e opcionalmente suas credenciais.
   */
  async atualizarEmpresa(id: number, dados: AtualizarEmpresaDTO) {
    const empresaExistente = await prisma.empresaParceira.findUnique({
      where: { id_empresa: id },
    });
    if (!empresaExistente) {
      throw new Error('Empresa não encontrada.');
    }

    const { email_login, senha, ...dadosEmpresa } = dados;

    return prisma.$transaction(async (tx) => {
      if (email_login || senha) {
        const usuarioUpdate: { email_login?: string; senha_hash?: string } = {};
        if (email_login) usuarioUpdate.email_login = email_login;
        if (senha) usuarioUpdate.senha_hash = await bcrypt.hash(senha, 10);

        await tx.usuario.update({
          where: { id_usuario: empresaExistente.id_usuario },
          data: usuarioUpdate,
        });
      }

      return tx.empresaParceira.update({
        where: { id_empresa: id },
        data: dadosEmpresa,
        include: {
          usuario: {
            select: { email_login: true, ativo: true },
          },
        },
      });
    });
  }

  /**
   * Remove a Empresa e o Usuario vinculado.
   */
  async deletarEmpresa(id: number) {
    const empresa = await prisma.empresaParceira.findUnique({
      where: { id_empresa: id },
    });
    if (!empresa) {
      throw new Error('Empresa não encontrada.');
    }

    await prisma.usuario.delete({ where: { id_usuario: empresa.id_usuario } });

    return { mensagem: 'Empresa removida com sucesso.' };
  }
}

export default new EmpresaService();
