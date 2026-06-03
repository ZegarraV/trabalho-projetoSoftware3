// =============================================================================
// src/pages/empresa/ValidarCuponsPage.tsx — Validação de Cupons — Unicred
//
// Validação 100% frontend: aceita qualquer código no formato UNI-XXXXX
// e registra a confirmação localmente (sessionStorage), sem API.
// =============================================================================

import { useState, useRef, type FormEvent } from 'react';
import { ToastContainer, useToast } from '../../components/Toast';

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

type StatusCupom = 'PENDENTE' | 'CONCLUIDO';

type RegistroCupom = {
  codigo: string;
  vantagem: string;
  validadoEm: string;
  status: StatusCupom;
};

// ---------------------------------------------------------------------------
// Persistência local na sessão
// ---------------------------------------------------------------------------

const STORAGE_KEY = 'unicred_cupons_validados';

function lerValidados(): RegistroCupom[] {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? '[]');
  } catch {
    return [];
  }
}

function salvarValidados(lista: RegistroCupom[]) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
}

// Valida formato UNI-XXXXX (3 letras + 1 número + 2 letras) ou qualquer
// sequência alfanumérica de 5–12 caracteres após prefixo opcional
const REGEX_CUPOM = /^[A-Z0-9]{3,}-?[A-Z0-9]{4,}$/i;

// ---------------------------------------------------------------------------
// Spinner
// ---------------------------------------------------------------------------

function Spinner() {
  return (
    <span className="inline-block h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
  );
}

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------

export default function ValidarCuponsPage() {
  const [codigo, setCodigo]         = useState('');
  const [validando, setValidando]   = useState(false);
  const [historico, setHistorico]   = useState<RegistroCupom[]>(lerValidados);
  const inputRef = useRef<HTMLInputElement>(null);

  const { toasts, adicionarToast, removerToast } = useToast();

  // Nomes fictícios para enriquecer o histórico
  const VANTAGENS_LABEL = [
    'Combo Universitário Premium',
    'Curso Express de Excel',
    'Desconto em Livros Técnicos',
    'Ingresso de Cinema 2D',
    'Passe Livre na Academia',
    'Mentoria de Portfólio',
    'Kit Material Acadêmico',
    'Aula Experimental de Inglês',
  ];

  function nomeFicticioParaCodigo(cod: string): string {
    // Determina vantagem de forma determinística pelo código
    let soma = 0;
    for (const c of cod) soma += c.charCodeAt(0);
    return VANTAGENS_LABEL[soma % VANTAGENS_LABEL.length];
  }

  async function handleValidar(e: FormEvent) {
    e.preventDefault();
    const cupom = codigo.trim().toUpperCase();

    if (!cupom) {
      adicionarToast('Digite um código de cupom.', 'aviso');
      return;
    }

    if (!REGEX_CUPOM.test(cupom)) {
      adicionarToast('Formato de cupom inválido. Ex.: UNI-AB3CD', 'aviso');
      return;
    }

    // Verifica se já foi validado
    const jaValidado = historico.find((r) => r.codigo === cupom);
    if (jaValidado) {
      adicionarToast(`Cupom ${cupom} já foi validado anteriormente.`, 'aviso');
      return;
    }

    setValidando(true);

    // Simula latência de processamento
    await new Promise((r) => setTimeout(r, 1200));

    const novo: RegistroCupom = {
      codigo: cupom,
      vantagem: nomeFicticioParaCodigo(cupom),
      validadoEm: new Date().toISOString(),
      status: 'CONCLUIDO',
    };

    const atualizado = [novo, ...historico];
    setHistorico(atualizado);
    salvarValidados(atualizado);

    setCodigo('');
    setValidando(false);
    adicionarToast(`Cupom ${cupom} validado com sucesso!`, 'sucesso');
    inputRef.current?.focus();
  }

  const pendentes  = 0; // no modelo frontend não há pendentes reais
  const concluidos = historico.length;

  return (
    <>
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Validar Cupons</h1>
          <p className="text-slate-500 mt-1">
            Confirme os resgates dos alunos digitando o código do cupom apresentado.
          </p>
        </div>

        {/* Cards de resumo */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total validados</p>
            <p className="text-3xl font-bold text-slate-800 mt-1">{concluidos}</p>
          </div>
          <div className="bg-amber-50 rounded-2xl border border-amber-200 p-4">
            <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide">Pendentes</p>
            <p className="text-3xl font-bold text-amber-700 mt-1">{pendentes}</p>
          </div>
          <div className="bg-green-50 rounded-2xl border border-green-200 p-4 col-span-2 sm:col-span-1">
            <p className="text-xs font-semibold text-green-600 uppercase tracking-wide">Concluídos</p>
            <p className="text-3xl font-bold text-green-700 mt-1">{concluidos}</p>
          </div>
        </div>

        {/* Painel de validação */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <span>🔍</span> Validação por Código
          </h2>

          <form onSubmit={handleValidar} className="flex flex-col sm:flex-row gap-3">
            <input
              ref={inputRef}
              type="text"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value.toUpperCase())}
              placeholder="Ex.: UNI-AB3CD"
              maxLength={15}
              disabled={validando}
              className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-mono tracking-widest uppercase focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-slate-50"
            />
            <button
              type="submit"
              disabled={validando}
              className="rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60 inline-flex items-center gap-2 whitespace-nowrap transition-colors"
            >
              {validando ? <><Spinner /> Validando...</> : '✅ Confirmar Entrega'}
            </button>
          </form>

          <p className="mt-3 text-xs text-slate-400">
            Digite o código exibido no cupom do aluno (ex.: <span className="font-mono">UNI-AB3CD</span>) e clique em Confirmar Entrega.
          </p>
        </div>

        {/* Histórico desta sessão */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="p-5 border-b border-slate-100">
            <h2 className="text-base font-semibold text-slate-800">Histórico de Validações</h2>
            <p className="text-xs text-slate-400 mt-0.5">Cupons validados nesta sessão</p>
          </div>

          {historico.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">🎟️</p>
              <p className="text-slate-500 font-medium">Nenhuma validação ainda.</p>
              <p className="text-slate-400 text-sm mt-1">
                Os cupons confirmados aparecerão aqui.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {historico.map((r) => (
                <div
                  key={r.codigo}
                  className="flex flex-wrap items-center justify-between gap-3 p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-green-100 flex items-center justify-center text-lg shrink-0">
                      ✅
                    </div>
                    <div>
                      <p className="font-mono font-bold text-slate-800 tracking-wider text-sm">{r.codigo}</p>
                      <p className="text-sm text-slate-600">{r.vantagem}</p>
                      <p className="text-xs text-slate-400">
                        {new Date(r.validadoEm).toLocaleString('pt-BR', {
                          day: '2-digit', month: 'short', year: 'numeric',
                          hour: '2-digit', minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
                    Concluído
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      <ToastContainer toasts={toasts} onRemover={removerToast} />
    </>
  );
}
