// =============================================================================
// src/services/ExtratoService.ts — Consulta de Extratos
//
// Provê o histórico de movimentações para Professores e Alunos.
// =============================================================================

import prisma from '../config/database';

class ExtratoService {
  /**
   * Retorna o extrato completo de um Professor:
   *   - Saldo atual
   *   - Histórico de envios (ReconhecimentoMerito)
   *   - Histórico de recebimentos do sistema (DistribuicaoSemestral)
   */
  async getExtratoProfessor(idProfessor: number) {
    const professor = await prisma.professor.findUnique({
      where: { id_professor: idProfessor },
      select: {
        id_professor: true,
        nome_completo: true,
        saldo_moedas: true,
        usuario: { select: { email_login: true } },
      },
    });
    if (!professor) throw new Error(`Professor com ID ${idProfessor} não encontrado.`);

    const envios = await prisma.reconhecimentoMerito.findMany({
      where: { id_professor: idProfessor },
      include: {
        aluno: { select: { nome_completo: true } },
      },
      orderBy: { criado_em: 'desc' },
    });

    const distribuicoes = await prisma.distribuicaoSemestral.findMany({
      where: { id_professor: idProfessor },
      orderBy: { criado_em: 'desc' },
    });

    return {
      professor: {
        id_professor: professor.id_professor,
        nome_completo: professor.nome_completo,
        email_login: professor.usuario.email_login,
        saldo_moedas: professor.saldo_moedas,
      },
      envios: envios.map((e) => ({
        id: e.id_reconhecimento,
        tipo: 'SAIDA' as const,
        quantidade: e.quantidade,
        motivo: e.motivo,
        destinatario: e.aluno.nome_completo,
        data: e.criado_em,
      })),
      recebimentos: distribuicoes.map((d) => ({
        id: d.id_distribuicao,
        tipo: 'ENTRADA' as const,
        quantidade: d.quantidade,
        semestre: d.semestre,
        data: d.criado_em,
      })),
    };
  }

  /**
   * Retorna o extrato completo de um Aluno:
   *   - Saldo atual
   *   - Histórico de recebimentos (ReconhecimentoMerito)
   *   - Histórico de resgates (ResgateVantagem)
   */
  async getExtratoAluno(idAluno: number) {
    const aluno = await prisma.aluno.findUnique({
      where: { id_aluno: idAluno },
      select: {
        id_aluno: true,
        nome_completo: true,
        saldo_moedas: true,
        usuario: { select: { email_login: true } },
      },
    });
    if (!aluno) throw new Error(`Aluno com ID ${idAluno} não encontrado.`);

    const recebimentos = await prisma.reconhecimentoMerito.findMany({
      where: { id_aluno: idAluno },
      include: {
        professor: { select: { nome_completo: true } },
      },
      orderBy: { criado_em: 'desc' },
    });

    const resgates = await prisma.resgateVantagem.findMany({
      where: { id_aluno: idAluno },
      include: {
        empresa: { select: { razao_social: true, nome_fantasia: true } },
      },
      orderBy: { criado_em: 'desc' },
    });

    return {
      aluno: {
        id_aluno: aluno.id_aluno,
        nome_completo: aluno.nome_completo,
        email_login: aluno.usuario.email_login,
        saldo_moedas: aluno.saldo_moedas,
      },
      recebimentos: recebimentos.map((r) => ({
        id: r.id_reconhecimento,
        tipo: 'ENTRADA' as const,
        quantidade: r.quantidade,
        motivo: r.motivo,
        remetente: r.professor.nome_completo,
        data: r.criado_em,
      })),
      resgates: resgates.map((r) => ({
        id: r.id_resgate,
        tipo: 'SAIDA' as const,
        quantidade: r.quantidade,
        descricao: r.descricao,
        status: r.status,
        empresa: r.empresa.nome_fantasia ?? r.empresa.razao_social,
        data: r.criado_em,
      })),
    };
  }
}

export default new ExtratoService();
