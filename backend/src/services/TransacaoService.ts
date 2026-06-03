// =============================================================================
// src/services/TransacaoService.ts — Motor de Transferência de Moedas
//
// Regras de negócio:
//   - Professor deve ter saldo suficiente.
//   - O motivo não pode estar em branco.
//   - Toda a operação ocorre dentro de prisma.$transaction() (atomicidade).
//   - Após commit, dispara e-mails de forma assíncrona (fire-and-forget).
// =============================================================================

import { Decimal } from '@prisma/client/runtime/library';
import prisma from '../config/database';
import EmailService from './EmailService';

export interface EnviarMoedasDTO {
  idProfessor: number;
  idAluno: number;
  quantidade: number;
  motivo: string;
}

class TransacaoService {
  /**
   * Transfere `quantidade` moedas do Professor para o Aluno.
   * Retorna o registro de ReconhecimentoMerito criado.
   */
  async enviarMoedas(dados: EnviarMoedasDTO) {
    const { idProfessor, idAluno, quantidade, motivo } = dados;

    // --- Validações de entrada ---
    if (!motivo || motivo.trim() === '') {
      throw new Error('O motivo do reconhecimento não pode estar em branco.');
    }
    if (quantidade <= 0) {
      throw new Error('A quantidade de moedas deve ser maior que zero.');
    }

    // --- Carrega professor e aluno fora da transação para mensagens de erro claras ---
    const professor = await prisma.professor.findUnique({
      where: { id_professor: idProfessor },
      include: { usuario: { select: { email_login: true } } },
    });
    if (!professor) throw new Error(`Professor com ID ${idProfessor} não encontrado.`);

    const aluno = await prisma.aluno.findUnique({
      where: { id_aluno: idAluno },
      include: { usuario: { select: { email_login: true } } },
    });
    if (!aluno) throw new Error(`Aluno com ID ${idAluno} não encontrado.`);

    // --- Validação de saldo ---
    if (new Decimal(professor.saldo_moedas).lessThan(new Decimal(quantidade))) {
      throw new Error(
        `Saldo insuficiente. O professor possui ${professor.saldo_moedas} moedas e tentou enviar ${quantidade}.`
      );
    }

    // --- Transação atômica ---
    const reconhecimento = await prisma.$transaction(async (tx) => {
      // PASSO 1: Subtrai do saldo do professor
      await tx.professor.update({
        where: { id_professor: idProfessor },
        data: { saldo_moedas: { decrement: quantidade } },
      });

      // PASSO 2: Adiciona ao saldo do aluno
      await tx.aluno.update({
        where: { id_aluno: idAluno },
        data: { saldo_moedas: { increment: quantidade } },
      });

      // PASSO 3: Registra a transação
      return tx.reconhecimentoMerito.create({
        data: {
          id_professor: idProfessor,
          id_aluno: idAluno,
          quantidade,
          motivo: motivo.trim(),
        },
        include: {
          professor: { select: { nome_completo: true } },
          aluno:     { select: { nome_completo: true } },
        },
      });
    });

    // --- Disparo de e-mails (fire-and-forget após o commit) ---
    EmailService.enviarNotificacaoTransacao({
      emailAluno:       aluno.usuario.email_login,
      emailProfessor:   professor.usuario.email_login,
      nomeAluno:        aluno.nome_completo,
      nomeProfessor:    professor.nome_completo,
      quantidade,
      motivo: motivo.trim(),
    }).catch((err) => console.error('[EmailService] Falha ao enviar e-mails:', err));

    return reconhecimento;
  }
}

export default new TransacaoService();
