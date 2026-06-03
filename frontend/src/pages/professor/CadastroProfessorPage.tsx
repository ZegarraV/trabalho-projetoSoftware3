// =============================================================================
// src/pages/professor/CadastroProfessorPage.tsx — Cadastro de Professor
//
// Formulário público de auto-cadastro de professores.
// Após cadastro bem-sucedido, redireciona para /login.
// =============================================================================

import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { professorService } from '../../services/api';

function Spinner() {
  return (
    <span className="inline-block h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
  );
}

interface FormData {
  email_login: string;
  senha: string;
  confirmar_senha: string;
  nome_completo: string;
  cpf: string;
  departamento: string;
}

function formatarCPF(valor: string): string {
  const nums = valor.replace(/\D/g, '').slice(0, 11);
  if (nums.length <= 3) return nums;
  if (nums.length <= 6) return `${nums.slice(0, 3)}.${nums.slice(3)}`;
  if (nums.length <= 9) return `${nums.slice(0, 3)}.${nums.slice(3, 6)}.${nums.slice(6)}`;
  return `${nums.slice(0, 3)}.${nums.slice(3, 6)}.${nums.slice(6, 9)}-${nums.slice(9)}`;
}

export default function CadastroProfessorPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState<FormData>({
    email_login: '',
    senha: '',
    confirmar_senha: '',
    nome_completo: '',
    cpf: '',
    departamento: '',
  });

  const [mostrarSenha,     setMostrarSenha]     = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const [erro,             setErro]             = useState<string | null>(null);
  const [sucesso,          setSucesso]          = useState(false);
  const [carregando,       setCarregando]       = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    if (name === 'cpf') {
      setForm((f) => ({ ...f, cpf: formatarCPF(value) }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErro(null);

    if (form.senha !== form.confirmar_senha) {
      setErro('As senhas não coincidem.');
      return;
    }
    if (form.senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setCarregando(true);
    try {
      await professorService.cadastrar({
        email_login:   form.email_login.trim(),
        senha:         form.senha,
        nome_completo: form.nome_completo.trim(),
        cpf:           form.cpf.replace(/\D/g, ''),
        departamento:  form.departamento.trim() || undefined,
      });

      setSucesso(true);
      setTimeout(() => navigate('/login', { replace: true }), 2500);
    } catch (err: unknown) {
      const mensagem = axios.isAxiosError(err)
        ? (err.response?.data?.mensagem ?? 'Erro ao conectar com o servidor.')
        : 'Erro inesperado. Tente novamente.';
      setErro(mensagem);
    } finally {
      setCarregando(false);
    }
  }

  if (sucesso) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-green-500 shadow-lg mb-6">
            <span className="text-4xl">✅</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Cadastro realizado!</h2>
          <p className="text-slate-300 text-sm">Redirecionando para o login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">

        {/* Marca */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-blue-500 shadow-lg shadow-blue-500/30 mb-4">
            <span className="text-3xl">🎓</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Unicred</h1>
          <p className="text-slate-400 text-sm mt-1">Cadastro de Professor</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl shadow-black/20 p-8">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Criar conta de professor</h2>

          {erro && (
            <div className="mb-5 flex items-start gap-3 rounded-xl bg-red-50 border border-red-200 p-4">
              <span className="text-red-500 shrink-0">⚠️</span>
              <p className="text-sm text-red-700 font-medium">{erro}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Nome */}
            <div>
              <label htmlFor="nome_completo" className="form-label">Nome completo *</label>
              <input
                id="nome_completo" name="nome_completo" type="text"
                autoComplete="name"
                value={form.nome_completo} onChange={handleChange}
                placeholder="Prof. João da Silva"
                className="form-input" disabled={carregando} required
              />
            </div>

            {/* CPF */}
            <div>
              <label htmlFor="cpf" className="form-label">CPF *</label>
              <input
                id="cpf" name="cpf" type="text"
                inputMode="numeric"
                value={form.cpf} onChange={handleChange}
                placeholder="000.000.000-00"
                className="form-input" disabled={carregando} required
              />
            </div>

            {/* Departamento */}
            <div>
              <label htmlFor="departamento" className="form-label">
                Departamento <span className="text-slate-400 font-normal">(opcional)</span>
              </label>
              <input
                id="departamento" name="departamento" type="text"
                value={form.departamento} onChange={handleChange}
                placeholder="Ex.: Ciência da Computação"
                className="form-input" disabled={carregando}
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email_login" className="form-label">E-mail *</label>
              <input
                id="email_login" name="email_login" type="email"
                autoComplete="email"
                value={form.email_login} onChange={handleChange}
                placeholder="professor@universidade.edu.br"
                className="form-input" disabled={carregando} required
              />
            </div>

            {/* Senha */}
            <div>
              <label htmlFor="senha" className="form-label">Senha *</label>
              <div className="relative">
                <input
                  id="senha" name="senha"
                  type={mostrarSenha ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={form.senha} onChange={handleChange}
                  placeholder="Mínimo 6 caracteres"
                  className="form-input pr-10" disabled={carregando} required minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  tabIndex={-1}
                  aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {mostrarSenha ? (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Confirmar Senha */}
            <div>
              <label htmlFor="confirmar_senha" className="form-label">Confirmar senha *</label>
              <div className="relative">
                <input
                  id="confirmar_senha" name="confirmar_senha"
                  type={mostrarConfirmar ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={form.confirmar_senha} onChange={handleChange}
                  placeholder="Repita a senha"
                  className="form-input pr-10" disabled={carregando} required
                />
                <button
                  type="button"
                  onClick={() => setMostrarConfirmar(!mostrarConfirmar)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  tabIndex={-1}
                  aria-label={mostrarConfirmar ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {mostrarConfirmar ? (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={carregando}
              className="btn-primary w-full mt-2 flex items-center justify-center gap-2"
            >
              {carregando ? <><Spinner /> Cadastrando...</> : 'Criar conta'}
            </button>
          </form>
        </div>

        {/* Links */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-slate-400 text-sm">Já tem conta?</p>
          <Link
            to="/login"
            className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
          >
            Fazer login
          </Link>
        </div>

      </div>
    </div>
  );
}
