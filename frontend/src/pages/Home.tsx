// =============================================================================
// src/pages/Home.tsx — Página inicial com navegação entre cadastros
// =============================================================================

import { Link } from 'react-router-dom';

interface CardNavegacaoProps {
  para: string;
  icone: string;
  titulo: string;
  descricao: string;
  cor: string;
  corBotao: string;
}

function CardNavegacao({ para, icone, titulo, descricao, cor, corBotao }: CardNavegacaoProps) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300`}>
      {/* Faixa colorida no topo */}
      <div className={`h-2 ${cor}`} />
      <div className="p-8">
        <div className="text-5xl mb-4">{icone}</div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">{titulo}</h2>
        <p className="text-slate-500 text-sm mb-6 leading-relaxed">{descricao}</p>
        <Link
          to={para}
          className={`inline-flex items-center gap-2 ${corBotao} text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-150 active:scale-95`}
        >
          Acessar Cadastro
          <span>→</span>
        </Link>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero */}
      <div className="max-w-5xl mx-auto px-4 pt-16 pb-12 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-6">
          <span>🎓</span> Lab03S03 — PUC Minas
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
          Sistema de <span className="text-blue-600">Unicred</span>
        </h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
          Plataforma de gerenciamento de moedas para alunos e empresas parceiras.
          Selecione o tipo de cadastro que deseja realizar.
        </p>
      </div>

      {/* Cards de navegação */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <CardNavegacao
            para="/cadastro-aluno"
            icone="🎒"
            titulo="Cadastro de Aluno"
            descricao="Registre um novo aluno no sistema. Preencha os dados pessoais, endereço completo e defina as credenciais de acesso."
            cor="bg-blue-500"
            corBotao="bg-blue-600 hover:bg-blue-700"
          />
          <CardNavegacao
            para="/cadastro-empresa"
            icone="🏢"
            titulo="Cadastro de Empresa Parceira"
            descricao="Registre uma empresa parceira para que ela possa publicar vantagens e benefícios exclusivos para os alunos da rede."
            cor="bg-indigo-500"
            corBotao="bg-indigo-600 hover:bg-indigo-700"
          />
          <CardNavegacao
            para="/alunos"
            icone="📋"
            titulo="Gerenciar Alunos"
            descricao="Visualize, edite e desative alunos cadastrados. Tabela com busca e ações rápidas de edição e exclusão lógica."
            cor="bg-teal-500"
            corBotao="bg-teal-600 hover:bg-teal-700"
          />
          <CardNavegacao
            para="/empresas"
            icone="📊"
            titulo="Gerenciar Empresas"
            descricao="Visualize, edite e desative empresas parceiras. Gerencie dados de contato e credenciais de acesso com facilidade."
            cor="bg-violet-500"
            corBotao="bg-violet-600 hover:bg-violet-700"
          />
        </div>

        {/* Rodapé informativo */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          {[
            { icone: '🔒', titulo: 'Seguro', desc: 'Senhas armazenadas com bcrypt' },
            { icone: '⚡', titulo: 'Rápido', desc: 'API RESTful com Express e Prisma ORM' },
            { icone: '📊', titulo: 'Organizado', desc: 'Arquitetura MVC bem definida' },
          ].map((item) => (
            <div key={item.titulo} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <div className="text-2xl mb-2">{item.icone}</div>
              <p className="font-semibold text-slate-800 text-sm">{item.titulo}</p>
              <p className="text-slate-400 text-xs mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
