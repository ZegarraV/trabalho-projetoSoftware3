// =============================================================================
// src/components/Toast.tsx — Componente de Notificação (Toast)
//
// Exibe mensagens temporárias de sucesso ou erro no canto inferior direito.
// Desaparece automaticamente após `duration` milissegundos.
// =============================================================================

import { useEffect, useState } from 'react';

export type ToastType = 'sucesso' | 'erro' | 'aviso';

export interface ToastMessage {
  id: number;
  tipo: ToastType;
  mensagem: string;
}

interface ToastProps {
  toast: ToastMessage;
  onRemover: (id: number) => void;
  duration?: number;
}

// ---------------------------------------------------------------------------
// Componente individual de toast
// ---------------------------------------------------------------------------

function ToastItem({ toast, onRemover, duration = 4000 }: ToastProps) {
  const [saindo, setSaindo] = useState(false);

  useEffect(() => {
    // Inicia o timer para começar a animação de saída
    const timerSaida = setTimeout(() => setSaindo(true), duration - 400);
    // Remove o toast após o animation duration completo
    const timerRemover = setTimeout(() => onRemover(toast.id), duration);

    return () => {
      clearTimeout(timerSaida);
      clearTimeout(timerRemover);
    };
  }, [toast.id, duration, onRemover]);

  // Estilos condicionais por tipo
  const estilos: Record<ToastType, string> = {
    sucesso: 'bg-emerald-50 border-emerald-400 text-emerald-800',
    erro:    'bg-red-50    border-red-400    text-red-800',
    aviso:   'bg-amber-50  border-amber-400  text-amber-800',
  };

  const icones: Record<ToastType, string> = {
    sucesso: '✅',
    erro:    '❌',
    aviso:   '⚠️',
  };

  return (
    <div
      role="alert"
      className={`
        flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg
        max-w-sm w-full text-sm font-medium
        transition-all duration-300
        ${estilos[toast.tipo]}
        ${saindo ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}
      `}
    >
      <span className="text-base mt-0.5 shrink-0">{icones[toast.tipo]}</span>
      <p className="flex-1">{toast.mensagem}</p>
      <button
        onClick={() => onRemover(toast.id)}
        className="shrink-0 opacity-60 hover:opacity-100 transition-opacity text-lg leading-none"
        aria-label="Fechar notificação"
      >
        ×
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Container que renderiza a lista de toasts
// ---------------------------------------------------------------------------

interface ToastContainerProps {
  toasts: ToastMessage[];
  onRemover: (id: number) => void;
}

export function ToastContainer({ toasts, onRemover }: ToastContainerProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 items-end">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemover={onRemover} />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Hook para gerenciar toasts
// ---------------------------------------------------------------------------

let idContador = 0;

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const adicionarToast = (mensagem: string, tipo: ToastType = 'sucesso') => {
    idContador += 1;
    const novoToast: ToastMessage = { id: idContador, tipo, mensagem };
    setToasts((prev) => [...prev, novoToast]);
  };

  const removerToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return { toasts, adicionarToast, removerToast };
}
