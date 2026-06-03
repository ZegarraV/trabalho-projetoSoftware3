// =============================================================================
// src/pages/empresa/CadastrarVantagemPage.tsx — Cadastro de Vantagens (Empresa)
// =============================================================================

import { useState, useEffect } from 'react';
import { vantagemService } from '../../services/api';
import type { Vantagem } from '../../services/api';
import api from '../../services/api';
import type { ApiResponse } from '../../services/api';

// ---------------------------------------------------------------------------
// Ícones
// ---------------------------------------------------------------------------
const IconPlus = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);
const IconTag = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
  </svg>
);
const IconImage = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
  </svg>
);
const IconCheck = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);
const IconX = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);
const IconEdit = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
  </svg>
);
const IconTrash = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>
);
const IconCoin = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

interface FormData {
  nome: string;
  descricao: string;
  foto_url: string;
  custo_moedas: string;
}

interface Toast {
  tipo: 'sucesso' | 'erro';
  mensagem: string;
}

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

export default function CadastrarVantagemPage() {
  const [form, setForm] = useState<FormData>({ nome: '', descricao: '', foto_url: '', custo_moedas: '' });
  const [vantagens, setVantagens] = useState<Vantagem[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [modoEdicao, setModoEdicao] = useState<number | null>(null);

  // Carrega vantagens da empresa ao montar
  useEffect(() => {
    carregarVantagens();
  }, []);

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  // Preview de imagem com debounce
  useEffect(() => {
    const t = setTimeout(() => setPreviewUrl(form.foto_url), 500);
    return () => clearTimeout(t);
  }, [form.foto_url]);

  async function carregarVantagens() {
    setCarregando(true);
    try {
      const res = await vantagemService.listar();
      if (res.data.sucesso && res.data.dados) {
        // Filtra apenas as vantagens da empresa autenticada (o backend já filtra pelo token)
        setVantagens(res.data.dados);
      }
    } catch {
      // silencioso
    } finally {
      setCarregando(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nome.trim() || !form.descricao.trim() || !form.custo_moedas) {
      setToast({ tipo: 'erro', mensagem: 'Preencha todos os campos obrigatórios.' });
      return;
    }
    const custo = parseFloat(form.custo_moedas);
    if (isNaN(custo) || custo <= 0) {
      setToast({ tipo: 'erro', mensagem: 'O custo deve ser um número positivo.' });
      return;
    }

    setEnviando(true);
    try {
      const payload = {
        nome: form.nome.trim(),
        descricao: form.descricao.trim(),
        foto_url: form.foto_url.trim() || undefined,
        custo_moedas: custo,
      };

      const res = await api.post<ApiResponse<Vantagem>>('/vantagens', payload);

      if (res.data.sucesso) {
        setToast({ tipo: 'sucesso', mensagem: 'Vantagem cadastrada com sucesso! 🎉' });
        setForm({ nome: '', descricao: '', foto_url: '', custo_moedas: '' });
        setPreviewUrl('');
        await carregarVantagens();
      } else {
        setToast({ tipo: 'erro', mensagem: res.data.mensagem || 'Erro ao cadastrar vantagem.' });
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { mensagem?: string } } })?.response?.data?.mensagem ?? 'Erro ao cadastrar vantagem.';
      setToast({ tipo: 'erro', mensagem: msg });
    } finally {
      setEnviando(false);
    }
  }

  function iniciarEdicao(v: Vantagem) {
    setModoEdicao(v.id_vantagem);
    setForm({
      nome: v.nome,
      descricao: v.descricao,
      foto_url: v.foto_url ?? '',
      custo_moedas: String(v.custo_moedas),
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function cancelarEdicao() {
    setModoEdicao(null);
    setForm({ nome: '', descricao: '', foto_url: '', custo_moedas: '' });
  }

  async function handleEditar(e: React.FormEvent) {
    e.preventDefault();
    if (!modoEdicao) return;
    const custo = parseFloat(form.custo_moedas);
    if (isNaN(custo) || custo <= 0) {
      setToast({ tipo: 'erro', mensagem: 'O custo deve ser um número positivo.' });
      return;
    }
    setEnviando(true);
    try {
      const payload = {
        nome: form.nome.trim(),
        descricao: form.descricao.trim(),
        foto_url: form.foto_url.trim() || undefined,
        custo_moedas: custo,
      };
      const res = await api.put<ApiResponse<Vantagem>>(`/vantagens/${modoEdicao}`, payload);
      if (res.data.sucesso) {
        setToast({ tipo: 'sucesso', mensagem: 'Vantagem atualizada com sucesso!' });
        cancelarEdicao();
        await carregarVantagens();
      } else {
        setToast({ tipo: 'erro', mensagem: res.data.mensagem || 'Erro ao atualizar.' });
      }
    } catch {
      setToast({ tipo: 'erro', mensagem: 'Erro ao atualizar vantagem.' });
    } finally {
      setEnviando(false);
    }
  }

  async function handleDesativar(id: number) {
    if (!confirm('Desativar esta vantagem? Ela não aparecerá mais na vitrine.')) return;
    try {
      await api.delete(`/vantagens/${id}`);
      setToast({ tipo: 'sucesso', mensagem: 'Vantagem desativada.' });
      await carregarVantagens();
    } catch {
      setToast({ tipo: 'erro', mensagem: 'Erro ao desativar vantagem.' });
    }
  }

  const isEdicao = modoEdicao !== null;

  return (
    <div className="max-w-5xl mx-auto space-y-8">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-xl text-sm font-medium animate-in slide-in-from-top-2 transition-all ${
          toast.tipo === 'sucesso'
            ? 'bg-emerald-500 text-white'
            : 'bg-red-500 text-white'
        }`}>
          <span className="shrink-0">
            {toast.tipo === 'sucesso' ? <IconCheck /> : <IconX />}
          </span>
          {toast.mensagem}
        </div>
      )}

      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            {isEdicao ? '✏️ Editar Vantagem' : '🎁 Cadastrar Vantagem'}
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            {isEdicao
              ? 'Atualize as informações da vantagem.'
              : 'Crie benefícios exclusivos para os alunos resgatarem com suas moedas.'}
          </p>
        </div>
        {vantagens.length > 0 && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2 text-center">
            <p className="text-2xl font-bold text-emerald-700">{vantagens.length}</p>
            <p className="text-xs text-emerald-600 font-medium">vantagens ativas</p>
          </div>
        )}
      </div>

      {/* Formulário */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-4 flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
            <IconTag />
          </div>
          <div>
            <h2 className="text-white font-semibold">
              {isEdicao ? 'Editar vantagem' : 'Nova vantagem'}
            </h2>
            <p className="text-emerald-100 text-xs">Todos os campos marcados com * são obrigatórios</p>
          </div>
        </div>

        <form onSubmit={isEdicao ? handleEditar : handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Nome */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Nome da vantagem *</label>
              <input
                name="nome"
                value={form.nome}
                onChange={handleChange}
                placeholder="Ex: Desconto na lanchonete"
                maxLength={100}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all placeholder:text-slate-300"
              />
              <p className="text-xs text-slate-400">{form.nome.length}/100 caracteres</p>
            </div>

            {/* Custo */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Custo em moedas *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <IconCoin />
                </span>
                <input
                  name="custo_moedas"
                  type="number"
                  min="1"
                  step="1"
                  value={form.custo_moedas}
                  onChange={handleChange}
                  placeholder="Ex: 150"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all placeholder:text-slate-300"
                />
              </div>
              <p className="text-xs text-slate-400">Quantas moedas o aluno precisa para resgatar</p>
            </div>
          </div>

          {/* Descrição */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Descrição *</label>
            <textarea
              name="descricao"
              value={form.descricao}
              onChange={handleChange}
              rows={3}
              maxLength={500}
              placeholder="Descreva a vantagem em detalhes — o que o aluno recebe, condições de uso, validade, etc."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all resize-none placeholder:text-slate-300"
            />
            <p className="text-xs text-slate-400">{form.descricao.length}/500 caracteres</p>
          </div>

          {/* URL da foto */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
              <IconImage />
              URL da imagem (opcional)
            </label>
            <input
              name="foto_url"
              value={form.foto_url}
              onChange={handleChange}
              placeholder="https://exemplo.com/imagem.jpg"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all placeholder:text-slate-300"
            />
            {previewUrl && (
              <div className="mt-2">
                <p className="text-xs text-slate-500 mb-2">Pré-visualização:</p>
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="h-32 w-auto rounded-xl border border-slate-200 object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              </div>
            )}
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-2">
            {isEdicao && (
              <button
                type="button"
                onClick={cancelarEdicao}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
            )}
            <button
              type="submit"
              disabled={enviando}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm shadow-emerald-200"
            >
              {enviando ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {isEdicao ? 'Atualizando...' : 'Cadastrando...'}
                </>
              ) : (
                <>
                  {isEdicao ? <IconCheck /> : <IconPlus />}
                  {isEdicao ? 'Salvar alterações' : 'Cadastrar vantagem'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Lista de vantagens cadastradas */}
      <div>
        <h2 className="text-lg font-bold text-slate-800 mb-4">Suas vantagens cadastradas</h2>

        {carregando ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <svg className="w-8 h-8 animate-spin text-emerald-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-slate-500 text-sm">Carregando vantagens...</p>
          </div>
        ) : vantagens.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center">
            <div className="text-5xl mb-4">🎁</div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">Nenhuma vantagem cadastrada</h3>
            <p className="text-slate-400 text-sm max-w-xs mx-auto">
              Use o formulário acima para criar sua primeira vantagem e disponibilizá-la para os alunos.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vantagens.map((v) => (
              <div
                key={v.id_vantagem}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {v.foto_url && (
                  <img
                    src={v.foto_url}
                    alt={v.nome}
                    className="w-full h-36 object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                )}
                {!v.foto_url && (
                  <div className="w-full h-24 bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center">
                    <span className="text-4xl">🎁</span>
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-slate-800 text-sm leading-tight">{v.nome}</h3>
                    <span className="shrink-0 inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs font-bold px-2 py-1 rounded-lg border border-emerald-100">
                      <IconCoin />
                      {Number(v.custo_moedas).toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <p className="text-slate-500 text-xs leading-relaxed mb-4 line-clamp-2">{v.descricao}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => iniciarEdicao(v)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-50 transition-colors"
                    >
                      <IconEdit />
                      Editar
                    </button>
                    <button
                      onClick={() => handleDesativar(v.id_vantagem)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-red-100 text-red-500 text-xs font-medium hover:bg-red-50 transition-colors"
                    >
                      <IconTrash />
                      Desativar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
