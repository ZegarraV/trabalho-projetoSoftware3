// =============================================================================
// src/services/ProfessorService.ts — Camada de Negócio para Professor
// =============================================================================

import bcrypt from 'bcryptjs';
import prisma from '../config/database';

export interface CriarProfessorDTO {
  email_login: string;
  senha: string;
  nome_completo: string;
  cpf: string;
  departamento?: string;
  saldo_inicial?: number;
}

class ProfessorService {
  async criarProfessor(dados: CriarProfessorDTO) {
    const emailExistente = await prisma.usuario.findUnique({
      where: { email_login: dados.email_login },
    });
    if (emailExistente) throw new Error('E-mail já cadastrado no sistema.');

    const cpfExistente = await prisma.professor.findUnique({
      where: { cpf: dados.cpf },
    });
    if (cpfExistente) throw new Error('CPF já cadastrado no sistema.');

    const senha_hash = await bcrypt.hash(dados.senha, 10);

    const resultado = await prisma.$transaction(async (tx) => {
      const usuario = await tx.usuario.create({
        data: { email_login: dados.email_login, senha_hash, tipo_perfil: 'PROFESSOR' },
      });

      const professor = await tx.professor.create({
        data: {
          nome_completo: dados.nome_completo,
          cpf: dados.cpf,
          departamento: dados.departamento,
          saldo_moedas: dados.saldo_inicial ?? 1000,
          id_usuario: usuario.id_usuario,
        },
      });

      return { professor, usuario };
    });

    return {
      id_professor: resultado.professor.id_professor,
      nome_completo: resultado.professor.nome_completo,
      cpf: resultado.professor.cpf,
      saldo_moedas: resultado.professor.saldo_moedas,
      email_login: resultado.usuario.email_login,
      tipo_perfil: resultado.usuario.tipo_perfil,
      criado_em: resultado.usuario.criado_em,
    };
  }

  async listarProfessores() {
    return prisma.professor.findMany({
      include: {
        usuario: {
          select: { id_usuario: true, email_login: true, ativo: true, criado_em: true },
        },
      },
      orderBy: { nome_completo: 'asc' },
    });
  }

  async buscarProfessorPorId(id: number) {
    const professor = await prisma.professor.findUnique({
      where: { id_professor: id },
      include: {
        usuario: {
          select: { id_usuario: true, email_login: true, ativo: true, criado_em: true },
        },
      },
    });
    if (!professor) throw new Error(`Professor com ID ${id} não encontrado.`);
    return professor;
  }
}

export default new ProfessorService();
