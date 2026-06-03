// =============================================================================
// src/pages/aluno/VitrineVantagens.tsx — Vitrine de Vantagens — Unicred
//
// Vitrine 100% frontend: dados locais, resgate gera cupom fictício no cliente.
// Sem dependência de seed, empresa cadastrada ou chamada de API.
// =============================================================================

import { useEffect, useMemo, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

type VantagemItem = {
  id: number;
  titulo: string;
  empresa: string;
  descricao: string;
  custo_moedas: number;
  foto_url: string;
};

type EtapaModal = 'confirmacao' | 'sucesso';

// ---------------------------------------------------------------------------
// Catálogo de vantagens pré-cadastradas
// ---------------------------------------------------------------------------

const VANTAGENS: VantagemItem[] = [
  {
    id: 1,
    titulo: 'Combo Universitário Premium',
    empresa: 'Lanchonete Campus Mix',
    descricao: '1 sanduíche artesanal + 1 suco natural com 30% de desconto no horário do almoço.',
    custo_moedas: 120,
    foto_url: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 2,
    titulo: 'Curso Express de Excel',
    empresa: 'Academia de Carreiras Next',
    descricao: 'Acesso a um módulo completo de Excel para análise de dados e dashboards.',
    custo_moedas: 260,
    foto_url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 3,
    titulo: 'Desconto em Livros Técnicos',
    empresa: 'Livraria Ponto Saber',
    descricao: 'Cupom de 40% para compra de livros de programação, design e negócios.',
    custo_moedas: 180,
    foto_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 4,
    titulo: 'Ingresso de Cinema 2D',
    empresa: 'Cine Plaza',
    descricao: 'Válido para qualquer sessão 2D de segunda a quinta, exceto pré-estreias.',
    custo_moedas: 140,
    foto_url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 5,
    titulo: 'Passe Livre na Academia',
    empresa: 'GymHub Performance',
    descricao: '7 dias de acesso total à musculação, cardio e aulas coletivas.',
    custo_moedas: 210,
    foto_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 6,
    titulo: 'Mentoria de Portfólio',
    empresa: 'Studio Criativo Lab',
    descricao: 'Sessão individual de 45 minutos para revisar currículo e portfólio.',
    custo_moedas: 300,
    foto_url: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 7,
    titulo: 'Kit Material Acadêmico',
    empresa: 'Papelaria Caderno Azul',
    descricao: '1 caderno, 1 bloco A4 e canetas com 50% de desconto no checkout.',
    custo_moedas: 90,
    foto_url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 8,
    titulo: 'Aula Experimental de Inglês',
    empresa: 'Fluent Hub School',
    descricao: 'Aula avaliativa com professor nativo e trilha de estudos personalizada.',
    custo_moedas: 160,
    foto_url: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1000&q=80',
  },
];

// ---------------------------------------------------------------------------
// Gera cupom alfanumérico fictício — ex.: PUC-AB3CD
// ---------------------------------------------------------------------------

function gerarCupom(): string {
  const letras = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const numeros = '23456789';
  const rnd = (src: string, n: number) =>
    Array.from({ length: n }, () => src[Math.floor(Math.random() * src.length)]).join('');
  return `UNI-${rnd(letras, 2)}${rnd(numeros, 1)}${rnd(letras, 2)}`;
}

// ---------------------------------------------------------------------------
// Spinner
// ---------------------------------------------------------------------------

function Spinner() {
  return (
    <span className="inline-block h-5 w-5 border-2 border-white/90 border-t-transparent rounded-full animate-spin" />
  );
}

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

export default function VitrineVantagens() {
  const [vantagens, setVantagens]         = useState<VantagemItem[]>([]);
  const [carregandoLista, setCarregandoLista] = useState(true);

  const [modalAberto, setModalAberto]           = useState(false);
  const [vantagemSelecionada, setVantagemSelecionada] = useState<VantagemItem | null>(null);
  const [etapaModal, setEtapaModal]             = useState<EtapaModal>('confirmacao');
  const [isResgatando, setIsResgatando]         = useState(false);
  const [codigoCupom, setCodigoCupom]           = useState('');

  // Simula carregamento inicial (igual ao projeto de referência)
  useEffect(() => {
    const t = window.setTimeout(() => {
      setVantagens(VANTAGENS);
      setCarregandoLista(false);
    }, 700);
    return () => window.clearTimeout(t);
  }, []);

  // ── Modal ─────────────────────────────────────────────────────────────────

  const tituloModal = useMemo(() => {
    if (isResgatando) return 'Processando seu resgate';
    if (etapaModal === 'sucesso') return 'Resgate concluído!';
    return 'Confirmar resgate';
  }, [etapaModal, isResgatando]);

  function abrirModal(vantagem: VantagemItem) {
    setVantagemSelecionada(vantagem);
    setEtapaModal('confirmacao');
    setIsResgatando(false);
    setCodigoCupom('');
    setModalAberto(true);
  }

  function fecharModal() {
    if (isResgatando) return;
    setModalAberto(false);
    setVantagemSelecionada(null);
    setEtapaModal('confirmacao');
    setCodigoCupom('');
  }

  function confirmarResgate() {
    if (!vantagemSelecionada || isResgatando) return;
    setIsResgatando(true);
    window.setTimeout(() => {
      setCodigoCupom(gerarCupom());
      setIsResgatando(false);
      setEtapaModal('sucesso');
    }, 1500);
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <section className="mx-auto max-w-7xl">

      {/* Cabeçalho */}
      <header className="mb-8 rounded-3xl border border-violet-100 bg-gradient-to-r from-violet-50 via-white to-indigo-50 p-6 sm:p-8 shadow-sm">
        <p className="mb-2 text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] text-violet-700">
          Unicred
        </p>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-800 leading-tight">
          Vitrine de Vantagens
        </h1>
        <p className="mt-3 max-w-2xl text-slate-600 text-sm sm:text-base leading-relaxed">
          Explore benefícios exclusivos e descontos criados para alunos. Resgate usando seus créditos Unicred.
        </p>
      </header>

      {/* Grade */}
      {carregandoLista ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="rounded-xl bg-white shadow-md overflow-hidden animate-pulse">
              <div className="h-44 bg-slate-200" />
              <div className="p-4 space-y-3">
                <div className="h-3 w-1/2 bg-slate-200 rounded" />
                <div className="h-5 w-3/4 bg-slate-200 rounded" />
                <div className="h-3 w-full bg-slate-200 rounded" />
                <div className="h-3 w-5/6 bg-slate-200 rounded" />
                <div className="h-10 bg-slate-200 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {vantagens.map((v) => (
            <article
              key={v.id}
              className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={v.foto_url}
                  alt={v.titulo}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/55 to-transparent" />
              </div>

              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{v.empresa}</p>
                <h3 className="mt-2 text-lg font-extrabold text-slate-800 leading-snug min-h-[3.5rem]">
                  {v.titulo}
                </h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed min-h-[3.75rem]">{v.descricao}</p>

                <div className="mt-4 flex items-center justify-between">
                  <div className="rounded-full bg-amber-100 px-3 py-1.5">
                    <span className="text-amber-700 text-sm font-black">{v.custo_moedas} moedas</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => abrirModal(v)}
                    className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-amber-500 hover:text-slate-900"
                  >
                    Resgatar
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalAberto && vantagemSelecionada && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 sm:p-7 shadow-2xl border border-slate-100">
            <h2 className="text-2xl font-black text-slate-800">{tituloModal}</h2>

            {/* Etapa confirmação */}
            {etapaModal === 'confirmacao' && (
              <>
                <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-wide font-semibold text-slate-500">Vantagem selecionada</p>
                  <h3 className="mt-2 text-lg font-extrabold text-slate-800">{vantagemSelecionada.titulo}</h3>
                  <p className="mt-1 text-sm text-slate-600">{vantagemSelecionada.empresa}</p>
                  <p className="mt-3 text-sm text-slate-700 leading-relaxed">{vantagemSelecionada.descricao}</p>
                  <div className="mt-4 inline-flex rounded-full bg-amber-100 px-3 py-1.5">
                    <span className="text-sm font-black text-amber-700">
                      Custo: {vantagemSelecionada.custo_moedas} moedas
                    </span>
                  </div>
                </div>

                <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3">
                  <p className="text-sm font-medium text-amber-800">
                    Ao confirmar, o valor será descontado do seu saldo de moedas.
                  </p>
                </div>

                <div className="mt-6 flex flex-col-reverse sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={fecharModal}
                    disabled={isResgatando}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 font-semibold text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={confirmarResgate}
                    disabled={isResgatando}
                    className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 font-bold text-white hover:bg-emerald-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                  >
                    {isResgatando ? <><Spinner /> Resgatando...</> : 'Confirmar Resgate'}
                  </button>
                </div>
              </>
            )}

            {/* Etapa sucesso + QR Code */}
            {etapaModal === 'sucesso' && (
              <div className="mt-6">
                <div className="rounded-2xl border border-emerald-200 bg-gradient-to-b from-emerald-50 via-white to-emerald-50 p-6 text-center shadow-inner">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl">
                    ✓
                  </div>
                  <h3 className="mt-3 text-2xl font-black text-emerald-700">Resgate Concluído!</h3>

                  <div className="mt-5 flex justify-center">
                    <div className="rounded-2xl border border-emerald-200 bg-white p-4 shadow-sm">
                      <QRCodeCanvas
                        value={codigoCupom}
                        size={150}
                        bgColor="#ffffff"
                        fgColor="#0f172a"
                        includeMargin
                      />
                    </div>
                  </div>

                  <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
                    Código do Cupom
                  </p>
                  <p className="mt-2 text-3xl sm:text-4xl font-black tracking-[0.16em] text-emerald-700">
                    {codigoCupom}
                  </p>
                  <p className="mt-3 text-sm text-emerald-800">
                    Apresente este código ou o QR Code na empresa parceira para validar seu resgate.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={fecharModal}
                  className="mt-6 w-full rounded-lg bg-slate-900 px-4 py-2.5 font-bold text-white transition-colors hover:bg-slate-700"
                >
                  Concluir
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
