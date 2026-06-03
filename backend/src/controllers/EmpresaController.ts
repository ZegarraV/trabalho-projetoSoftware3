// =============================================================================
// src/controllers/EmpresaController.ts — Camada Controller (MVC)
//
// RESPONSABILIDADE: Orquestra a comunicação entre as requisições HTTP e a
// camada de serviço (EmpresaService), tratando status codes e respostas JSON.
// =============================================================================

import { Request, Response } from 'express';
import EmpresaService, { CriarEmpresaDTO, AtualizarEmpresaDTO } from '../services/EmpresaService';

class EmpresaController {
  /**
   * POST /api/empresas
   * Cadastra uma nova EmpresaParceira e seu Usuário vinculado.
   */
  async criar(req: Request, res: Response): Promise<void> {
    try {
      const dados: CriarEmpresaDTO = req.body;
      const empresa = await EmpresaService.criarEmpresa(dados);

      res.status(201).json({
        sucesso: true,
        mensagem: 'Empresa parceira cadastrada com sucesso!',
        dados: empresa,
      });
    } catch (erro: unknown) {
      const mensagem = erro instanceof Error ? erro.message : 'Erro interno do servidor.';
      const status = mensagem.includes('já cadastrado') ? 400 : 500;
      res.status(status).json({ sucesso: false, mensagem });
    }
  }

  /**
   * GET /api/empresas
   * Retorna a lista de todas as empresas parceiras.
   */
  async listar(req: Request, res: Response): Promise<void> {
    try {
      const empresas = await EmpresaService.listarEmpresas();
      res.status(200).json({ sucesso: true, dados: empresas });
    } catch (erro: unknown) {
      const mensagem = erro instanceof Error ? erro.message : 'Erro interno do servidor.';
      res.status(500).json({ sucesso: false, mensagem });
    }
  }

  /**
   * GET /api/empresas/:id
   * Retorna uma Empresa específica pelo ID.
   */
  async buscarPorId(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({ sucesso: false, mensagem: 'ID inválido.' });
        return;
      }

      const empresa = await EmpresaService.buscarEmpresaPorId(id);
      res.status(200).json({ sucesso: true, dados: empresa });
    } catch (erro: unknown) {
      const mensagem = erro instanceof Error ? erro.message : 'Erro interno do servidor.';
      const status = mensagem.includes('não encontrada') ? 404 : 500;
      res.status(status).json({ sucesso: false, mensagem });
    }
  }

  /**
   * PUT /api/empresas/:id
   * Atualiza os dados de uma Empresa existente.
   */
  async atualizar(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({ sucesso: false, mensagem: 'ID inválido.' });
        return;
      }

      const dados: AtualizarEmpresaDTO = req.body;
      const empresa = await EmpresaService.atualizarEmpresa(id, dados);

      res.status(200).json({
        sucesso: true,
        mensagem: 'Empresa atualizada com sucesso!',
        dados: empresa,
      });
    } catch (erro: unknown) {
      const mensagem = erro instanceof Error ? erro.message : 'Erro interno do servidor.';
      const status = mensagem.includes('não encontrada') ? 404 : 500;
      res.status(status).json({ sucesso: false, mensagem });
    }
  }

  /**
   * DELETE /api/empresas/:id
   * Remove uma Empresa e seu Usuário vinculado.
   */
  async deletar(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({ sucesso: false, mensagem: 'ID inválido.' });
        return;
      }

      const resultado = await EmpresaService.deletarEmpresa(id);
      res.status(200).json({ sucesso: true, ...resultado });
    } catch (erro: unknown) {
      const mensagem = erro instanceof Error ? erro.message : 'Erro interno do servidor.';
      const status = mensagem.includes('não encontrada') ? 404 : 500;
      res.status(status).json({ sucesso: false, mensagem });
    }
  }
}

export default new EmpresaController();
