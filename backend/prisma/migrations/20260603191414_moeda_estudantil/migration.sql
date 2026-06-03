-- CreateEnum
CREATE TYPE "TipoPerfil" AS ENUM ('ALUNO', 'PROFESSOR', 'EMPRESA');

-- CreateEnum
CREATE TYPE "StatusResgate" AS ENUM ('PENDENTE', 'ENVIADO', 'CONCLUIDO');

-- CreateTable
CREATE TABLE "usuarios" (
    "id_usuario" SERIAL NOT NULL,
    "email_login" TEXT NOT NULL,
    "senha_hash" TEXT NOT NULL,
    "tipo_perfil" "TipoPerfil" NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "alunos" (
    "id_aluno" SERIAL NOT NULL,
    "nome_completo" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "rg" TEXT,
    "logradouro" TEXT,
    "numero" TEXT,
    "complemento" TEXT,
    "bairro" TEXT,
    "cidade" TEXT,
    "estado" TEXT,
    "cep" TEXT,
    "saldo_moedas" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "id_usuario" INTEGER NOT NULL,
    "id_instituicao" INTEGER,
    "id_curso" INTEGER,

    CONSTRAINT "alunos_pkey" PRIMARY KEY ("id_aluno")
);

-- CreateTable
CREATE TABLE "empresas_parceiras" (
    "id_empresa" SERIAL NOT NULL,
    "razao_social" TEXT NOT NULL,
    "nome_fantasia" TEXT,
    "cnpj" TEXT NOT NULL,
    "contato_nome" TEXT,
    "id_usuario" INTEGER NOT NULL,

    CONSTRAINT "empresas_parceiras_pkey" PRIMARY KEY ("id_empresa")
);

-- CreateTable
CREATE TABLE "professores" (
    "id_professor" SERIAL NOT NULL,
    "nome_completo" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "departamento" TEXT,
    "saldo_moedas" DECIMAL(10,2) NOT NULL DEFAULT 1000.00,
    "id_usuario" INTEGER NOT NULL,

    CONSTRAINT "professores_pkey" PRIMARY KEY ("id_professor")
);

-- CreateTable
CREATE TABLE "reconhecimentos_merito" (
    "id_reconhecimento" SERIAL NOT NULL,
    "quantidade" DECIMAL(10,2) NOT NULL,
    "motivo" TEXT NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_professor" INTEGER NOT NULL,
    "id_aluno" INTEGER NOT NULL,

    CONSTRAINT "reconhecimentos_merito_pkey" PRIMARY KEY ("id_reconhecimento")
);

-- CreateTable
CREATE TABLE "distribuicoes_semestrais" (
    "id_distribuicao" SERIAL NOT NULL,
    "quantidade" DECIMAL(10,2) NOT NULL,
    "semestre" TEXT NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_professor" INTEGER NOT NULL,

    CONSTRAINT "distribuicoes_semestrais_pkey" PRIMARY KEY ("id_distribuicao")
);

-- CreateTable
CREATE TABLE "vantagens" (
    "id_vantagem" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "foto_url" TEXT,
    "custo_moedas" DECIMAL(10,2) NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_empresa" INTEGER NOT NULL,

    CONSTRAINT "vantagens_pkey" PRIMARY KEY ("id_vantagem")
);

-- CreateTable
CREATE TABLE "resgates_vantagem" (
    "id_resgate" SERIAL NOT NULL,
    "codigo_cupom" TEXT NOT NULL,
    "quantidade" DECIMAL(10,2) NOT NULL,
    "descricao" TEXT NOT NULL,
    "status" "StatusResgate" NOT NULL DEFAULT 'PENDENTE',
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_aluno" INTEGER NOT NULL,
    "id_vantagem" INTEGER NOT NULL,
    "id_empresa" INTEGER NOT NULL,

    CONSTRAINT "resgates_vantagem_pkey" PRIMARY KEY ("id_resgate")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_login_key" ON "usuarios"("email_login");

-- CreateIndex
CREATE UNIQUE INDEX "alunos_cpf_key" ON "alunos"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "alunos_id_usuario_key" ON "alunos"("id_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "empresas_parceiras_cnpj_key" ON "empresas_parceiras"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "empresas_parceiras_id_usuario_key" ON "empresas_parceiras"("id_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "professores_cpf_key" ON "professores"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "professores_id_usuario_key" ON "professores"("id_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "resgates_vantagem_codigo_cupom_key" ON "resgates_vantagem"("codigo_cupom");

-- AddForeignKey
ALTER TABLE "alunos" ADD CONSTRAINT "alunos_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "empresas_parceiras" ADD CONSTRAINT "empresas_parceiras_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professores" ADD CONSTRAINT "professores_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reconhecimentos_merito" ADD CONSTRAINT "reconhecimentos_merito_id_professor_fkey" FOREIGN KEY ("id_professor") REFERENCES "professores"("id_professor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reconhecimentos_merito" ADD CONSTRAINT "reconhecimentos_merito_id_aluno_fkey" FOREIGN KEY ("id_aluno") REFERENCES "alunos"("id_aluno") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "distribuicoes_semestrais" ADD CONSTRAINT "distribuicoes_semestrais_id_professor_fkey" FOREIGN KEY ("id_professor") REFERENCES "professores"("id_professor") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vantagens" ADD CONSTRAINT "vantagens_id_empresa_fkey" FOREIGN KEY ("id_empresa") REFERENCES "empresas_parceiras"("id_empresa") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resgates_vantagem" ADD CONSTRAINT "resgates_vantagem_id_aluno_fkey" FOREIGN KEY ("id_aluno") REFERENCES "alunos"("id_aluno") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resgates_vantagem" ADD CONSTRAINT "resgates_vantagem_id_vantagem_fkey" FOREIGN KEY ("id_vantagem") REFERENCES "vantagens"("id_vantagem") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resgates_vantagem" ADD CONSTRAINT "resgates_vantagem_id_empresa_fkey" FOREIGN KEY ("id_empresa") REFERENCES "empresas_parceiras"("id_empresa") ON DELETE RESTRICT ON UPDATE CASCADE;
