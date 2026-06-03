// =============================================================================
// src/middlewares/validationMiddleware.ts — Validação de Campos Obrigatórios
//
// Middleware Express que intercepta a requisição ANTES de chegar ao Controller
// para garantir que todos os campos obrigatórios estejam presentes e válidos.
// Retorna 422 (Unprocessable Entity) se a validação falhar.
// =============================================================================

import { Request, Response, NextFunction } from 'express';

/**
 * Fábrica de middleware de validação.
 * Recebe a lista de campos obrigatórios e retorna um middleware Express.
 *
 * Uso: router.post('/', validarCampos(['nome', 'email']), controller.criar)
 */
export function validarCampos(camposObrigatorios: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const erros: string[] = [];

    for (const campo of camposObrigatorios) {
      const valor = req.body[campo];

      // Verifica ausência ou string vazia
      if (valor === undefined || valor === null || String(valor).trim() === '') {
        erros.push(`O campo "${campo}" é obrigatório.`);
      }
    }

    if (erros.length > 0) {
      res.status(422).json({
        sucesso: false,
        mensagem: 'Dados inválidos. Verifique os campos obrigatórios.',
        erros,
      });
      return;
    }

    next();
  };
}

/**
 * Valida o formato de um CPF (11 dígitos numéricos).
 * Não verifica validade matemática — apenas formato.
 */
export function validarFormatoCPF(req: Request, res: Response, next: NextFunction): void {
  const { cpf } = req.body;

  if (cpf) {
    const cpfLimpo = String(cpf).replace(/\D/g, '');
    if (cpfLimpo.length !== 11) {
      res.status(422).json({
        sucesso: false,
        mensagem: 'CPF inválido. Deve conter 11 dígitos numéricos.',
      });
      return;
    }
    // Normaliza o CPF sem máscara para persistência
    req.body.cpf = cpfLimpo;
  }

  next();
}

/**
 * Valida o formato de um CNPJ (14 dígitos numéricos).
 */
export function validarFormatoCNPJ(req: Request, res: Response, next: NextFunction): void {
  const { cnpj } = req.body;

  if (cnpj) {
    const cnpjLimpo = String(cnpj).replace(/\D/g, '');
    if (cnpjLimpo.length !== 14) {
      res.status(422).json({
        sucesso: false,
        mensagem: 'CNPJ inválido. Deve conter 14 dígitos numéricos.',
      });
      return;
    }
    req.body.cnpj = cnpjLimpo;
  }

  next();
}
