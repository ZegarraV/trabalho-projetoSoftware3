// =============================================================================
// src/components/CadastroAluno.tsx — Formulário de Cadastro de Aluno
//
// Formulário multi-seções com layout responsivo (grade de múltiplas colunas).
// Integra com o back-end via alunoService (Axios) e exibe toast notifications.
// =============================================================================

import { useState, type FormEvent } from 'react';
import axios from 'axios';
import { alunoService, type CadastrarAlunoPayload } from '../services/api';
import { ToastContainer, useToast } from './Toast';

// ---------------------------------------------------------------------------
// Estado inicial do formulário
// ---------------------------------------------------------------------------
const estadoInicial: CadastrarAlunoPayload & { confirmar_senha: string } = {
  nome_completo:  '',
  cpf:            '',
  rg:             '',
  logradouro:     '',
  numero:         '',
  complemento:    '',
  bairro:         '',
  cidade:         '',
  estado:         '',
  cep:            '',
  email_login:    '',
  senha:          '',
  confirmar_senha: '',
};

// ---------------------------------------------------------------------------
// Componente auxiliar: campo de formulário
// ---------------------------------------------------------------------------
interface CampoProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  type?: string;
  placeholder?: string;
  obrigatorio?: boolean;
  maxLength?: number;
  erro?: string;
}

function Campo({
  label, name, value, onChange, type = 'text',
  placeholder, obrigatorio, maxLength, erro,
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
      {erro && <p className="mt-1 text-xs text-red-500">{erro}</p>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

export default function CadastroAluno() {
  const [form, setForm] = useState(estadoInicial);
  const [erros, setErros] = useState<Partial<typeof estadoInicial>>({});
  const [carregando, setCarregando] = useState(false);
  const { toasts, adicionarToast, removerToast } = useToast();

  // Atualiza o campo correspondente no estado do formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Limpa o erro do campo ao digitar
    if (erros[name as keyof typeof erros]) {
      setErros((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Validação no lado do cliente antes de enviar ao servidor
  const validar = (): boolean => {
    const novosErros: Partial<typeof estadoInicial> = {};

    if (!form.nome_completo.trim()) novosErros.nome_completo = 'Nome completo é obrigatório.';

    const cpfLimpo = form.cpf.replace(/\D/g, '');
    if (!cpfLimpo) {
      novosErros.cpf = 'CPF é obrigatório.';
    } else if (cpfLimpo.length !== 11) {
      novosErros.cpf = 'CPF deve ter 11 dígitos.';
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
      // Remove o campo de confirmação de senha antes de enviar
      const { confirmar_senha, ...payload } = form;
      void confirmar_senha; // descarta explicitamente

      // Remove campos vazios para não poluir a requisição
      const payloadLimpo = Object.fromEntries(
        Object.entries(payload).filter(([, v]) => v !== '')
      ) as unknown as CadastrarAlunoPayload;

      const resposta = await alunoService.cadastrar(payloadLimpo);

      if (resposta.data.sucesso) {
        adicionarToast(resposta.data.mensagem, 'sucesso');
        setForm(estadoInicial); // Limpa o formulário após sucesso
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-10 px-4">
        <div className="max-w-4xl mx-auto">

          {/* ── Cabeçalho ── */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
              <span>🎓</span> Sistema de Unicred
            </div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Cadastro de Aluno
            </h1>
            <p className="mt-1 text-slate-500 text-sm">
              Preencha as informações abaixo para criar uma nova conta de aluno no sistema.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="space-y-6">

              {/* ── Seção 1: Dados Pessoais ── */}
              <div className="form-section-card">
                <h2 className="form-section-title">
                  <span className="p-1.5 bg-blue-100 rounded-lg text-blue-600 text-sm">👤</span>
                  Dados Pessoais
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div className="md:col-span-2">
                    <Campo
                      label="Nome Completo"
                      name="nome_completo"
                      value={form.nome_completo}
                      onChange={handleChange}
                      placeholder="Ex.: João da Silva Pereira"
                      obrigatorio
                      erro={erros.nome_completo}
                    />
                  </div>
                  <Campo
                    label="CPF"
                    name="cpf"
                    value={form.cpf}
                    onChange={handleChange}
                    placeholder="000.000.000-00"
                    obrigatorio
                    maxLength={14}
                    erro={erros.cpf}
                  />
                  <Campo
                    label="RG"
                    name="rg"
                    value={form.rg ?? ''}
                    onChange={handleChange}
                    placeholder="00.000.000-0"
                    maxLength={12}
                  />
                </div>
              </div>

              {/* ── Seção 2: Endereço ── */}
              <div className="form-section-card">
                <h2 className="form-section-title">
                  <span className="p-1.5 bg-green-100 rounded-lg text-green-600 text-sm">📍</span>
                  Endereço
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                  <div className="md:col-span-2">
                    <Campo
                      label="Logradouro"
                      name="logradouro"
                      value={form.logradouro ?? ''}
                      onChange={handleChange}
                      placeholder="Rua, Avenida, etc."
                    />
                  </div>
                  <Campo
                    label="Número"
                    name="numero"
                    value={form.numero ?? ''}
                    onChange={handleChange}
                    placeholder="Ex.: 123"
                  />
                  <Campo
                    label="Complemento"
                    name="complemento"
                    value={form.complemento ?? ''}
                    onChange={handleChange}
                    placeholder="Apto, Bloco, etc."
                  />
                  <Campo
                    label="Bairro"
                    name="bairro"
                    value={form.bairro ?? ''}
                    onChange={handleChange}
                    placeholder="Nome do bairro"
                  />
                  <Campo
                    label="CEP"
                    name="cep"
                    value={form.cep ?? ''}
                    onChange={handleChange}
                    placeholder="00000-000"
                    maxLength={9}
                  />
                  <div className="md:col-span-2">
                    <Campo
                      label="Cidade"
                      name="cidade"
                      value={form.cidade ?? ''}
                      onChange={handleChange}
                      placeholder="Nome da cidade"
                    />
                  </div>
                  <div>
                    <label htmlFor="estado" className="form-label">Estado</label>
                    <select
                      id="estado"
                      name="estado"
                      value={form.estado ?? ''}
                      onChange={handleChange}
                      className="form-input"
                    >
                      <option value="">Selecione</option>
                      {['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS',
                        'MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC',
                        'SP','SE','TO'].map((uf) => (
                        <option key={uf} value={uf}>{uf}</option>
                      ))}
                    </select>
                  </div>
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
                      placeholder="seu@email.com"
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
                  ) : 'Cadastrar Aluno'}
                </button>
              </div>

            </div>
          </form>
        </div>
      </div>

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onRemover={removerToast} />
    </>
  );
}
