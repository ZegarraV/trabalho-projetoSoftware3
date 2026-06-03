// =============================================================================
// src/contexts/AuthContext.tsx — Contexto Global de Autenticação
//
// Gerencia o estado do usuário autenticado durante toda a sessão.
// Persiste token + perfil no localStorage para sobreviver a recarregamentos.
//
// Exporta:
//   AuthProvider   — Wrapper que provê o contexto à árvore de componentes.
//   useAuth        — Hook para consumir o contexto em qualquer componente filho.
//   TipoPerfil     — Union type dos perfis suportados.
//   UsuarioAutenticado — Shape completo do usuário logado.
// =============================================================================

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { AUTH_STORAGE_KEY } from '../constants/auth';

// ---------------------------------------------------------------------------
// Tipos públicos
// ---------------------------------------------------------------------------

export type TipoPerfil = 'ALUNO' | 'PROFESSOR' | 'EMPRESA';

export interface UsuarioAutenticado {
  id_usuario: number;
  email: string;
  tipo_perfil: TipoPerfil;
  /** ID específico do perfil vinculado (id_professor, id_aluno ou id_empresa). */
  id_perfil: number | null;
}

interface AuthState {
  token: string | null;
  usuario: UsuarioAutenticado | null;
}

interface AuthContextValue extends AuthState {
  /** Armazena token e dados do usuário após login bem-sucedido. */
  login: (token: string, usuario: UsuarioAutenticado) => void;
  /** Limpa o estado e o localStorage, encerrando a sessão. */
  logout: () => void;
  /** Atalho: verdadeiro quando há um token válido armazenado. */
  isAuthenticated: boolean;
}

// ---------------------------------------------------------------------------
// Criação do contexto
// ---------------------------------------------------------------------------

const AuthContext = createContext<AuthContextValue | null>(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function AuthProvider({ children }: { children: ReactNode }) {
  // Inicialização lazy: lê o estado persistido do localStorage na montagem
  const [state, setState] = useState<AuthState>(() => {
    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      if (raw) return JSON.parse(raw) as AuthState;
    } catch {
      // JSON inválido: ignora e começa sem sessão
    }
    return { token: null, usuario: null };
  });

  // Sincroniza o localStorage sempre que o estado mudar
  useEffect(() => {
    if (state.token) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [state]);

  function login(token: string, usuario: UsuarioAutenticado) {
    setState({ token, usuario });
  }

  function logout() {
    setState({ token: null, usuario: null });
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        isAuthenticated: !!state.token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook de consumo
// ---------------------------------------------------------------------------

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth() deve ser utilizado dentro de um <AuthProvider>.');
  }
  return ctx;
}
