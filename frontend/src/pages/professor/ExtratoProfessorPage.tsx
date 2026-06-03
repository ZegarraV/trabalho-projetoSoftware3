// =============================================================================
// src/pages/professor/ExtratoProfessorPage.tsx
//
// Extrato do professor logado. O id_professor é obtido direto do AuthContext.
// =============================================================================

import { useAuth } from '../../contexts/AuthContext';
import ExtratoUsuario from '../../components/ExtratoUsuario';

export default function ExtratoProfessorPage() {
  const { usuario } = useAuth();
  const idProfessor = usuario?.id_perfil;

  if (!idProfessor) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-500">Perfil de professor não encontrado.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Meu Extrato</h1>
        <p className="text-slate-500 mt-1">
          Visualize seu saldo atual, moedas enviadas a alunos e reposições semestrais.
        </p>
      </div>

      <ExtratoUsuario modo="professor" id={idProfessor} />
    </div>
  );
}
