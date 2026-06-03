// =============================================================================
// src/components/ExtratoUsuario.tsx — Extrato de Movimentações
//
// Exibe o saldo atual em destaque e a lista de movimentações do usuário
// (Professor ou Aluno). Entradas em verde, saídas em vermelho/cinza.
// =============================================================================

import { useState, useEffect } from 'react';
import axios from 'axios';
import { extratoService } from '../services/api';
import type { ExtratoProfessor, ExtratoAluno } from '../services/api';

// ---------------------------------------------------------------------------
// Tipos de movimentação unificados para a tabela
// ---------------------------------------------------------------------------
interface MovimentacaoRow {
  id: number;
  tipo: 'ENTRADA' | 'SAIDA';
  quantidade: string | number;
  descricao: string;
  complemento?: string;
  data: string;
}

type ModoExtrato = 'professor' | 'aluno';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function Spinner() {
  return (
    <span className="inline-block h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
  );
}

function formatarData(isoString: string) {
  return new Date(isoString).toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function badgeTipo(tipo: 'ENTRADA' | 'SAIDA') {
  return tipo === 'ENTRADA' ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
      <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v10.586l3.293-3.293a1 1 0 111.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 111.414-1.414L9 14.586V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
      Entrada
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-600">
      <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 17a1 1 0 01-1-1V5.414L5.707 8.707a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0l5 5a1 1 0 01-1.414 1.414L11 5.414V16a1 1 0 01-1 1z" clipRule="evenodd" /></svg>
      Saída
    </span>
  );
}

// ---------------------------------------------------------------------------
// Card de Saldo
// ---------------------------------------------------------------------------
interface CardSaldoProps {
  nome: string;
  email: string;
  saldo: string | number;
  modo: ModoExtrato;
}

function CardSaldo({ nome, email, saldo, modo }: CardSaldoProps) {
  const gradiente = modo === 'professor'
    ? 'from-blue-600 to-blue-800'
    : 'from-violet-600 to-violet-800';

  return (
    <div className={`rounded-2xl bg-gradient-to-br ${gradiente} p-6 text-white shadow-lg`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-white/70 uppercase tracking-widest mb-1">
            {modo === 'professor' ? 'Professor' : 'Aluno'}
          </p>
          <h2 className="text-xl font-bold leading-tight">{nome}</h2>
          <p className="text-sm text-white/60 mt-0.5">{email}</p>
        </div>
        <span className="text-4xl">{modo === 'professor' ? '👨‍🏫' : '🎓'}</span>
      </div>
      <div className="mt-6 pt-5 border-t border-white/20">
        <p className="text-xs font-medium text-white/60 uppercase tracking-widest mb-1">Saldo Atual</p>
        <p className="text-4xl font-extrabold tracking-tight">
          {Number(saldo).toLocaleString('pt-BR')}
          <span className="text-lg font-medium text-white/70 ml-2">moedas</span>
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tabela de movimentações
// ---------------------------------------------------------------------------
function TabelaMovimentacoes({ linhas }: { linhas: MovimentacaoRow[] }) {
  if (linhas.length === 0) {
    return (
      <div className="text-center py-16 text-slate-400">
        <p className="text-4xl mb-3">📭</p>
        <p className="font-medium">Nenhuma movimentação registrada ainda.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 text-left">
            <th className="px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wider">Tipo</th>
            <th className="px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wider">Descrição</th>
            <th className="px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wider text-right">Moedas</th>
            <th className="px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wider">Data</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {linhas.map((l) => (
            <tr key={`${l.tipo}-${l.id}`} className="hover:bg-slate-50 transition-colors">
              <td className="px-4 py-3">{badgeTipo(l.tipo)}</td>
              <td className="px-4 py-3">
                <p className="font-medium text-slate-800">{l.descricao}</p>
                {l.complemento && (
                  <p className="text-xs text-slate-400 mt-0.5 truncate max-w-xs">{l.complemento}</p>
                )}
              </td>
              <td className={`px-4 py-3 text-right font-bold tabular-nums ${
                l.tipo === 'ENTRADA' ? 'text-emerald-600' : 'text-red-500'
              }`}>
                {l.tipo === 'ENTRADA' ? '+' : '-'}{Number(l.quantidade).toLocaleString('pt-BR')}
              </td>
              <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{formatarData(l.data)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------
interface ExtratoUsuarioProps {
  modo: ModoExtrato;
  id: number;
}

export default function ExtratoUsuario({ modo, id }: ExtratoUsuarioProps) {
  const [dados, setDados] = useState<ExtratoProfessor | ExtratoAluno | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [aba, setAba] = useState<'todos' | 'entradas' | 'saidas'>('todos');

  useEffect(() => {
    async function carregar() {
      setCarregando(true);
      setErro(null);
      try {
        const res = modo === 'professor'
          ? await extratoService.professor(id)
          : await extratoService.aluno(id);
        setDados(res.data.dados ?? null);
      } catch (err: unknown) {
        const mensagem = axios.isAxiosError(err)
          ? (err.response?.data?.mensagem ?? 'Erro ao carregar extrato.')
          : 'Erro ao carregar extrato.';
        setErro(mensagem);
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, [modo, id]);

  // Normaliza as linhas de movimentação para o formato unificado
  function getLinhas(): MovimentacaoRow[] {
    if (!dados) return [];

    if (modo === 'professor') {
      const d = dados as ExtratoProfessor;
      const entradas: MovimentacaoRow[] = d.recebimentos.map((r) => ({
        id: r.id,
        tipo: 'ENTRADA',
        quantidade: r.quantidade,
        descricao: `Distribuição semestral — ${r.semestre}`,
        data: r.data,
      }));
      const saidas: MovimentacaoRow[] = d.envios.map((e) => ({
        id: e.id,
        tipo: 'SAIDA',
        quantidade: e.quantidade,
        descricao: `Enviado para ${e.destinatario}`,
        complemento: e.motivo,
        data: e.data,
      }));
      return [...entradas, ...saidas].sort(
        (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
      );
    }

    const d = dados as ExtratoAluno;
    const entradas: MovimentacaoRow[] = d.recebimentos.map((r) => ({
      id: r.id,
      tipo: 'ENTRADA',
      quantidade: r.quantidade,
      descricao: `Recebido de ${r.remetente}`,
      complemento: r.motivo,
      data: r.data,
    }));
    const saidas: MovimentacaoRow[] = d.resgates.map((r) => ({
      id: r.id,
      tipo: 'SAIDA',
      quantidade: r.quantidade,
      descricao: `Resgate em ${r.empresa}`,
      complemento: `${r.descricao} · ${r.status}`,
      data: r.data,
    }));
    return [...entradas, ...saidas].sort(
      (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
    );
  }

  const todasLinhas = getLinhas();
  const linhasFiltradas =
    aba === 'entradas' ? todasLinhas.filter((l) => l.tipo === 'ENTRADA') :
    aba === 'saidas'   ? todasLinhas.filter((l) => l.tipo === 'SAIDA')   :
    todasLinhas;

  const totalEntradas = todasLinhas.filter((l) => l.tipo === 'ENTRADA').reduce((s, l) => s + Number(l.quantidade), 0);
  const totalSaidas   = todasLinhas.filter((l) => l.tipo === 'SAIDA').reduce((s, l) => s + Number(l.quantidade), 0);

  if (carregando) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-slate-500">
        <Spinner />
        <p className="text-sm">Carregando extrato...</p>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="rounded-xl bg-red-50 border border-red-200 p-6 text-center text-red-700">
        <p className="text-3xl mb-2">⚠️</p>
        <p className="font-semibold">{erro}</p>
      </div>
    );
  }

  if (!dados) return null;

  const info = modo === 'professor'
    ? (dados as ExtratoProfessor).professor
    : (dados as ExtratoAluno).aluno;

  return (
    <div className="space-y-6">
      {/* Card de Saldo */}
      <CardSaldo
        nome={info.nome_completo}
        email={info.email_login}
        saldo={info.saldo_moedas}
        modo={modo}
      />

      {/* Cards de resumo */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">Total Entradas</p>
          <p className="text-2xl font-bold text-emerald-700">+{totalEntradas.toLocaleString('pt-BR')}</p>
        </div>
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-xs font-semibold text-red-500 uppercase tracking-wider mb-1">Total Saídas</p>
          <p className="text-2xl font-bold text-red-600">−{totalSaidas.toLocaleString('pt-BR')}</p>
        </div>
      </div>

      {/* Abas de filtro */}
      <div>
        <div className="flex gap-1 p-1 bg-slate-100 rounded-xl w-fit mb-4">
          {(['todos', 'entradas', 'saidas'] as const).map((a) => (
            <button
              key={a}
              onClick={() => setAba(a)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                aba === a
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {a === 'todos' ? 'Todos' : a === 'entradas' ? '↓ Entradas' : '↑ Saídas'}
            </button>
          ))}
        </div>

        <TabelaMovimentacoes linhas={linhasFiltradas} />
      </div>
    </div>
  );
}
