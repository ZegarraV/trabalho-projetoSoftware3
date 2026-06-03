// =============================================================================
// src/pages/PainelProfessor.tsx — Painel do Professor
//
// Lista os professores cadastrados, exibe o saldo de cada um e permite
// abrir o ModalEnviarMoedas para transferir moedas a um aluno.
// =============================================================================

import { useState, useEffect } from 'react';
import { professorService, type ProfessorListado } from '../services/api';
import ModalEnviarMoedas from '../components/ModalEnviarMoedas';
import { ToastContainer, useToast } from '../components/Toast';

function Spinner() {
  return (
    <span className="inline-block h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
  );
}

export default function PainelProfessor() {
  const [professores, setProfessores] = useState<ProfessorListado[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [professorSelecionado, setProfessorSelecionado] = useState<ProfessorListado | null>(null);
  const { toasts, adicionarToast, removerToast } = useToast();

  async function carregarProfessores() {
    try {
      const res = await professorService.listar();
      setProfessores(res.data.dados ?? []);
    } catch {
      adicionarToast('Erro ao carregar professores.', 'erro');
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => { carregarProfessores(); }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <ToastContainer toasts={toasts} onRemover={removerToast} />

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Painel do Professor</h1>
        <p className="text-slate-500 mt-1 text-sm">Selecione um professor para enviar moedas a um aluno.</p>
      </div>

      {carregando ? (
        <div className="flex justify-center py-20"><Spinner /></div>
      ) : professores.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <p className="text-4xl mb-3">👨‍🏫</p>
          <p className="font-medium">Nenhum professor cadastrado ainda.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {professores.map((p) => (
            <div
              key={p.id_professor}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="font-bold text-slate-800 truncate">{p.nome_completo}</h2>
                  <p className="text-xs text-slate-400 truncate mt-0.5">{p.usuario.email_login}</p>
                  {p.departamento && (
                    <p className="text-xs text-slate-500 mt-1">🏛 {p.departamento}</p>
                  )}
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Saldo</p>
                  <p className="text-xl font-extrabold text-blue-600">
                    {Number(p.saldo_moedas).toLocaleString('pt-BR')}
                  </p>
                  <p className="text-xs text-slate-400">moedas</p>
                </div>
              </div>
              <button
                onClick={() => setProfessorSelecionado(p)}
                className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                🪙 Enviar Moedas
              </button>
            </div>
          ))}
        </div>
      )}

      {professorSelecionado && (
        <ModalEnviarMoedas
          idProfessor={professorSelecionado.id_professor}
          onFechar={() => setProfessorSelecionado(null)}
          onEnviado={carregarProfessores}
        />
      )}
    </div>
  );
}
