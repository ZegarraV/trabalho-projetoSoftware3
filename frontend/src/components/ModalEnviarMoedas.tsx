// =============================================================================
// src/components/ModalEnviarMoedas.tsx — Unicred
// =============================================================================

import { useState, useEffect, type FormEvent } from 'react';
import axios from 'axios';
import { alunoService, transacaoService, professorService, type AlunoListado } from '../services/api';
import { ToastContainer, useToast } from './Toast';

function Spinner() {
  return <span className="inline-block h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />;
}

interface ModalEnviarMoedasProps {
  idProfessor: number;
  idAlunoPreSelecionado?: number;
  onFechar: () => void;
  onEnviado?: () => void;
}

export default function ModalEnviarMoedas({ idProfessor, idAlunoPreSelecionado, onFechar, onEnviado }: ModalEnviarMoedasProps) {
  const [alunos, setAlunos]               = useState<AlunoListado[]>([]);
  const [carregandoAlunos, setCarregandoAlunos] = useState(true);
  const [saldoProfessor, setSaldoProfessor]     = useState<string | null>(null);

  const [idAluno, setIdAluno]     = useState(idAlunoPreSelecionado ? String(idAlunoPreSelecionado) : '');
  const [quantidade, setQuantidade] = useState('');
  const [motivo, setMotivo]         = useState('');
  const [enviando, setEnviando]     = useState(false);

  const { toasts, adicionarToast, removerToast } = useToast();

  useEffect(() => {
    async function carregar() {
      try {
        const [resAlunos, resProfessor] = await Promise.all([
          alunoService.listar(),
          professorService.buscarPorId(idProfessor),
        ]);
        setAlunos(resAlunos.data.dados ?? []);
        setSaldoProfessor(String(resProfessor.data.dados?.saldo_moedas ?? '?'));
      } catch {
        adicionarToast('Erro ao carregar dados.', 'erro');
      } finally {
        setCarregandoAlunos(false);
      }
    }
    carregar();
  }, [idProfessor]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!idAluno)               { adicionarToast('Selecione um aluno.', 'aviso'); return; }
    const qtd = Number(quantidade);
    if (!quantidade || isNaN(qtd) || qtd <= 0) { adicionarToast('Informe uma quantidade válida (> 0).', 'aviso'); return; }
    if (!motivo.trim())         { adicionarToast('O motivo é obrigatório.', 'aviso'); return; }

    // Verificação de saldo no lado do cliente
    if (saldoProfessor !== null && qtd > Number(saldoProfessor)) {
      adicionarToast(`Saldo insuficiente. Você possui ${saldoProfessor} créditos.`, 'erro');
      return;
    }

    setEnviando(true);
    try {
      await transacaoService.enviarMoedas({ idProfessor, idAluno: Number(idAluno), quantidade: qtd, motivo: motivo.trim() });
      adicionarToast('Créditos enviados! O aluno será notificado por e-mail.', 'sucesso');
      setIdAluno('');
      setQuantidade('');
      setMotivo('');
      onEnviado?.();
      setTimeout(onFechar, 1500);
    } catch (err: unknown) {
      const mensagem = axios.isAxiosError(err)
        ? (err.response?.data?.mensagem ?? 'Erro ao enviar créditos.')
        : 'Erro ao enviar créditos.';
      adicionarToast(mensagem, 'erro');
    } finally {
      setEnviando(false);
    }
  }

  const alunoAtual = alunos.find((a) => String(a.id_aluno) === idAluno);

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={(e) => { if (e.target === e.currentTarget) onFechar(); }}
      >
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🪙</span>
              <div>
                <h2 className="text-white font-bold text-lg leading-tight">Enviar Créditos</h2>
                {saldoProfessor !== null && (
                  <p className="text-blue-200 text-xs mt-0.5">
                    Saldo: <span className="font-semibold text-white">{saldoProfessor} créditos</span>
                  </p>
                )}
              </div>
            </div>
            <button onClick={onFechar} className="text-blue-200 hover:text-white p-1 rounded-lg hover:bg-blue-500 transition-colors">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Select de Aluno */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Aluno destinatário</label>
              {carregandoAlunos ? (
                <div className="flex items-center gap-2 text-slate-500 text-sm py-2"><Spinner /> Carregando...</div>
              ) : (
                <select
                  value={idAluno}
                  onChange={(e) => setIdAluno(e.target.value)}
                  disabled={enviando}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione um aluno...</option>
                  {alunos.map((a) => (
                    <option key={a.id_aluno} value={a.id_aluno}>
                      {a.nome_completo} — {Number(a.saldo_moedas).toFixed(0)} créditos
                    </option>
                  ))}
                </select>
              )}
              {alunoAtual && (
                <p className="text-xs text-slate-400 mt-1.5">
                  ✉️ {alunoAtual.usuario.email_login} · Saldo atual: <span className="font-semibold text-slate-600">{Number(alunoAtual.saldo_moedas).toFixed(0)} créditos</span>
                </p>
              )}
            </div>

            {/* Quantidade */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Quantidade de créditos</label>
              <input
                type="number"
                min={1}
                step={1}
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
                placeholder="Ex.: 50"
                disabled={enviando}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {saldoProfessor !== null && quantidade && Number(quantidade) > Number(saldoProfessor) && (
                <p className="text-xs text-red-500 mt-1">⚠️ Valor maior que seu saldo disponível ({saldoProfessor} créditos)</p>
              )}
            </div>

            {/* Motivo */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Motivo do reconhecimento <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Descreva o motivo do reconhecimento de mérito..."
                disabled={enviando}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-800 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-slate-400 mt-1">{motivo.length}/200 caracteres · Seja específico para motivar o aluno.</p>
            </div>

            {/* Botões */}
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={onFechar}
                disabled={enviando}
                className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={enviando || carregandoAlunos}
                className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
              >
                {enviando ? <><Spinner /> Enviando...</> : '🪙 Enviar Créditos'}
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer toasts={toasts} onRemover={removerToast} />
    </>
  );
}
