// =============================================================================
// src/controllers/ExtratoController.ts — Controller de Extrato
// =============================================================================

import { Request, Response } from 'express';
import ExtratoService from '../services/ExtratoService';

class ExtratoController {
  /**
   * GET /api/extratos/professor/:id
   */
  async extratoProfessor(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ sucesso: false, mensagem: 'ID inválido.' });
        return;
      }

      const extrato = await ExtratoService.getExtratoProfessor(id);
      res.status(200).json({ sucesso: true, dados: extrato });
    } catch (erro: unknown) {
      const mensagem = erro instanceof Error ? erro.message : 'Erro interno do servidor.';
      const status = mensagem.includes('não encontrado') ? 404 : 500;
      res.status(status).json({ sucesso: false, mensagem });
    }
  }

  /**
   * GET /api/extratos/aluno/:id
   */
  async extratoAluno(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ sucesso: false, mensagem: 'ID inválido.' });
        return;
      }

      const extrato = await ExtratoService.getExtratoAluno(id);
      res.status(200).json({ sucesso: true, dados: extrato });
    } catch (erro: unknown) {
      const mensagem = erro instanceof Error ? erro.message : 'Erro interno do servidor.';
      const status = mensagem.includes('não encontrado') ? 404 : 500;
      res.status(status).json({ sucesso: false, mensagem });
    }
  }
}

export default new ExtratoController();
