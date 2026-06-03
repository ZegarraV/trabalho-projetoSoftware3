// =============================================================================
// src/components/ProtectedRoute.tsx — Guarda de Rota Baseado em RBAC
//
// Funciona como um componente wrapper (wrapper de rota aninhada) no React
// Router v6. Usa <Outlet> para renderizar as rotas filhas quando o acesso
// é permitido, ou redireciona para /login / /acesso-negado nos casos de
// não-autenticado / perfil indevido.
//
// Uso:
//   <Route element={<ProtectedRoute />}>                         // qualquer auth
//     <Route element={<ProtectedRoute allowedRoles={['PROFESSOR']} />}> // só professor
// =============================================================================

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth, type TipoPerfil } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  /** Quando definido, apenas usuários com esses perfis têm acesso. */
  allowedRoles?: TipoPerfil[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, usuario } = useAuth();

  // Não autenticado → vai para login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Autenticado mas perfil não permitido → acesso negado
  if (allowedRoles && usuario && !allowedRoles.includes(usuario.tipo_perfil)) {
    return <Navigate to="/acesso-negado" replace />;
  }

  // Acesso concedido — renderiza as rotas filhas
  return <Outlet />;
}
