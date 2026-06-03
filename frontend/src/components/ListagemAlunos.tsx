// =============================================================================
// src/components/ListagemAlunos.tsx — Tabela de Alunos com CRUD completo
//
// Funcionalidades:
//   - Listagem de alunos ativos com carregamento (spinner)
//   - Modal de edição inline com validação client-side
//   - Botão "Desativar" com confirmação (exclusão lógica)
//   - Toasts de sucesso e erro em todas as ações
//   - Estado de loading nos botões durante requisições
// =============================================================================

import { useState, useEffect, type FormEvent } from 'react';
import axios from 'axios';
import { alunoService, type AlunoListado, type CadastrarAlunoPayload } from '../services/api';
import { ToastContainer, useToast } from './Toast';

// ---------------------------------------------------------------------------
// Tipo do formulário de edição
// ---------------------------------------------------------------------------
type FormEdicao = {
  nome_completo: string;
  email_login: string;
  senha: string; // Deixar vazio para não alterar a senha
};

// ---------------------------------------------------------------------------
// Spinner de carregamento
// ---------------------------------------------------------------------------
function Spinner({ tamanho = 'md' }: { tamanho?: 'sm' | 'md' }) {
  const size = tamanho === 'sm' ? 'h-4 w-4 border-2' : 'h-8 w-8 border-4';
  return (
    <span
      className={`inline-block ${size} border-current border-t-transparent rounded-full animate-spin`}
      role="status"
      aria-label="Carregando"
    />
  );
}

// ---------------------------------------------------------------------------
// Badge de status ativo/inativo
// ---------------------------------------------------------------------------
function BadgeStatus({ ativo }: { ativo: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
        ativo ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${ativo ? 'bg-emerald-500' : 'bg-red-400'}`} />
      {ativo ? 'Ativo' : 'Inativo'}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Modal de edição
// ---------------------------------------------------------------------------
interface ModalEdicaoProps {
  aluno: AlunoListado;
  onFechar: () => void;
  onSalvo: () => void;
}

function ModalEdicao({ aluno, onFechar, onSalvo }: ModalEdicaoProps) {
  const [form, setForm] = useState<FormEdicao>({
    nome_completo: aluno.nome_completo,
    email_login:   aluno.usuario.email_login,
    senha:         '',
  });
  const [erros, setErros] = useState<Partial<FormEdicao>>({});
  const [salvando, setSalvando] = useState(false);
  const { toasts, adicionarToast, removerToast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (erros[name as keyof FormEdicao]) {
      setErros((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Validação client-side do formulário de edição
  const validar = (): boolean => {
    const novosErros: Partial<FormEdicao> = {};

    if (!form.nome_completo.trim()) {
      novosErros.nome_completo = 'Nome completo é obrigatório.';
    }
    if (!form.email_login.trim()) {
      novosErros.email_login = 'E-mail é obrigatório.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email_login)) {
      novosErros.email_login = 'Formato de e-mail inválido.';
    }
    if (form.senha && form.senha.length < 6) {
      novosErros.senha = 'Se informada, a senha deve ter no mínimo 6 caracteres.';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validar()) return;

    setSalvando(true);
    try {
      // Monta payload apenas com campos preenchidos
      const payload: Partial<CadastrarAlunoPayload> = {
        nome_completo: form.nome_completo,
        email_login:   form.email_login,
      };
      // Senha só vai no payload se o usuário preencheu o campo
      if (form.senha) payload.senha = form.senha;

      await alunoService.atualizar(aluno.id_aluno, payload);
      onSalvo(); // Recarrega a lista e fecha o modal
    } catch (err: unknown) {
      const mensagem = axios.isAxiosError(err)
        ? (err.response?.data?.mensagem ?? 'Erro ao salvar alterações.')
        : 'Erro inesperado.';
      adicionarToast(mensagem, 'erro');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={onFechar}
        aria-hidden="true"
      />

      {/* Painel do modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Editar aluno"
        className="fixed inset-0 z-50 flex items-center justify-center px-4"
      >
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-slate-900">✏️ Editar Aluno</h2>
            <button
              onClick={onFechar}
              className="text-slate-400 hover:text-slate-700 text-2xl leading-none transition-colors"
              aria-label="Fechar modal"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Nome */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Nome Completo <span className="text-red-500">*</span>
              </label>
              <input
                name="nome_completo"
                value={form.nome_completo}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  erros.nome_completo ? 'border-red-500 bg-red-50' : 'border-slate-300'
                }`}
              />
              {erros.nome_completo && (
                <p className="mt-1 text-xs text-red-500">{erros.nome_completo}</p>
              )}
            </div>

            {/* E-mail */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                E-mail <span className="text-red-500">*</span>
              </label>
              <input
                name="email_login"
                type="email"
                value={form.email_login}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  erros.email_login ? 'border-red-500 bg-red-50' : 'border-slate-300'
                }`}
              />
              {erros.email_login && (
                <p className="mt-1 text-xs text-red-500">{erros.email_login}</p>
              )}
            </div>

            {/* Nova senha (opcional) */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Nova Senha{' '}
                <span className="text-slate-400 font-normal text-xs">(deixe vazio para manter)</span>
              </label>
              <input
                name="senha"
                type="password"
                value={form.senha}
                onChange={handleChange}
                placeholder="••••••"
                className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  erros.senha ? 'border-red-500 bg-red-50' : 'border-slate-300'
                }`}
              />
              {erros.senha && (
                <p className="mt-1 text-xs text-red-500">{erros.senha}</p>
              )}
            </div>

            {/* Ações */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onFechar}
                className="flex-1 px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={salvando}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {salvando ? (
                  <>
                    <Spinner tamanho="sm" />
                    Salvando…
                  </>
                ) : (
                  'Salvar Alterações'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <ToastContainer toasts={toasts} onRemover={removerToast} />
    </>
  );
}

// ---------------------------------------------------------------------------
// Componente principal: Listagem de Alunos
// ---------------------------------------------------------------------------

export default function ListagemAlunos() {
  const [alunos, setAlunos] = useState<AlunoListado[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [alunoEditando, setAlunoEditando] = useState<AlunoListado | null>(null);
  const [desativandoId, setDesativandoId] = useState<number | null>(null);
  const { toasts, adicionarToast, removerToast } = useToast();

  // Busca os alunos ao montar o componente
  const carregarAlunos = async () => {
    setCarregando(true);
    try {
      const resposta = await alunoService.listar();
      setAlunos(resposta.data.dados ?? []);
    } catch {
      adicionarToast('Erro ao carregar a lista de alunos.', 'erro');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    void carregarAlunos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Desativa logicamente um aluno (soft delete via DELETE)
  const handleDesativar = async (aluno: AlunoListado) => {
    const confirmou = window.confirm(
      `Desativar "${aluno.nome_completo}"?\nO registro será mantido no banco com status inativo.`
    );
    if (!confirmou) return;

    setDesativandoId(aluno.id_aluno);
    try {
      await alunoService.desativar(aluno.id_aluno);
      adicionarToast(`Aluno "${aluno.nome_completo}" desativado com sucesso!`, 'sucesso');
      // Remove da lista local sem precisar rebuscar do servidor
      setAlunos((prev) => prev.filter((a) => a.id_aluno !== aluno.id_aluno));
    } catch (err: unknown) {
      const mensagem = axios.isAxiosError(err)
        ? (err.response?.data?.mensagem ?? 'Erro ao desativar aluno.')
        : 'Erro inesperado.';
      adicionarToast(mensagem, 'erro');
    } finally {
      setDesativandoId(null);
    }
  };

  // Chamado pelo modal de edição ao salvar com sucesso
  const handleSalvoEdicao = () => {
    adicionarToast('Aluno atualizado com sucesso!', 'sucesso');
    setAlunoEditando(null);
    void carregarAlunos(); // Recarrega lista para refletir alterações
  };

  // Formata CPF adicionando máscara visual: 000.000.000-00
  const formatarCPF = (cpf: string) =>
    cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-10 px-4">
        <div className="max-w-6xl mx-auto">

          {/* Cabeçalho */}
          <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                <span>🎓</span> Sistema de Unicred
              </div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                Alunos Cadastrados
              </h1>
              <p className="mt-1 text-slate-500 text-sm">
                Lista de alunos ativos. Use os botões para editar dados ou desativar um cadastro.
              </p>
            </div>
            <button
              onClick={() => void carregarAlunos()}
              disabled={carregando}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 text-sm font-medium shadow-sm hover:bg-slate-50 disabled:opacity-50 transition-colors"
            >
              {carregando ? <Spinner tamanho="sm" /> : '🔄'}
              Atualizar
            </button>
          </div>

          {/* Estado de carregamento inicial */}
          {carregando && alunos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
              <Spinner />
              <p className="text-sm">Carregando alunos…</p>
            </div>
          ) : alunos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <p className="text-4xl mb-3">🎒</p>
              <p className="text-base font-medium text-slate-600">Nenhum aluno cadastrado ainda.</p>
              <p className="text-sm mt-1">Cadastre o primeiro aluno pela tela de Cadastro.</p>
            </div>
          ) : (
            /* Tabela */
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">#</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Nome</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">CPF</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">E-mail</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Saldo</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {alunos.map((aluno) => (
                      <tr
                        key={aluno.id_aluno}
                        className="hover:bg-slate-50 transition-colors duration-100"
                      >
                        <td className="px-4 py-3 text-slate-400 tabular-nums">
                          {aluno.id_aluno}
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-900">
                          {aluno.nome_completo}
                        </td>
                        <td className="px-4 py-3 text-slate-600 font-mono tabular-nums">
                          {formatarCPF(aluno.cpf)}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {aluno.usuario.email_login}
                        </td>
                        <td className="px-4 py-3 text-slate-700 font-semibold tabular-nums">
                          🪙 {Number(aluno.saldo_moedas).toFixed(2)}
                        </td>
                        <td className="px-4 py-3">
                          <BadgeStatus ativo={aluno.usuario.ativo} />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            {/* Botão Editar */}
                            <button
                              onClick={() => setAlunoEditando(aluno)}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold hover:bg-blue-100 transition-colors"
                              title="Editar aluno"
                            >
                              ✏️ Editar
                            </button>

                            {/* Botão Desativar — mostra spinner enquanto processa */}
                            <button
                              onClick={() => void handleDesativar(aluno)}
                              disabled={desativandoId === aluno.id_aluno}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              title="Desativar aluno (exclusão lógica)"
                            >
                              {desativandoId === aluno.id_aluno ? (
                                <Spinner tamanho="sm" />
                              ) : (
                                '🚫'
                              )}
                              Desativar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Rodapé com contagem */}
              <div className="px-4 py-3 border-t border-slate-100 text-xs text-slate-400">
                {alunos.length} aluno{alunos.length !== 1 ? 's' : ''} ativo{alunos.length !== 1 ? 's' : ''}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de edição — renderizado fora do fluxo normal para não sofrer clipping */}
      {alunoEditando && (
        <ModalEdicao
          aluno={alunoEditando}
          onFechar={() => setAlunoEditando(null)}
          onSalvo={handleSalvoEdicao}
        />
      )}

      <ToastContainer toasts={toasts} onRemover={removerToast} />
    </>
  );
}
