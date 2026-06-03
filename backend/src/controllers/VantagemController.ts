// =============================================================================
// src/controllers/VantagemController.ts — Unicred
// =============================================================================

import { Request, Response } from 'express';
import VantagemService from '../services/VantagemService';
import prisma from '../config/database';

class VantagemController {
  async listar(_req: Request, res: Response): Promise<void> {
    try {
      const vantagens = await VantagemService.listarVantagens();
      res.status(200).json({ sucesso: true, dados: vantagens });
    } catch (erro: unknown) {
      const mensagem = erro instanceof Error ? erro.message : 'Erro ao listar vantagens.';
      res.status(500).json({ sucesso: false, mensagem });
    }
  }

  async buscarPorId(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) { res.status(400).json({ sucesso: false, mensagem: 'ID inválido.' }); return; }
      const vantagem = await VantagemService.buscarVantagemPorId(id);
      res.status(200).json({ sucesso: true, dados: vantagem });
    } catch (erro: unknown) {
      const mensagem = erro instanceof Error ? erro.message : 'Erro ao buscar vantagem.';
      res.status(mensagem.includes('não encontrad') ? 404 : 500).json({ sucesso: false, mensagem });
    }
  }

  async resgatar(req: Request, res: Response): Promise<void> {
    try {
      const id_vantagem_raw = req.body.id_vantagem;
      const id_vantagem = Number(id_vantagem_raw);
      if (!id_vantagem_raw || isNaN(id_vantagem) || id_vantagem <= 0) {
        res.status(400).json({ sucesso: false, mensagem: 'id_vantagem é obrigatório e deve ser um número válido.' });
        return;
      }
      const idUsuario = req.usuario!.id_usuario;
      const aluno = await prisma.aluno.findUnique({
        where: { id_usuario: idUsuario },
        select: { id_aluno: true },
      });
      if (!aluno) {
        res.status(403).json({ sucesso: false, mensagem: 'Perfil de aluno não encontrado.' });
        return;
      }
      const resultado = await VantagemService.resgatarVantagem(aluno.id_aluno, id_vantagem);
      res.status(201).json({ sucesso: true, mensagem: 'Vantagem resgatada! Verifique seu e-mail para o cupom.', dados: resultado });
    } catch (erro: unknown) {
      const mensagem = erro instanceof Error ? erro.message : 'Erro ao resgatar vantagem.';
      res.status(mensagem.includes('insuficiente') || mensagem.includes('não encontrad') ? 400 : 500).json({ sucesso: false, mensagem });
    }
  }

  async criar(req: Request, res: Response): Promise<void> {
    try {
      const { nome, descricao, foto_url, custo_moedas } = req.body;
      if (!nome || !descricao || custo_moedas === undefined) {
        res.status(400).json({ sucesso: false, mensagem: 'nome, descricao e custo_moedas são obrigatórios.' });
        return;
      }
      const idUsuario = req.usuario!.id_usuario;
      const empresa = await prisma.empresaParceira.findUnique({
        where: { id_usuario: idUsuario },
        select: { id_empresa: true },
      });
      if (!empresa) {
        res.status(403).json({ sucesso: false, mensagem: 'Perfil de empresa não encontrado.' });
        return;
      }
      const vantagem = await VantagemService.criarVantagem({ nome, descricao, foto_url, custo_moedas, id_empresa: empresa.id_empresa });
      res.status(201).json({ sucesso: true, mensagem: 'Vantagem cadastrada com sucesso!', dados: vantagem });
    } catch (erro: unknown) {
      const mensagem = erro instanceof Error ? erro.message : 'Erro ao criar vantagem.';
      res.status(500).json({ sucesso: false, mensagem });
    }
  }

  /** PUT /api/vantagens/:id — Atualiza uma vantagem (EMPRESA) */
  async atualizar(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) { res.status(400).json({ sucesso: false, mensagem: 'ID inválido.' }); return; }

      const idUsuario = req.usuario!.id_usuario;
      const empresa = await prisma.empresaParceira.findUnique({
        where: { id_usuario: idUsuario },
        select: { id_empresa: true },
      });
      if (!empresa) {
        res.status(403).json({ sucesso: false, mensagem: 'Perfil de empresa não encontrado.' });
        return;
      }

      const { nome, descricao, foto_url, custo_moedas } = req.body;
      const vantagem = await VantagemService.atualizarVantagem(id, empresa.id_empresa, { nome, descricao, foto_url, custo_moedas });
      res.status(200).json({ sucesso: true, mensagem: 'Vantagem atualizada com sucesso!', dados: vantagem });
    } catch (erro: unknown) {
      const mensagem = erro instanceof Error ? erro.message : 'Erro ao atualizar vantagem.';
      res.status(mensagem.includes('não encontrad') || mensagem.includes('permissão') ? 403 : 500).json({ sucesso: false, mensagem });
    }
  }

  /** DELETE /api/vantagens/:id — Desativa uma vantagem (EMPRESA) */
  async desativar(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) { res.status(400).json({ sucesso: false, mensagem: 'ID inválido.' }); return; }

      const idUsuario = req.usuario!.id_usuario;
      const empresa = await prisma.empresaParceira.findUnique({
        where: { id_usuario: idUsuario },
        select: { id_empresa: true },
      });
      if (!empresa) {
        res.status(403).json({ sucesso: false, mensagem: 'Perfil de empresa não encontrado.' });
        return;
      }

      await VantagemService.desativarVantagem(id, empresa.id_empresa);
      res.status(200).json({ sucesso: true, mensagem: 'Vantagem desativada com sucesso.' });
    } catch (erro: unknown) {
      const mensagem = erro instanceof Error ? erro.message : 'Erro ao desativar vantagem.';
      res.status(mensagem.includes('não encontrad') || mensagem.includes('permissão') ? 403 : 500).json({ sucesso: false, mensagem });
    }
  }

  /** GET /api/vantagens/resgates — Lista resgates da empresa autenticada */
  async listarResgates(req: Request, res: Response): Promise<void> {
    try {
      const { status } = req.query;
      const idUsuario = req.usuario!.id_usuario;
      const empresa = await prisma.empresaParceira.findUnique({
        where: { id_usuario: idUsuario },
        select: { id_empresa: true },
      });
      if (!empresa) {
        res.status(403).json({ sucesso: false, mensagem: 'Perfil de empresa não encontrado.' });
        return;
      }
      const resgates = await VantagemService.listarResgatesPorEmpresa(
        empresa.id_empresa,
        typeof status === 'string' ? status : undefined
      );
      res.status(200).json({ sucesso: true, dados: resgates });
    } catch (erro: unknown) {
      const mensagem = erro instanceof Error ? erro.message : 'Erro ao listar resgates.';
      res.status(500).json({ sucesso: false, mensagem });
    }
  }

  /** POST /api/vantagens/validar-cupom — Valida um cupom pelo código */
  async validarCupom(req: Request, res: Response): Promise<void> {
    try {
      const { codigo_cupom } = req.body;
      if (!codigo_cupom || typeof codigo_cupom !== 'string') {
        res.status(400).json({ sucesso: false, mensagem: 'codigo_cupom é obrigatório.' });
        return;
      }
      const idUsuario = req.usuario!.id_usuario;
      const empresa = await prisma.empresaParceira.findUnique({
        where: { id_usuario: idUsuario },
        select: { id_empresa: true },
      });
      if (!empresa) {
        res.status(403).json({ sucesso: false, mensagem: 'Perfil de empresa não encontrado.' });
        return;
      }
      const resultado = await VantagemService.validarCupom(codigo_cupom, empresa.id_empresa);
      res.status(200).json({ sucesso: true, mensagem: 'Cupom validado com sucesso! O aluno foi notificado.', dados: resultado });
    } catch (erro: unknown) {
      const mensagem = erro instanceof Error ? erro.message : 'Erro ao validar cupom.';
      res.status(mensagem.includes('não encontrad') ? 404 : mensagem.includes('já foi validado') ? 409 : 400).json({ sucesso: false, mensagem });
    }
  }
}

export default new VantagemController();
