// =============================================================================
// src/layouts/AppLayout.tsx — Shell Principal da Aplicação — Unicred
// =============================================================================

import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth, type TipoPerfil } from '../contexts/AuthContext';

// ---------------------------------------------------------------------------
// Ícones SVG
// ---------------------------------------------------------------------------
const IconMoeda = () => (
  <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
  </svg>
);
const IconExtrato = () => (
  <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2zm0 0V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v10m-6 0a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2m0 0V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z" />
  </svg>
);
const IconVitrine = () => (
  <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72L4.318 3.44A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72m-13.5 8.65h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .415.336.75.75.75z" />
  </svg>
);
const IconAdicionar = () => (
  <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
  </svg>
);
const IconCupom = () => (
  <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0c1.1.128 1.907 1.077 1.907 2.185z" />
  </svg>
);
const IconMenu = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);
const IconLogout = () => (
  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
  </svg>
);
const IconClose = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// ---------------------------------------------------------------------------
// Config por perfil
// ---------------------------------------------------------------------------

interface NavItem { to: string; icon: React.ReactNode; label: string; }

const menuByProfile: Record<TipoPerfil, NavItem[]> = {
  PROFESSOR: [
    { to: '/professor/enviar-moedas', icon: <IconMoeda />,   label: 'Enviar Créditos'      },
    { to: '/professor/extrato',       icon: <IconExtrato />, label: 'Meu Extrato'           },
  ],
  ALUNO: [
    { to: '/aluno/vitrine',  icon: <IconVitrine />,  label: 'Vitrine de Vantagens' },
    { to: '/aluno/extrato',  icon: <IconExtrato />,  label: 'Meu Extrato'          },
  ],
  EMPRESA: [
    { to: '/empresa/cadastrar-vantagem', icon: <IconAdicionar />, label: 'Minhas Vantagens'  },
    { to: '/empresa/validar-cupons',     icon: <IconCupom />,     label: 'Validar Cupons'    },
  ],
};

const config: Record<TipoPerfil, {
  gradiente: string; ativo: string; badge: string; avatar: string; label: string; emoji: string;
}> = {
  PROFESSOR: { gradiente: 'from-blue-700 to-blue-500',     ativo: 'bg-blue-600 text-white shadow',    badge: 'bg-blue-100 text-blue-700',     avatar: 'from-blue-600 to-blue-500',    label: 'Professor',        emoji: '👨‍🏫' },
  ALUNO:     { gradiente: 'from-violet-700 to-violet-500', ativo: 'bg-violet-600 text-white shadow',  badge: 'bg-violet-100 text-violet-700', avatar: 'from-violet-600 to-violet-500',label: 'Aluno',            emoji: '🎓' },
  EMPRESA:   { gradiente: 'from-emerald-700 to-emerald-500',ativo: 'bg-emerald-600 text-white shadow',badge: 'bg-emerald-100 text-emerald-700',avatar: 'from-emerald-600 to-emerald-500',label: 'Empresa Parceira',emoji: '🏢' },
};

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

export default function AppLayout() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarAberta, setSidebarAberta] = useState(false);

  if (!usuario) return null;

  const perfil   = usuario.tipo_perfil;
  const c        = config[perfil];
  const items    = menuByProfile[perfil];
  const inicial  = (usuario.email?.charAt(0) ?? '?').toUpperCase();

  function handleLogout() { logout(); navigate('/login', { replace: true }); }

  function SidebarContent() {
    return (
      <div className="flex flex-col h-full bg-white border-r border-slate-200">
        {/* Logo */}
        <div className={`bg-gradient-to-br ${c.gradiente} px-5 py-6`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl">🪙</div>
            <div>
              <p className="text-white font-bold text-base leading-tight">Unicred</p>
              <p className="text-white/70 text-xs">Créditos Estudantis</p>
            </div>
          </div>
          {/* Badge de perfil */}
          <div className="bg-white/15 rounded-xl px-3 py-2 flex items-center gap-2">
            <span className="text-lg">{c.emoji}</span>
            <div>
              <p className="text-white/70 text-xs">Logado como</p>
              <p className="text-white font-semibold text-xs">{c.label}</p>
            </div>
          </div>
        </div>

        {/* Navegação */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider px-3 mb-3">Menu</p>
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setSidebarAberta(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? c.ativo
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Usuário */}
        <div className="px-4 py-4 border-t border-slate-100 space-y-3">
          <div className="flex items-center gap-3">
            <div className={`h-9 w-9 rounded-full bg-gradient-to-br ${c.avatar} flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm`}>
              {inicial}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-800 truncate">{usuario?.email}</p>
              <span className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-xs font-semibold ${c.badge}`}>
                {c.label}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-150"
          >
            <IconLogout />
            Sair da conta
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">

      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0">
        <SidebarContent />
      </aside>

      {/* Sidebar Mobile (overlay) */}
      {sidebarAberta && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarAberta(false)} />
          <aside className="relative z-10 w-72 h-full shadow-2xl">
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={() => setSidebarAberta(false)}
                className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              >
                <IconClose />
              </button>
            </div>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Área Principal */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Header mobile */}
        <header className="lg:hidden bg-white border-b border-slate-200 px-4 h-14 flex items-center justify-between shadow-sm shrink-0">
          <button
            onClick={() => setSidebarAberta(true)}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <IconMenu />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-lg">🪙</span>
            <span className="font-bold text-slate-800 text-sm">Unicred</span>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <IconLogout />
          </button>
        </header>

        {/* Conteúdo */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
