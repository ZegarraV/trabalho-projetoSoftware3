// =============================================================================
// src/components/CadastroEmpresa.tsx — Formulário de Cadastro de Empresa Parceira
//
// Design elegante com seções bem definidas. Integra com o back-end via
// empresaService (Axios) e exibe feedbacks visuais via Toast.
// =============================================================================

import { useState, type FormEvent } from 'react';
import axios from 'axios';
import { empresaService, type CadastrarEmpresaPayload } from '../services/api';
import { ToastContainer, useToast } from './Toast';

// ---------------------------------------------------------------------------
// Estado inicial
// ---------------------------------------------------------------------------
const estadoInicial: CadastrarEmpresaPayload & { confirmar_senha: string } = {
  razao_social:    '',
  nome_fantasia:   '',
  cnpj:            '',
  contato_nome:    '',
  email_login:     '',
  senha:           '',
  confirmar_senha: '',
};

// ---------------------------------------------------------------------------
// Componente auxiliar: Campo de formulário
// ---------------------------------------------------------------------------
interface CampoProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  obrigatorio?: boolean;
  maxLength?: number;
  erro?: string;
  dica?: string;
}

function Campo({
  label, name, value, onChange, type = 'text',
  placeholder, obrigatorio, maxLength, erro, dica,
}: CampoProps) {
  return (
    <div>
      <label htmlFor={name} className="form-label">
        {label}
        {obrigatorio && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        className={erro ? 'form-input-error' : 'form-input'}
        autoComplete="off"
      />
      {dica && !erro && <p className="mt-1 text-xs text-slate-400">{dica}</p>}
      {erro && <p className="mt-1 text-xs text-red-500">{erro}</p>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

export default function CadastroEmpresa() {
  const [form, setForm] = useState(estadoInicial);
  const [erros, setErros] = useState<Partial<typeof estadoInicial>>({});
  const [carregando, setCarregando] = useState(false);
  const { toasts, adicionarToast, removerToast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (erros[name as keyof typeof erros]) {
      setErros((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Validação client-side
  const validar = (): boolean => {
    const novosErros: Partial<typeof estadoInicial> = {};

    if (!form.razao_social.trim()) {
      novosErros.razao_social = 'Razão Social é obrigatória.';
    }

    const cnpjLimpo = form.cnpj.replace(/\D/g, '');
    if (!cnpjLimpo) {
      novosErros.cnpj = 'CNPJ é obrigatório.';
    } else if (cnpjLimpo.length !== 14) {
      novosErros.cnpj = 'CNPJ deve ter 14 dígitos.';
    }

    if (!form.email_login.trim()) {
      novosErros.email_login = 'E-mail é obrigatório.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email_login)) {
      novosErros.email_login = 'E-mail inválido.';
    }

    if (!form.senha) {
      novosErros.senha = 'Senha é obrigatória.';
    } else if (form.senha.length < 6) {
      novosErros.senha = 'A senha deve ter no mínimo 6 caracteres.';
    }

    if (form.senha !== form.confirmar_senha) {
      novosErros.confirmar_senha = 'As senhas não coincidem.';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validar()) return;

    setCarregando(true);

    try {
      const { confirmar_senha, ...payload } = form;
      void confirmar_senha;

      // Remove campos opcionais vazios
      const payloadLimpo = Object.fromEntries(
        Object.entries(payload).filter(([, v]) => v !== '')
      ) as unknown as CadastrarEmpresaPayload;

      const resposta = await empresaService.cadastrar(payloadLimpo);

      if (resposta.data.sucesso) {
        adicionarToast(resposta.data.mensagem, 'sucesso');
        setForm(estadoInicial);
        setErros({});
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const mensagem =
          err.response?.data?.mensagem ?? 'Erro ao conectar com o servidor.';
        adicionarToast(mensagem, 'erro');
      } else {
        adicionarToast('Erro inesperado. Tente novamente.', 'erro');
      }
    } finally {
      setCarregando(false);
    }
  };

  const handleLimpar = () => {
    setForm(estadoInicial);
    setErros({});
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 py-10 px-4">
        <div className="max-w-3xl mx-auto">

          {/* ── Cabeçalho ── */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
              <span>🏢</span> Sistema de Unicred
            </div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Cadastro de Empresa Parceira
            </h1>
            <p className="mt-1 text-slate-500 text-sm">
              Registre sua empresa para oferecer vantagens exclusivas aos alunos da rede.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="space-y-6">

              {/* ── Seção 1: Dados da Empresa ── */}
              <div className="form-section-card">
                <h2 className="form-section-title">
                  <span className="p-1.5 bg-indigo-100 rounded-lg text-indigo-600 text-sm">🏢</span>
                  Dados da Empresa
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div className="md:col-span-2">
                    <Campo
                      label="Razão Social"
                      name="razao_social"
                      value={form.razao_social}
                      onChange={handleChange}
                      placeholder="Nome oficial registrado no CNPJ"
                      obrigatorio
                      erro={erros.razao_social}
                    />
                  </div>
                  <Campo
                    label="Nome Fantasia"
                    name="nome_fantasia"
                    value={form.nome_fantasia ?? ''}
                    onChange={handleChange}
                    placeholder="Como a empresa é conhecida"
                    dica="Campo opcional"
                  />
                  <Campo
                    label="CNPJ"
                    name="cnpj"
                    value={form.cnpj}
                    onChange={handleChange}
                    placeholder="00.000.000/0000-00"
                    obrigatorio
                    maxLength={18}
                    erro={erros.cnpj}
                    dica="Somente números serão considerados"
                  />
                </div>
              </div>

              {/* ── Seção 2: Contato ── */}
              <div className="form-section-card">
                <h2 className="form-section-title">
                  <span className="p-1.5 bg-teal-100 rounded-lg text-teal-600 text-sm">📞</span>
                  Pessoa de Contato
                </h2>
                <div className="grid grid-cols-1 gap-y-4">
                  <Campo
                    label="Nome do Responsável"
                    name="contato_nome"
                    value={form.contato_nome ?? ''}
                    onChange={handleChange}
                    placeholder="Nome completo do responsável pelo cadastro"
                    dica="Campo opcional"
                  />
                </div>
              </div>

              {/* ── Seção 3: Credenciais de Acesso ── */}
              <div className="form-section-card">
                <h2 className="form-section-title">
                  <span className="p-1.5 bg-purple-100 rounded-lg text-purple-600 text-sm">🔐</span>
                  Credenciais de Acesso
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div className="md:col-span-2">
                    <Campo
                      label="E-mail de Login"
                      name="email_login"
                      value={form.email_login}
                      onChange={handleChange}
                      type="email"
                      placeholder="contato@empresa.com.br"
                      obrigatorio
                      erro={erros.email_login}
                    />
                  </div>
                  <Campo
                    label="Senha"
                    name="senha"
                    value={form.senha}
                    onChange={handleChange}
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    obrigatorio
                    erro={erros.senha}
                  />
                  <Campo
                    label="Confirmar Senha"
                    name="confirmar_senha"
                    value={form.confirmar_senha}
                    onChange={handleChange}
                    type="password"
                    placeholder="Repita a senha"
                    obrigatorio
                    erro={erros.confirmar_senha}
                  />
                </div>
              </div>

              {/* ── Banner informativo ── */}
              <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700">
                <span className="text-xl mt-0.5">ℹ️</span>
                <p>
                  Após o cadastro, a empresa estará apta a publicar vantagens e
                  benefícios para os alunos da rede conveniada. As credenciais criadas
                  serão utilizadas para o acesso ao painel da empresa.
                </p>
              </div>

              {/* ── Ações ── */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleLimpar}
                  className="btn-secondary"
                  disabled={carregando}
                >
                  Limpar
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={carregando}
                >
                  {carregando ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      Cadastrando...
                    </>
                  ) : 'Cadastrar Empresa'}
                </button>
              </div>

            </div>
          </form>
        </div>
      </div>

      <ToastContainer toasts={toasts} onRemover={removerToast} />
    </>
  );
}
