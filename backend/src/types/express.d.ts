// =============================================================================
// src/types/express.d.ts — Extensão do tipo Request do Express
//
// Adiciona a propriedade `usuario` ao objeto Request para que os middlewares
// de autenticação possam anexar o payload do JWT decodificado e os controllers
// subsequentes o leiam com tipagem completa.
// =============================================================================

import { TipoPerfil } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      /**
       * Payload do JWT decodificado e validado pelo middleware `autenticarToken`.
       * Disponível em qualquer rota protegida após a execução do middleware.
       */
      usuario?: {
        id_usuario: number;
        email: string;
        tipo_perfil: TipoPerfil;
      };
    }
  }
}
