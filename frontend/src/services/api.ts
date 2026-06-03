// =============================================================================
// src/services/api.ts — Camada de comunicação com o Back-end
//
// Centraliza a configuração do Axios e expõe funções tipadas para cada
// endpoint da API. Isso evita URLs espalhadas pelos componentes.
// =============================================================================

import axios from 'axios';
import { AUTH_STORAGE_KEY } from '../constants/auth';
import type { TipoPerfil } from '../contexts/AuthContext';

// Instância do Axios com a URL base da API.
// Em desenvolvimento, o proxy do Vite redireciona /api → http://localhost:3333
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos
});

// ---------------------------------------------------------------------------
// Interceptor de Requisição — injeta o Bearer token automaticamente
// ---------------------------------------------------------------------------

api.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (raw) {
      const { token } = JSON.parse(raw) as { token: string | null };
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch {
    // Ignora erros de parse — a requisição segue sem token
  }
  return config;
});

// ---------------------------------------------------------------------------
// Interceptor de Resposta — redireciona para /login em caso de 401
// ---------------------------------------------------------------------------

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      // Limpa a sessão inválida e força re-login sem depender do contexto React
      localStorage.removeItem(AUTH_STORAGE_KEY);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ---------------------------------------------------------------------------
// Tipos de resposta da API
// ---------------------------------------------------------------------------

export interface ApiResponse<T = unknown> {
  sucesso: boolean;
  mensagem: string;
  dados?: T;
  erros?: string[];
}

// ---------------------------------------------------------------------------
// DTOs e tipos — Autenticação
// ---------------------------------------------------------------------------

export interface LoginPayload {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  usuario: {
    id_usuario: number;
    email: string;
    tipo_perfil: TipoPerfil;
    id_perfil: number | null;
  };
}

// ---------------------------------------------------------------------------
// Endpoints de Autenticação
// ---------------------------------------------------------------------------

export const authService = {
  /** POST /api/auth/login — Autentica e retorna JWT + dados do perfil */
  login: (payload: LoginPayload) =>
    api.post<ApiResponse<LoginResponse>>('/auth/login', payload),

  /** GET /api/auth/me — Retorna os dados do usuário autenticado (requer token) */
  me: () =>
    api.get<ApiResponse<{ id_usuario: number; email: string; tipo_perfil: TipoPerfil; id_perfil: number | null }>>('/auth/me'),
};

// ---------------------------------------------------------------------------
// DTOs de envio ao back-end
// ---------------------------------------------------------------------------

export interface CadastrarAlunoPayload {
  email_login: string;
  senha: string;
  nome_completo: string;
  cpf: string;
  rg?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  id_instituicao?: number;
  id_curso?: number;
}

export interface CadastrarEmpresaPayload {
  email_login: string;
  senha: string;
  razao_social: string;
  nome_fantasia?: string;
  cnpj: string;
  contato_nome?: string;
}

// ---------------------------------------------------------------------------
// Tipos de retorno para listagens (espelha o shape retornado pelo Prisma)
// ---------------------------------------------------------------------------

export interface UsuarioResumo {
  id_usuario: number;
  email_login: string;
  ativo: boolean;
  criado_em: string;
}

export interface AlunoListado {
  id_aluno: number;
  nome_completo: string;
  cpf: string;
  rg: string | null;
  saldo_moedas: string;
  usuario: UsuarioResumo;
}

export interface EmpresaListada {
  id_empresa: number;
  razao_social: string;
  nome_fantasia: string | null;
  cnpj: string;
  contato_nome: string | null;
  usuario: UsuarioResumo;
}

// ---------------------------------------------------------------------------
// Endpoints de Aluno
// ---------------------------------------------------------------------------

export const alunoService = {
  /** POST /api/alunos — Cadastra um novo aluno */
  cadastrar: (payload: CadastrarAlunoPayload) =>
    api.post<ApiResponse>('/alunos', payload),

  /** GET /api/alunos — Lista todos os alunos ativos */
  listar: () => api.get<ApiResponse<AlunoListado[]>>('/alunos'),

  /** GET /api/alunos/:id — Busca aluno por ID */
  buscarPorId: (id: number) => api.get<ApiResponse<AlunoListado>>(`/alunos/${id}`),

  /** PUT /api/alunos/:id — Atualiza aluno (campos parciais) */
  atualizar: (id: number, payload: Partial<CadastrarAlunoPayload>) =>
    api.put<ApiResponse>(`/alunos/${id}`, payload),

  /**
   * DELETE /api/alunos/:id — Desativação lógica (soft delete).
   * O registro permanece no banco com `ativo = false`.
   */
  desativar: (id: number) => api.delete<ApiResponse>(`/alunos/${id}`),
};

// ---------------------------------------------------------------------------
// Endpoints de Empresa Parceira
// ---------------------------------------------------------------------------

export const empresaService = {
  /** POST /api/empresas — Cadastra uma nova empresa */
  cadastrar: (payload: CadastrarEmpresaPayload) =>
    api.post<ApiResponse>('/empresas', payload),

  /** GET /api/empresas — Lista todas as empresas ativas */
  listar: () => api.get<ApiResponse<EmpresaListada[]>>('/empresas'),

  /** GET /api/empresas/:id — Busca empresa por ID */
  buscarPorId: (id: number) => api.get<ApiResponse<EmpresaListada>>(`/empresas/${id}`),

  /** PUT /api/empresas/:id — Atualiza empresa (campos parciais) */
  atualizar: (id: number, payload: Partial<CadastrarEmpresaPayload>) =>
    api.put<ApiResponse>(`/empresas/${id}`, payload),

  /**
   * DELETE /api/empresas/:id — Desativação lógica (soft delete).
   * O registro permanece no banco com `ativo = false`.
   */
  desativar: (id: number) => api.delete<ApiResponse>(`/empresas/${id}`),
};

// ---------------------------------------------------------------------------
// DTOs e tipos — Professor
// ---------------------------------------------------------------------------

export interface CadastrarProfessorPayload {
  email_login: string;
  senha: string;
  nome_completo: string;
  cpf: string;
  departamento?: string;
  saldo_inicial?: number;
}

export interface ProfessorListado {
  id_professor: number;
  nome_completo: string;
  cpf: string;
  departamento: string | null;
  saldo_moedas: string;
  usuario: UsuarioResumo;
}

// ---------------------------------------------------------------------------
// Endpoints de Professor
// ---------------------------------------------------------------------------

export const professorService = {
  cadastrar: (payload: CadastrarProfessorPayload) =>
    api.post<ApiResponse>('/professores', payload),

  listar: () => api.get<ApiResponse<ProfessorListado[]>>('/professores'),

  buscarPorId: (id: number) =>
    api.get<ApiResponse<ProfessorListado>>(`/professores/${id}`),
};

// ---------------------------------------------------------------------------
// DTOs e tipos — Transação
// ---------------------------------------------------------------------------

export interface EnviarMoedasPayload {
  idProfessor: number;
  idAluno: number;
  quantidade: number;
  motivo: string;
}

export interface ReconhecimentoMerito {
  id_reconhecimento: number;
  quantidade: string;
  motivo: string;
  criado_em: string;
  professor: { nome_completo: string };
  aluno: { nome_completo: string };
}

// ---------------------------------------------------------------------------
// Endpoints de Transação
// ---------------------------------------------------------------------------

export const transacaoService = {
  /** POST /api/transacoes/enviar — Transfere moedas de Professor para Aluno */
  enviarMoedas: (payload: EnviarMoedasPayload) =>
    api.post<ApiResponse<ReconhecimentoMerito>>('/transacoes/enviar', payload),
};

// ---------------------------------------------------------------------------
// DTOs e tipos — Extrato
// ---------------------------------------------------------------------------

export interface EnvioExtrato {
  id: number;
  tipo: 'SAIDA';
  quantidade: string | number;
  motivo: string;
  destinatario: string;
  data: string;
}

export interface RecebimentoDistribuicao {
  id: number;
  tipo: 'ENTRADA';
  quantidade: string | number;
  semestre: string;
  data: string;
}

export interface ExtratoProfessor {
  professor: {
    id_professor: number;
    nome_completo: string;
    email_login: string;
    saldo_moedas: string | number;
  };
  envios: EnvioExtrato[];
  recebimentos: RecebimentoDistribuicao[];
}

export interface RecebimentoAluno {
  id: number;
  tipo: 'ENTRADA';
  quantidade: string | number;
  motivo: string;
  remetente: string;
  data: string;
}

export interface ResgateExtratoAluno {
  id: number;
  tipo: 'SAIDA';
  quantidade: string | number;
  descricao: string;
  status: string;
  empresa: string;
  data: string;
}

export interface ExtratoAluno {
  aluno: {
    id_aluno: number;
    nome_completo: string;
    email_login: string;
    saldo_moedas: string | number;
  };
  recebimentos: RecebimentoAluno[];
  resgates: ResgateExtratoAluno[];
}

// ---------------------------------------------------------------------------
// Endpoints de Extrato
// ---------------------------------------------------------------------------

export const extratoService = {
  /** GET /api/extratos/professor/:id */
  professor: (id: number) =>
    api.get<ApiResponse<ExtratoProfessor>>(`/extratos/professor/${id}`),

  /** GET /api/extratos/aluno/:id */
  aluno: (id: number) =>
    api.get<ApiResponse<ExtratoAluno>>(`/extratos/aluno/${id}`),
};

// ---------------------------------------------------------------------------
// DTOs e tipos — Vantagens
// ---------------------------------------------------------------------------

export interface Vantagem {
  id_vantagem: number;
  nome: string;
  descricao: string;
  foto_url: string | null;
  custo_moedas: string | number;
  ativo: boolean;
  criado_em: string;
  empresa: {
    id_empresa: number;
    razao_social: string;
    nome_fantasia: string | null;
  };
}

export interface ResgatarVantagemPayload {
  id_vantagem: number;
}

export interface ResgatarVantagemResponse {
  id_resgate: number;
  codigo_cupom: string;
  quantidade: string | number;
  descricao: string;
  nome_empresa: string;
}

// ---------------------------------------------------------------------------
// Endpoints de Vantagens
// ---------------------------------------------------------------------------

export const vantagemService = {
  /** GET /api/vantagens — Lista vantagens ativas */
  listar: () =>
    api.get<ApiResponse<Vantagem[]>>('/vantagens'),

  /** GET /api/vantagens/:id — Busca vantagem específica */
  buscarPorId: (id: number) =>
    api.get<ApiResponse<Vantagem>>(`/vantagens/${id}`),

  /** POST /api/vantagens/resgatar — Resgata vantagem (aluno) */
  resgatar: (payload: ResgatarVantagemPayload) =>
    api.post<ApiResponse<ResgatarVantagemResponse>>('/vantagens/resgatar', payload),
};

export default api;

// ---------------------------------------------------------------------------
// DTOs e tipos — Resgates / Cupons (Empresa)
// ---------------------------------------------------------------------------

export interface ResgateListado {
  id_resgate: number;
  codigo_cupom: string;
  quantidade: string | number;
  descricao: string;
  status: 'PENDENTE' | 'ENVIADO' | 'CONCLUIDO';
  criado_em: string;
  aluno: {
    nome_completo: string;
    usuario: { email_login: string };
  };
  vantagem: {
    nome: string;
    custo_moedas: string | number;
  };
}

export interface ValidarCupomPayload {
  codigo_cupom: string;
}

export interface ValidarCupomResponse {
  id_resgate: number;
  codigo_cupom: string;
  status: string;
  aluno: string;
  vantagem: string;
}

// ---------------------------------------------------------------------------
// Endpoints de Cupons / Resgates
// ---------------------------------------------------------------------------

export const cupomService = {
  /** GET /api/vantagens/resgates — Lista resgates da empresa autenticada */
  listarResgates: (status?: string) =>
    api.get<ApiResponse<ResgateListado[]>>('/vantagens/resgates', { params: status ? { status } : {} }),

  /** POST /api/vantagens/validar-cupom — Valida um cupom pelo código */
  validar: (payload: ValidarCupomPayload) =>
    api.post<ApiResponse<ValidarCupomResponse>>('/vantagens/validar-cupom', payload),
};

// ---------------------------------------------------------------------------
// Endpoints de Cadastro de Vantagens (Empresa)
// ---------------------------------------------------------------------------

export interface CadastrarVantagemPayload {
  nome: string;
  descricao: string;
  foto_url?: string;
  custo_moedas: number;
}

export const empresaVantagemService = {
  /** POST /api/vantagens — Cadastra nova vantagem */
  criar: (payload: CadastrarVantagemPayload) =>
    api.post<ApiResponse<Vantagem>>('/vantagens', payload),

  /** PUT /api/vantagens/:id — Atualiza vantagem */
  atualizar: (id: number, payload: Partial<CadastrarVantagemPayload>) =>
    api.put<ApiResponse<Vantagem>>(`/vantagens/${id}`, payload),

  /** DELETE /api/vantagens/:id — Desativa vantagem */
  desativar: (id: number) =>
    api.delete<ApiResponse>(`/vantagens/${id}`),
};
