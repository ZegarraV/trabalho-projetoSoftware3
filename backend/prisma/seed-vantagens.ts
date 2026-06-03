// =============================================================================
// prisma/seed-vantagens.ts — Seed de Demonstração — Unicred
//
// Cria uma empresa demo e popula 8 vantagens pré-cadastradas para que o
// fluxo completo (vitrine → resgate → validação) funcione imediatamente,
// sem precisar cadastrar empresas reais primeiro.
//
// É seguro rodar múltiplas vezes — verifica existência antes de criar.
//
// Execução:
//   cd backend
//   npx ts-node prisma/seed-vantagens.ts
// =============================================================================

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// ---------------------------------------------------------------------------
// Empresa demo que "patrocina" todas as vantagens pré-cadastradas
// ---------------------------------------------------------------------------
const EMPRESA_DEMO = {
  razao_social: 'Unicred Demonstração Ltda',
  nome_fantasia: 'Parceiros Unicred',
  cnpj: '00.000.000/0001-00',
  contato_nome: 'Administrador Demo',
  email: 'empresa.demo@unicred.app',
  senha: 'Unicred@2025',
};

// ---------------------------------------------------------------------------
// Vantagens pré-cadastradas (baseadas nos mocks da vitrine)
// ---------------------------------------------------------------------------
const VANTAGENS = [
  {
    nome: 'Combo Universitário Premium',
    descricao: '1 sanduíche artesanal + 1 suco natural com 30% de desconto no horário do almoço.',
    custo_moedas: 120,
    foto_url:
      'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1000&q=80',
  },
  {
    nome: 'Curso Express de Excel',
    descricao: 'Acesso a um módulo completo de Excel para análise de dados e dashboards.',
    custo_moedas: 260,
    foto_url:
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1000&q=80',
  },
  {
    nome: 'Desconto em Livros Técnicos',
    descricao: 'Cupom de 40% para compra de livros de programação, design e negócios.',
    custo_moedas: 180,
    foto_url:
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1000&q=80',
  },
  {
    nome: 'Ingresso de Cinema 2D',
    descricao: 'Válido para qualquer sessão 2D de segunda a quinta, exceto pré-estreias.',
    custo_moedas: 140,
    foto_url:
      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1000&q=80',
  },
  {
    nome: 'Passe Livre na Academia',
    descricao: '7 dias de acesso total à musculação, cardio e aulas coletivas.',
    custo_moedas: 210,
    foto_url:
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1000&q=80',
  },
  {
    nome: 'Mentoria de Portfólio',
    descricao: 'Sessão individual de 45 minutos para revisar currículo e portfólio.',
    custo_moedas: 300,
    foto_url:
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1000&q=80',
  },
  {
    nome: 'Kit Material Acadêmico',
    descricao: '1 caderno, 1 bloco A4 e canetas com 50% de desconto no checkout.',
    custo_moedas: 90,
    foto_url:
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1000&q=80',
  },
  {
    nome: 'Aula Experimental de Inglês',
    descricao: 'Aula avaliativa com professor nativo e trilha de estudos personalizada.',
    custo_moedas: 160,
    foto_url:
      'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1000&q=80',
  },
];

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  console.log('🌱 Iniciando seed de demonstração...\n');

  // ── 1. Empresa demo ──────────────────────────────────────────────────────
  let idEmpresa: number;

  const empresaExistente = await prisma.empresaParceira.findFirst({
    where: { cnpj: EMPRESA_DEMO.cnpj },
  });

  if (empresaExistente) {
    idEmpresa = empresaExistente.id_empresa;
    console.log(`⏭️  Empresa demo já existe (id=${idEmpresa}) — reutilizando.\n`);
  } else {
    const senhaHash = await bcrypt.hash(EMPRESA_DEMO.senha, 10);

    const usuario = await prisma.usuario.create({
      data: {
        email_login: EMPRESA_DEMO.email,
        senha_hash: senhaHash,
        tipo_perfil: 'EMPRESA',
      },
    });

    const empresa = await prisma.empresaParceira.create({
      data: {
        razao_social: EMPRESA_DEMO.razao_social,
        nome_fantasia: EMPRESA_DEMO.nome_fantasia,
        cnpj: EMPRESA_DEMO.cnpj,
        contato_nome: EMPRESA_DEMO.contato_nome,
        id_usuario: usuario.id_usuario,
      },
    });

    idEmpresa = empresa.id_empresa;
    console.log(`✅ Empresa demo criada: ${EMPRESA_DEMO.nome_fantasia} (id=${idEmpresa})\n`);
  }

  // ── 2. Vantagens ─────────────────────────────────────────────────────────
  let criadas = 0;
  let puladas = 0;

  for (const v of VANTAGENS) {
    const existe = await prisma.vantagem.findFirst({
      where: { nome: v.nome, id_empresa: idEmpresa },
    });

    if (existe) {
      console.log(`   ⏭️  Já existe: ${v.nome}`);
      puladas++;
      continue;
    }

    await prisma.vantagem.create({
      data: {
        nome: v.nome,
        descricao: v.descricao,
        custo_moedas: v.custo_moedas,
        foto_url: v.foto_url,
        id_empresa: idEmpresa,
      },
    });

    console.log(`   🎁 Criada: ${v.nome} — ${v.custo_moedas} moedas`);
    criadas++;
  }

  console.log(`\n🎉 Seed concluído! Criadas: ${criadas} | Puladas: ${puladas}`);
  console.log('\n📋 Acesso à empresa demo (para testar validação de cupons):');
  console.log(`   E-mail : ${EMPRESA_DEMO.email}`);
  console.log(`   Senha  : ${EMPRESA_DEMO.senha}`);
  console.log('\n💡 Dica: qualquer empresa cadastrada também pode validar qualquer cupom.');
}

main()
  .catch((e) => {
    console.error('\n❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
