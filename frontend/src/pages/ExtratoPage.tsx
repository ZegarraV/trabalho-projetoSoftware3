// =============================================================================
// src/pages/ExtratoPage.tsx — Página de Extrato
//
// Permite ao usuário escolher o tipo (Professor/Aluno) e o ID para visualizar
// o extrato completo via ExtratoUsuario.
// =============================================================================

import { useState, type FormEvent } from 'react';
import ExtratoUsuario from '../components/ExtratoUsuario';

type Modo = 'professor' | 'aluno';

export default function ExtratoPage() {
  const [modo, setModo] = useState<Modo>('aluno');
  const [idInput, setIdInput] = useState('');
  const [idAtivo, setIdAtivo] = useState<number | null>(null);

  function handleBuscar(e: FormEvent) {
    e.preventDefault();
    const n = Number(idInput);
    if (!idInput || isNaN(n) || n <= 0) return;
    setIdAtivo(n);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Extrato de Movimentações</h1>
        <p className="text-slate-500 mt-1 text-sm">Consulte o histórico de transações de qualquer usuário.</p>
      </div>

      {/* Formulário de seleção */}
      <form onSubmit={handleBuscar} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Toggle tipo */}
          <div className="flex gap-1 p-1 bg-slate-100 rounded-xl self-start">
            {(['aluno', 'professor'] as Modo[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => { setModo(m); setIdAtivo(null); }}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize ${
                  modo === m ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {m === 'aluno' ? '🎓 Aluno' : '👨‍🏫 Professor'}
              </button>
            ))}
          </div>

          {/* Input de ID */}
          <div className="flex gap-2 flex-1">
            <input
              type="number"
              min={1}
              value={idInput}
              onChange={(e) => setIdInput(e.target.value)}
              placeholder={`ID do ${modo} (ex.: 1)`}
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              Buscar
            </button>
          </div>
        </div>
      </form>

      {/* Extrato */}
      {idAtivo !== null && (
        <ExtratoUsuario key={`${modo}-${idAtivo}`} modo={modo} id={idAtivo} />
      )}

      {idAtivo === null && (
        <div className="text-center py-16 text-slate-400">
          <p className="text-5xl mb-4">📊</p>
          <p className="font-medium">Informe o tipo e o ID para consultar o extrato.</p>
        </div>
      )}
    </div>
  );
}
