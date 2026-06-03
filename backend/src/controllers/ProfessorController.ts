// =============================================================================
// src/controllers/ProfessorController.ts — Controller para Professor
// =============================================================================

import { Request, Response } from 'express';
import ProfessorService, { CriarProfessorDTO } from '../services/ProfessorService';

class ProfessorController {
  async criar(req: Request, res: Response): Promise<void> {
    try {
      const dados: CriarProfessorDTO = req.body;
      const professor = await ProfessorService.criarProfessor(dados);
      res.status(201).json({ sucesso: true, mensagem: 'Professor cadastrado com sucesso!', dados: professor });
    } catch (erro: unknown) {
      const mensagem = erro instanceof Error ? erro.message : 'Erro interno do servidor.';
      const status = mensagem.includes('já cadastrado') ? 400 : 500;
      res.status(status).json({ sucesso: false, mensagem });
    }
  }

  async listar(_req: Request, res: Response): Promise<void> {
    try {
      const professores = await ProfessorService.listarProfessores();
      res.status(200).json({ sucesso: true, dados: professores });
    } catch (erro: unknown) {
      const mensagem = erro instanceof Error ? erro.message : 'Erro interno do servidor.';
      res.status(500).json({ sucesso: false, mensagem });
    }
  }

  async buscarPorId(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) { res.status(400).json({ sucesso: false, mensagem: 'ID inválido.' }); return; }
      const professor = await ProfessorService.buscarProfessorPorId(id);
      res.status(200).json({ sucesso: true, dados: professor });
    } catch (erro: unknown) {
      const mensagem = erro instanceof Error ? erro.message : 'Erro interno do servidor.';
      const status = mensagem.includes('não encontrado') ? 404 : 500;
      res.status(status).json({ sucesso: false, mensagem });
    }
  }
}

export default new ProfessorController();
