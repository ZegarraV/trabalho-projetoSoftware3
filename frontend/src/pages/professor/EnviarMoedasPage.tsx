// =============================================================================
// src/pages/professor/EnviarMoedasPage.tsx — Unicred
//
// Melhorias v2:
//   - Removido o botão "Enviar Créditos" flutuante (sem aluno selecionado)
//   - Mensagem de erro ao tentar carregar alunos
//   - Exibe saldo atualizado após cada transferência
//   - Feedback visual com contagem de transferências na sessão
// =============================================================================

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ModalEnviarMoedas from '../../components/ModalEnviarMoedas';
import { alunoService, professorService, type AlunoListado } from '../../services/api';

function Spinner() {
  return <span className="inline-block h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />;
}

export default function EnviarMoedasPage() {
  const { usuario } = useAuth();
  const idProfessor = usuario?.id_perfil;

  const [modalAberto, setModalAberto]           = useState(false);
  const [alunoSelecionado, setAlunoSelecionado] = useState<number | undefined>();
  const [enviados, setEnviados]                 = useState(0);

  const [alunos, setAlunos]         = useState<AlunoListado[]>([]);
  const [saldoProf, setSaldoProf]   = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erroCarga, setErroCarga]   = useState<string | null>(null);
  const [busca, setBusca]           = useState('');

  useEffect(() => {
    if (!idProfessor) return;
    async function carregar() {
      setErroCarga(null);
      try {
        const [resAlunos, resProfessor] = await Promise.all([
          alunoService.listar(),
          professorService.buscarPorId(idProfessor!),
        ]);
        setAlunos(resAlunos.data.dados ?? []);
        setSaldoProf(String(resProfessor.data.dados?.saldo_moedas ?? '?'));
      } catch {
        setErroCarga('Não foi possível carregar os dados. Tente recarregar a página.');
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, [idProfessor, enviados]);

  if (!idProfessor) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-500">Perfil de professor não encontrado.</p>
      </div>
    );
  }

  const alunosFiltrados = alunos.filter((a) =>
    a.nome_completo.toLowerCase().includes(busca.toLowerCase()) ||
    a.usuario.email_login.toLowerCase().includes(busca.toLowerCase())
  );

  function abrirModalParaAluno(idAluno: number) {
    setAlunoSelecionado(idAluno);
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
    setAlunoSelecionado(undefined);
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Enviar Créditos</h1>
        <p className="text-slate-500 mt-1">Reconheça o desempenho de um aluno transferindo créditos do seu saldo.</p>
      </div>

      {/* Saldo card */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-600 rounded-2xl p-5 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-200 text-sm">Seu saldo disponível</p>
            <p className="text-4xl font-bold mt-1">
              {saldoProf !== null ? Number(saldoProf).toLocaleString('pt-BR') : '—'}{' '}
              <span className="text-2xl font-normal text-blue-200">créditos</span>
            </p>
          </div>
          <div className="h-14 w-14 rounded-2xl bg-blue-500/40 flex items-center justify-center text-3xl">🪙</div>
        </div>
        {enviados > 0 && (
          <p className="text-blue-200 text-sm mt-3">
            ✅ {enviados} transferência{enviados > 1 ? 's' : ''} realizada{enviados > 1 ? 's' : ''} nesta sessão.
          </p>
        )}
      </div>

      {/* Busca */}
      <div>
        <input
          type="text"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar aluno por nome ou e-mail..."
          className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Erro de carga */}
      {erroCarga && (
        <div className="flex items-start gap-3 rounded-xl bg-red-50 border border-red-200 p-4">
          <span className="text-red-500 shrink-0">⚠️</span>
          <p className="text-sm text-red-700 font-medium">{erroCarga}</p>
        </div>
      )}

      {/* Lista de alunos */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-700">Alunos Cadastrados</h2>
          {!carregando && (
            <span className="text-xs text-slate-400">{alunosFiltrados.length} aluno{alunosFiltrados.length !== 1 ? 's' : ''}</span>
          )}
        </div>

        {carregando ? (
          <div className="flex items-center justify-center gap-3 py-14 text-slate-500">
            <Spinner /> Carregando alunos...
          </div>
        ) : alunosFiltrados.length === 0 ? (
          <div className="text-center py-14 text-slate-400">
            <p className="text-3xl mb-2">🎓</p>
            <p className="text-sm">{busca ? 'Nenhum aluno encontrado para esta busca.' : 'Nenhum aluno cadastrado.'}</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {alunosFiltrados.map((a) => (
              <div key={a.id_aluno} className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm shrink-0">
                    {a.nome_completo.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{a.nome_completo}</p>
                    <p className="text-xs text-slate-400 truncate">{a.usuario.email_login}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-800">{Number(a.saldo_moedas).toLocaleString('pt-BR')}</p>
                    <p className="text-xs text-slate-400">créditos</p>
                  </div>
                  <button
                    onClick={() => abrirModalParaAluno(a.id_aluno)}
                    className="rounded-lg bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-600 hover:text-white px-3 py-1.5 text-xs font-semibold transition-colors"
                    title={`Enviar créditos para ${a.nome_completo}`}
                  >
                    Enviar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {modalAberto && alunoSelecionado !== undefined && (
        <ModalEnviarMoedas
          idProfessor={idProfessor}
          idAlunoPreSelecionado={alunoSelecionado}
          onFechar={fecharModal}
          onEnviado={() => {
            setEnviados((n) => n + 1);
            fecharModal();
          }}
        />
      )}
    </div>
  );
}
