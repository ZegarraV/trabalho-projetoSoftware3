// =============================================================================
// src/pages/aluno/ExtratoAlunoPage.tsx
//
// Extrato do aluno logado. O id_aluno é obtido direto do AuthContext.
// =============================================================================

import { useAuth } from '../../contexts/AuthContext';
import ExtratoUsuario from '../../components/ExtratoUsuario';

export default function ExtratoAlunoPage() {
  const { usuario } = useAuth();
  const idAluno = usuario?.id_perfil;

  if (!idAluno) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-500">Perfil de aluno não encontrado.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Meu Extrato</h1>
        <p className="text-slate-500 mt-1">
          Veja as moedas recebidas de professores e os resgates de vantagens realizados.
        </p>
      </div>

      <ExtratoUsuario modo="aluno" id={idAluno} />
    </div>
  );
}
