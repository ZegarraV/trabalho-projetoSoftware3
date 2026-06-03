// =============================================================================
// src/constants/auth.ts — Constantes de autenticação compartilhadas
//
// Centraliza chaves de armazenamento para evitar strings duplicadas entre
// o AuthContext e o interceptor do Axios.
// =============================================================================

/** Chave usada para persistir o estado de autenticação no localStorage. */
export const AUTH_STORAGE_KEY = 'moeda_estudantil_auth';
