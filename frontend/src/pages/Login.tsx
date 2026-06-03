// =============================================================================
// src/pages/Login.tsx — Página de Autenticação — Unicred
// =============================================================================

import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth, type TipoPerfil } from '../contexts/AuthContext';
import { authService } from '../services/api';

const redirectByProfile: Record<TipoPerfil, string> = {
  PROFESSOR: '/professor/enviar-moedas',
  ALUNO:     '/aluno/vitrine',
  EMPRESA:   '/empresa/cadastrar-vantagem',
};

export default function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();

  const [email,        setEmail]        = useState('');
  const [senha,        setSenha]        = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro,         setErro]         = useState<string | null>(null);
  const [carregando,   setCarregando]   = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);
    try {
      const res = await authService.login({ email, senha });
      const { token, usuario } = res.data.dados!;
      login(token, {
        id_usuario:  usuario.id_usuario,
        email:       usuario.email,
        tipo_perfil: usuario.tipo_perfil,
        id_perfil:   usuario.id_perfil,
      });
      navigate(redirectByProfile[usuario.tipo_perfil], { replace: true });
    } catch (err: unknown) {
      const mensagem = axios.isAxiosError(err)
        ? (err.response?.data?.mensagem ?? 'Erro ao conectar com o servidor.')
        : 'Erro inesperado. Tente novamente.';
      setErro(mensagem);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Painel esquerdo — visual */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-700 via-blue-600 to-violet-700 flex-col items-center justify-center p-12 relative overflow-hidden">
        {/* Círculos decorativos */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/3 rounded-full -translate-x-1/2 -translate-y-1/2" />

        <div className="relative z-10 text-center max-w-sm">
          <div className="w-24 h-24 bg-white/20 rounded-3xl flex items-center justify-center text-5xl mx-auto mb-6 shadow-xl">🪙</div>
          <h1 className="text-white text-4xl font-bold mb-4 tracking-tight">Unicred</h1>
          <p className="text-blue-100 text-lg leading-relaxed mb-8">
            Sistema de Créditos Estudantis para reconhecimento de mérito acadêmico.
          </p>
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { emoji: '👨‍🏫', label: 'Professores' },
              { emoji: '🎓', label: 'Alunos' },
              { emoji: '🏢', label: 'Empresas' },
            ].map(({ emoji, label }) => (
              <div key={label} className="bg-white/15 rounded-2xl px-3 py-4 backdrop-blur-sm">
                <div className="text-2xl mb-1">{emoji}</div>
                <p className="text-white/80 text-xs font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Painel direito — formulário */}
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50">
        <div className="w-full max-w-md">
          {/* Logo mobile */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-violet-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3 shadow-lg">🪙</div>
            <h1 className="text-2xl font-bold text-slate-800">Unicred</h1>
            <p className="text-slate-500 text-sm">Sistema de Créditos Estudantis</p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
            <div className="mb-7">
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Bem-vindo de volta!</h2>
              <p className="text-slate-500 text-sm mt-1">Entre com suas credenciais para continuar</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* E-mail */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">E-mail</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    required
                    autoComplete="email"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all placeholder:text-slate-300 bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              {/* Senha */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Senha</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  </span>
                  <input
                    type={mostrarSenha ? 'text' : 'password'}
                    value={senha}
                    onChange={e => setSenha(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                    className="w-full pl-10 pr-12 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all placeholder:text-slate-300 bg-slate-50 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarSenha(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {mostrarSenha ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Erro */}
              {erro && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                  {erro}
                </div>
              )}

              {/* Botão */}
              <button
                type="submit"
                disabled={carregando}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-blue-200"
              >
                {carregando ? (
                  <>
                    <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Entrando...
                  </>
                ) : 'Entrar na plataforma'}
              </button>
            </form>

            {/* Links de cadastro */}
            <div className="mt-7 pt-6 border-t border-slate-100">
              <p className="text-center text-slate-500 text-sm mb-3">Não tem uma conta?</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { to: '/cadastro-aluno',     emoji: '🎓', label: 'Aluno'     },
                  { to: '/cadastro-professor', emoji: '👨‍🏫', label: 'Professor' },
                  { to: '/cadastro-empresa',   emoji: '🏢', label: 'Empresa'   },
                ].map(({ to, emoji, label }) => (
                  <Link
                    key={to}
                    to={to}
                    className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all group"
                  >
                    <span className="text-xl">{emoji}</span>
                    <span className="text-xs font-medium text-slate-600 group-hover:text-blue-700">{label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
