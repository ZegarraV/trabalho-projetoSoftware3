// =============================================================================
// src/controllers/TransacaoController.ts — Controller de Transferência de Moedas
// =============================================================================

import { Request, Response } from 'express';
import TransacaoService from '../services/TransacaoService';

class TransacaoController {
  /**
   * POST /api/transacoes/enviar
   * Body: { idProfessor, idAluno, quantidade, motivo }
   */
  async enviarMoedas(req: Request, res: Response): Promise<void> {
    try {
      const { idProfessor, idAluno, quantidade, motivo } = req.body;

      const reconhecimento = await TransacaoService.enviarMoedas({
        idProfessor: Number(idProfessor),
        idAluno: Number(idAluno),
        quantidade: Number(quantidade),
        motivo,
      });

      res.status(201).json({
        sucesso: true,
        mensagem: 'Moedas enviadas com sucesso! O aluno foi notificado por e-mail.',
        dados: reconhecimento,
      });
    } catch (erro: unknown) {
      const mensagem = erro instanceof Error ? erro.message : 'Erro interno do servidor.';
      const status =
        mensagem.includes('não encontrado') ? 404 :
        mensagem.includes('insuficiente') || mensagem.includes('branco') || mensagem.includes('zero') ? 400 :
        500;
      res.status(status).json({ sucesso: false, mensagem });
    }
  }
}

export default new TransacaoController();
