// =============================================================================
// src/controllers/AlunoController.ts — Camada Controller (MVC)
//
// RESPONSABILIDADE: Receber requisições HTTP, extrair dados do Request,
// acionar o Service e retornar a Response adequada com o status HTTP correto.
// NÃO contém regras de negócio — apenas orquestra a comunicação HTTP ↔ Service.
// =============================================================================

import { Request, Response } from 'express';
import AlunoService, { CriarAlunoDTO, AtualizarAlunoDTO } from '../services/AlunoService';

class AlunoController {
  /**
   * POST /api/alunos
   * Cadastra um novo Aluno e seu Usuário vinculado.
   */
  async criar(req: Request, res: Response): Promise<void> {
    try {
      const dados: CriarAlunoDTO = req.body;
      const aluno = await AlunoService.criarAluno(dados);

      res.status(201).json({
        sucesso: true,
        mensagem: 'Aluno cadastrado com sucesso!',
        dados: aluno,
      });
    } catch (erro: unknown) {
      const mensagem = erro instanceof Error ? erro.message : 'Erro interno do servidor.';

      // Erros de duplicidade são do cliente (400), demais são do servidor (500)
      const status = mensagem.includes('já cadastrado') ? 400 : 500;
      res.status(status).json({ sucesso: false, mensagem });
    }
  }

  /**
   * GET /api/alunos
   * Retorna a lista de todos os alunos cadastrados.
   */
  async listar(req: Request, res: Response): Promise<void> {
    try {
      const alunos = await AlunoService.listarAlunos();
      res.status(200).json({ sucesso: true, dados: alunos });
    } catch (erro: unknown) {
      const mensagem = erro instanceof Error ? erro.message : 'Erro interno do servidor.';
      res.status(500).json({ sucesso: false, mensagem });
    }
  }

  /**
   * GET /api/alunos/:id
   * Retorna um Aluno específico pelo ID.
   */
  async buscarPorId(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({ sucesso: false, mensagem: 'ID inválido.' });
        return;
      }

      const aluno = await AlunoService.buscarAlunoPorId(id);
      res.status(200).json({ sucesso: true, dados: aluno });
    } catch (erro: unknown) {
      const mensagem = erro instanceof Error ? erro.message : 'Erro interno do servidor.';
      const status = mensagem.includes('não encontrado') ? 404 : 500;
      res.status(status).json({ sucesso: false, mensagem });
    }
  }

  /**
   * PUT /api/alunos/:id
   * Atualiza os dados de um Aluno existente.
   */
  async atualizar(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({ sucesso: false, mensagem: 'ID inválido.' });
        return;
      }

      const dados: AtualizarAlunoDTO = req.body;
      const aluno = await AlunoService.atualizarAluno(id, dados);

      res.status(200).json({
        sucesso: true,
        mensagem: 'Aluno atualizado com sucesso!',
        dados: aluno,
      });
    } catch (erro: unknown) {
      const mensagem = erro instanceof Error ? erro.message : 'Erro interno do servidor.';
      const status = mensagem.includes('não encontrado') ? 404 : 500;
      res.status(status).json({ sucesso: false, mensagem });
    }
  }

  /**
   * DELETE /api/alunos/:id
   * Remove um Aluno e seu Usuário vinculado.
   */
  async deletar(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({ sucesso: false, mensagem: 'ID inválido.' });
        return;
      }

      const resultado = await AlunoService.deletarAluno(id);
      res.status(200).json({ sucesso: true, ...resultado });
    } catch (erro: unknown) {
      const mensagem = erro instanceof Error ? erro.message : 'Erro interno do servidor.';
      const status = mensagem.includes('não encontrado') ? 404 : 500;
      res.status(status).json({ sucesso: false, mensagem });
    }
  }
}

export default new AlunoController();
