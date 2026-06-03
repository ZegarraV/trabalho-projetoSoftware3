// =============================================================================
// src/pages/AcessoNegado.tsx — Página 403
// =============================================================================

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function AcessoNegado() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">🚫</div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Acesso Negado</h1>
        <p className="text-slate-500 mb-8">
          Você não tem permissão para acessar esta página. Verifique se está
          logado com o perfil correto.
        </p>
        <button
          onClick={() => navigate(isAuthenticated ? '/' : '/login', { replace: true })}
          className="btn-primary"
        >
          {isAuthenticated ? 'Ir para o Início' : 'Ir para o Login'}
        </button>
      </div>
    </div>
  );
}
