// =============================================================================
// src/services/VantagemService.ts — Lógica de Negócio de Vantagens — Unicred
// =============================================================================

import prisma from '../config/database';
import { Decimal } from '@prisma/client/runtime/library';
import EmailService from './EmailService';

class VantagemService {
  async listarVantagens() {
    return prisma.vantagem.findMany({
      where: { ativo: true },
      include: {
        empresa: { select: { id_empresa: true, razao_social: true, nome_fantasia: true } },
      },
      orderBy: { criado_em: 'desc' },
    });
  }

  async buscarVantagemPorId(id: number) {
    const vantagem = await prisma.vantagem.findUnique({
      where: { id_vantagem: id },
      include: {
        empresa: { select: { id_empresa: true, razao_social: true, nome_fantasia: true } },
      },
    });
    if (!vantagem) throw new Error('Vantagem não encontrada.');
    return vantagem;
  }

  async resgatarVantagem(idAluno: number, idVantagem: number) {
    const vantagem = await prisma.vantagem.findUnique({
      where: { id_vantagem: idVantagem },
      include: { empresa: true },
    });
    if (!vantagem) throw new Error('Vantagem não encontrada.');
    if (!vantagem.ativo) throw new Error('Esta vantagem não está mais disponível.');

    const custo = vantagem.custo_moedas;

    const aluno = await prisma.aluno.findUnique({
      where: { id_aluno: idAluno },
      include: { usuario: { select: { email_login: true } } },
    });
    if (!aluno) throw new Error('Aluno não encontrado.');

    if (aluno.saldo_moedas.lessThan(custo)) {
      throw new Error(
        `Créditos insuficientes. Você possui ${aluno.saldo_moedas} créditos, mas esta vantagem custa ${custo}.`
      );
    }

    const resultado = await prisma.$transaction(async (tx) => {
      const novoSaldo = new Decimal(aluno.saldo_moedas.toString()).minus(custo.toString());
      await tx.aluno.update({
        where: { id_aluno: idAluno },
        data: { saldo_moedas: novoSaldo },
      });

      const codigoCupom = this.gerarCodigoCupom();
      return tx.resgateVantagem.create({
        data: {
          codigo_cupom: codigoCupom,
          quantidade: custo,
          descricao: vantagem.nome,
          status: 'PENDENTE',
          id_aluno: idAluno,
          id_vantagem: idVantagem,
          id_empresa: vantagem.id_empresa,
        },
      });
    });

    const nomeEmpresa = vantagem.empresa.nome_fantasia || vantagem.empresa.razao_social;

    EmailService.enviarNotificacaoResgate({
      emailAluno: aluno.usuario.email_login,
      nomeAluno: aluno.nome_completo,
      nomeVantagem: vantagem.nome,
      nomeEmpresa,
      codigoCupom: resultado.codigo_cupom,
      quantidade: Number(custo),
    }).catch((err) => console.error('[EmailService] Falha ao enviar e-mail de resgate:', err));

    return {
      id_resgate: resultado.id_resgate,
      codigo_cupom: resultado.codigo_cupom,
      quantidade: resultado.quantidade,
      descricao: resultado.descricao,
      nome_empresa: nomeEmpresa,
    };
  }

  async listarResgatesPorEmpresa(_idEmpresa: number, status?: string) {
    return prisma.resgateVantagem.findMany({
      where: {
        ...(status ? { status: status as any } : {}),
      },
      include: {
        aluno: {
          select: {
            nome_completo: true,
            usuario: { select: { email_login: true } },
          },
        },
        vantagem: { select: { nome: true, custo_moedas: true } },
      },
      orderBy: { criado_em: 'desc' },
    });
  }

  async validarCupom(codigoCupom: string, idEmpresa: number) {
    const resgate = await prisma.resgateVantagem.findUnique({
      where: { codigo_cupom: codigoCupom.toUpperCase() },
      include: {
        aluno: {
          select: {
            nome_completo: true,
            usuario: { select: { email_login: true } },
          },
        },
        vantagem: { select: { nome: true } },
        empresa: { select: { razao_social: true, nome_fantasia: true } },
      },
    });

    if (!resgate) throw new Error('Cupom não encontrado.');
    if (resgate.status === 'CONCLUIDO') throw new Error('Este cupom já foi validado anteriormente.');

    const atualizado = await prisma.resgateVantagem.update({
      where: { codigo_cupom: codigoCupom.toUpperCase() },
      data: { status: 'CONCLUIDO' },
    });

    const nomeEmpresa = resgate.empresa.nome_fantasia || resgate.empresa.razao_social;

    EmailService.enviarNotificacaoCupomValidado({
      emailAluno: resgate.aluno.usuario.email_login,
      nomeAluno: resgate.aluno.nome_completo,
      nomeVantagem: resgate.vantagem.nome,
      nomeEmpresa,
      codigoCupom: resgate.codigo_cupom,
    }).catch((err) => console.error('[EmailService] Falha ao enviar e-mail de validação:', err));

    return {
      id_resgate: atualizado.id_resgate,
      codigo_cupom: atualizado.codigo_cupom,
      status: atualizado.status,
      aluno: resgate.aluno.nome_completo,
      vantagem: resgate.vantagem.nome,
    };
  }

  async criarVantagem(dados: {
    nome: string;
    descricao: string;
    foto_url?: string;
    custo_moedas: number;
    id_empresa: number;
  }) {
    return prisma.vantagem.create({
      data: {
        nome: dados.nome,
        descricao: dados.descricao,
        foto_url: dados.foto_url,
        custo_moedas: new Decimal(dados.custo_moedas),
        id_empresa: dados.id_empresa,
      },
      include: {
        empresa: { select: { id_empresa: true, razao_social: true, nome_fantasia: true } },
      },
    });
  }

  /** Atualiza uma vantagem — só a empresa dona pode editar */
  async atualizarVantagem(idVantagem: number, idEmpresa: number, dados: {
    nome?: string;
    descricao?: string;
    foto_url?: string;
    custo_moedas?: number;
  }) {
    const vantagem = await prisma.vantagem.findUnique({ where: { id_vantagem: idVantagem } });
    if (!vantagem) throw new Error('Vantagem não encontrada.');
    if (vantagem.id_empresa !== idEmpresa) throw new Error('Sem permissão para editar esta vantagem.');

    return prisma.vantagem.update({
      where: { id_vantagem: idVantagem },
      data: {
        ...(dados.nome        ? { nome: dados.nome }               : {}),
        ...(dados.descricao   ? { descricao: dados.descricao }     : {}),
        ...(dados.foto_url !== undefined ? { foto_url: dados.foto_url || null } : {}),
        ...(dados.custo_moedas !== undefined ? { custo_moedas: new Decimal(dados.custo_moedas) } : {}),
      },
      include: {
        empresa: { select: { id_empresa: true, razao_social: true, nome_fantasia: true } },
      },
    });
  }

  /** Desativa (soft delete) uma vantagem */
  async desativarVantagem(idVantagem: number, idEmpresa: number) {
    const vantagem = await prisma.vantagem.findUnique({ where: { id_vantagem: idVantagem } });
    if (!vantagem) throw new Error('Vantagem não encontrada.');
    if (vantagem.id_empresa !== idEmpresa) throw new Error('Sem permissão para desativar esta vantagem.');

    return prisma.vantagem.update({
      where: { id_vantagem: idVantagem },
      data: { ativo: false },
    });
  }

  private gerarCodigoCupom(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let codigo = '';
    for (let i = 0; i < 10; i++) {
      codigo += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return codigo;
  }
}

export default new VantagemService();
