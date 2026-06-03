// =============================================================================
// src/services/AlunoService.ts — Camada de Regra de Negócio para Aluno
//
// RESPONSABILIDADE (MVC): Contém toda a lógica de negócio, isolada do
// Controller (que trata HTTP) e do banco de dados (acessado via Prisma).
//
// REGRA CENTRAL (Lab03S02):
//   O cadastro de um Aluno DEVE criar primeiro um registro em `usuarios`
//   com tipo_perfil = 'ALUNO' e depois vincular o id_usuario gerado.
//   Ambas as operações ocorrem dentro de uma única TRANSAÇÃO para garantir
//   consistência (atomicidade).
// =============================================================================

import bcrypt from 'bcryptjs';
import prisma from '../config/database';

// ---------------------------------------------------------------------------
// DTOs (Data Transfer Objects) — contratos de entrada do serviço
// ---------------------------------------------------------------------------

export interface CriarAlunoDTO {
  // Credenciais (tabela usuarios)
  email_login: string;
  senha: string;

  // Dados pessoais (tabela alunos)
  nome_completo: string;
  cpf: string;
  rg?: string;

  // Endereço
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;

  // Vínculos acadêmicos
  id_instituicao?: number;
  id_curso?: number;
}

export interface AtualizarAlunoDTO {
  email_login?: string;
  senha?: string;
  nome_completo?: string;
  rg?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  id_instituicao?: number;
  id_curso?: number;
}

// ---------------------------------------------------------------------------
// Serviço
// ---------------------------------------------------------------------------

class AlunoService {
  /**
   * Cria um Aluno e seu Usuario vinculado dentro de uma transação atômica.
   * Lança erro se e-mail ou CPF já estiverem cadastrados.
   */
  async criarAluno(dados: CriarAlunoDTO) {
    // Verifica duplicidade de e-mail antes de entrar na transação
    const emailExistente = await prisma.usuario.findUnique({
      where: { email_login: dados.email_login },
    });
    if (emailExistente) {
      throw new Error('E-mail já cadastrado no sistema.');
    }

    // Verifica duplicidade de CPF
    const cpfExistente = await prisma.aluno.findUnique({
      where: { cpf: dados.cpf },
    });
    if (cpfExistente) {
      throw new Error('CPF já cadastrado no sistema.');
    }

    // Gera o hash seguro da senha (custo 12 para produção; 10 é aceitável em dev)
    const senha_hash = await bcrypt.hash(dados.senha, 10);

    // Transação: cria Usuario e Aluno atomicamente
    const resultado = await prisma.$transaction(async (tx) => {
      // PASSO 1: Cria o registro base de autenticação
      const usuario = await tx.usuario.create({
        data: {
          email_login: dados.email_login,
          senha_hash,
          tipo_perfil: 'ALUNO',
        },
      });

      // PASSO 2: Cria o Aluno vinculado ao usuário recém-criado
      const aluno = await tx.aluno.create({
        data: {
          nome_completo: dados.nome_completo,
          cpf: dados.cpf,
          rg: dados.rg,
          logradouro: dados.logradouro,
          numero: dados.numero,
          complemento: dados.complemento,
          bairro: dados.bairro,
          cidade: dados.cidade,
          estado: dados.estado,
          cep: dados.cep,
          id_usuario: usuario.id_usuario,
          id_instituicao: dados.id_instituicao,
          id_curso: dados.id_curso,
        },
      });

      return { aluno, usuario };
    });

    // Retorna sem expor o hash da senha
    const { usuario, aluno } = resultado;
    return {
      id_aluno: aluno.id_aluno,
      nome_completo: aluno.nome_completo,
      cpf: aluno.cpf,
      email_login: usuario.email_login,
      tipo_perfil: usuario.tipo_perfil,
      criado_em: usuario.criado_em,
    };
  }

  /**
   * Retorna todos os alunos com seus dados de usuário (sem senha).
   */
  async listarAlunos() {
    return prisma.aluno.findMany({
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
      orderBy: { nome_completo: 'asc' },
    });
  }

  /**
   * Busca um aluno pelo seu ID primário.
   */
  async buscarAlunoPorId(id: number) {
    const aluno = await prisma.aluno.findUnique({
      where: { id_aluno: id },
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

    if (!aluno) {
      throw new Error('Aluno não encontrado.');
    }

    return aluno;
  }

  /**
   * Atualiza dados de um Aluno e, opcionalmente, suas credenciais de Usuario.
   */
  async atualizarAluno(id: number, dados: AtualizarAlunoDTO) {
    const alunoExistente = await prisma.aluno.findUnique({
      where: { id_aluno: id },
    });
    if (!alunoExistente) {
      throw new Error('Aluno não encontrado.');
    }

    const { email_login, senha, ...dadosAluno } = dados;

    return prisma.$transaction(async (tx) => {
      // Atualiza credenciais se fornecidas
      if (email_login || senha) {
        const usuarioUpdate: { email_login?: string; senha_hash?: string } = {};
        if (email_login) usuarioUpdate.email_login = email_login;
        if (senha) usuarioUpdate.senha_hash = await bcrypt.hash(senha, 10);

        await tx.usuario.update({
          where: { id_usuario: alunoExistente.id_usuario },
          data: usuarioUpdate,
        });
      }

      // Atualiza dados do Aluno
      return tx.aluno.update({
        where: { id_aluno: id },
        data: dadosAluno,
        include: {
          usuario: {
            select: { email_login: true, ativo: true },
          },
        },
      });
    });
  }

  /**
   * Remove o Aluno e o Usuario vinculado (CASCADE garante a ordem).
   * A exclusão do Usuario em cascata remove o Aluno automaticamente,
   * mas fazemos explicitamente para maior clareza no log.
   */
  async deletarAluno(id: number) {
    const aluno = await prisma.aluno.findUnique({ where: { id_aluno: id } });
    if (!aluno) {
      throw new Error('Aluno não encontrado.');
    }

    // Deletar o Usuario dispara CASCADE e remove o Aluno
    await prisma.usuario.delete({ where: { id_usuario: aluno.id_usuario } });

    return { mensagem: 'Aluno removido com sucesso.' };
  }
}

// Exporta instância única (padrão Singleton de serviço)
export default new AlunoService();
