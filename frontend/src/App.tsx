// =============================================================================
// src/App.tsx — Roteamento principal da aplicação
// =============================================================================

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Auth
import { AuthProvider, useAuth, type TipoPerfil } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './layouts/AppLayout';

// Páginas públicas
import Login from './pages/Login';
import AcessoNegado from './pages/AcessoNegado';
import CadastroAluno from './components/CadastroAluno';
import CadastroEmpresa from './components/CadastroEmpresa';
import CadastroProfessorPage from './pages/professor/CadastroProfessorPage';

// Páginas do Professor
import EnviarMoedasPage from './pages/professor/EnviarMoedasPage';
import ExtratoProfessorPage from './pages/professor/ExtratoProfessorPage';

// Páginas do Aluno
import VitrineVantagensPage from './pages/aluno/VitrineVantagensPage';
import ExtratoAlunoPage from './pages/aluno/ExtratoAlunoPage';

// Páginas da Empresa
import CadastrarVantagemPage from './pages/empresa/CadastrarVantagemPage';
import ValidarCuponsPage from './pages/empresa/ValidarCuponsPage';

// ---------------------------------------------------------------------------
// Redirecionamento inteligente na rota raiz
// ---------------------------------------------------------------------------

const destinoByProfile: Record<TipoPerfil, string> = {
  PROFESSOR: '/professor/enviar-moedas',
  ALUNO:     '/aluno/vitrine',
  EMPRESA:   '/empresa/cadastrar-vantagem',
};

function HomeRedirect() {
  const { usuario } = useAuth();
  if (!usuario) return <Navigate to="/login" replace />;
  return <Navigate to={destinoByProfile[usuario.tipo_perfil]} replace />;
}

// ---------------------------------------------------------------------------
// Componente raiz
// ---------------------------------------------------------------------------

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* ── Rotas públicas ─────────────────────────────────────────── */}
          <Route path="/login"               element={<Login />} />
          <Route path="/acesso-negado"       element={<AcessoNegado />} />
          <Route path="/cadastro-aluno"      element={<CadastroAluno />} />
          <Route path="/cadastro-empresa"    element={<CadastroEmpresa />} />
          <Route path="/cadastro-professor"  element={<CadastroProfessorPage />} />

          {/* ── Rotas protegidas (qualquer usuário autenticado) ─────────── */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>

              {/* Redirecionamento pela raiz */}
              <Route index path="/" element={<HomeRedirect />} />

              {/* PROFESSOR */}
              <Route element={<ProtectedRoute allowedRoles={['PROFESSOR']} />}>
                <Route path="/professor/enviar-moedas" element={<EnviarMoedasPage />} />
                <Route path="/professor/extrato"       element={<ExtratoProfessorPage />} />
              </Route>

              {/* ALUNO */}
              <Route element={<ProtectedRoute allowedRoles={['ALUNO']} />}>
                <Route path="/aluno/vitrine"  element={<VitrineVantagensPage />} />
                <Route path="/aluno/extrato"  element={<ExtratoAlunoPage />} />
              </Route>

              {/* EMPRESA */}
              <Route element={<ProtectedRoute allowedRoles={['EMPRESA']} />}>
                <Route path="/empresa/cadastrar-vantagem" element={<CadastrarVantagemPage />} />
                <Route path="/empresa/validar-cupons"     element={<ValidarCuponsPage />} />
              </Route>

            </Route>
          </Route>

          {/* ── Fallback ────────────────────────────────────────────────── */}
          <Route path="*" element={<Navigate to="/login" replace />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
