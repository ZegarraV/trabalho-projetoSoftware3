<a href="https://classroom.github.com/online_ide?assignment_repo_id=99999999&assignment_repo_type=AssignmentRepo"><img src="https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg" width="200"/></a> <a href="https://classroom.github.com/open-in-codespaces?assignment_repo_id=99999999"><img src="https://classroom.github.com/assets/launch-codespace-2972f46106e565e64193e422d61a12cf1da4916b45550586e14ef0a7c637dd04.svg" width="250"/></a>

---

# 🪙 Sistema de Moeda Estudantil 👨‍💻

> [!NOTE]
> Plataforma de **moeda virtual acadêmica** que estimula o mérito estudantil.  
> Professores recompensam alunos com moedas virtuais que podem ser trocadas por vantagens (descontos e produtos) oferecidas por empresas parceiras.

<table>
  <tr>
    <td width="800px">
      <div align="justify">
        O <b>Sistema de Moeda Estudantil</b> é uma plataforma <i>fullstack</i> desenvolvida como projeto acadêmico da disciplina de <b>Laboratório de Desenvolvimento de Software</b> da <b>PUC Minas</b>. O objetivo é criar um ecossistema digital de reconhecimento do mérito estudantil: professores distribuem <i>moedas virtuais</i> aos seus alunos como forma de reconhecimento por bom comportamento e participação, e os alunos podem trocar essas moedas por vantagens (descontos, produtos, mensalidades) em <b>empresas parceiras</b> cadastradas. O sistema é construído com <b>Node.js</b>, <b>TypeScript</b>, <b>Prisma ORM</b>, <b>PostgreSQL</b> e <b>React com TailwindCSS</b>, seguindo rigorosamente a arquitetura <b>MVC</b>. A estratégia de acesso ao banco usa <i>transações atômicas</i> para garantir consistência, e as senhas são protegidas com <b>bcrypt</b>. O projeto adota <i>Clean Code</i>, modularização clara e boas práticas de engenharia de software.
      </div>
    </td>
    <td>
      <div align="center">
        <img src="https://joaopauloaramuni.github.io/image/logo_ES_vertical.png" alt="Logo PUC Minas Engenharia de Software" width="120px"/>
      </div>
    </td>
  </tr>
</table>

---

## 🚧 Status do Projeto

[![Versão](https://img.shields.io/badge/Versão-v1.0.0-blue?style=for-the-badge)](https://github.com/Dolabelaa/trabalho-projetoSoftware3)
![Node.js](https://img.shields.io/badge/Node.js-20.x_LTS-007ec6?style=for-the-badge&logo=nodedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4.5-007ec6?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-18.3.1-007ec6?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.2.13-007ec6?style=for-the-badge&logo=vite&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.19.2-007ec6?style=for-the-badge&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma_ORM-5.13.0-007ec6?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-007ec6?style=for-the-badge&logo=postgresql&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.4-007ec6?style=for-the-badge&logo=tailwindcss&logoColor=white)
![GitHub license](https://img.shields.io/badge/Licença-MIT-007ec6?style=for-the-badge&logo=opensourceinitiative)
![GitHub stars](https://img.shields.io/github/stars/Dolabelaa/trabalho-projetoSoftware3?style=for-the-badge&logo=github)
![GitHub last commit](https://img.shields.io/github/last-commit/Dolabelaa/trabalho-projetoSoftware3?style=for-the-badge&logo=clockify)

---

## 📚 Índice
- [Links Úteis](#-links-úteis)
- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades Principais](#-funcionalidades-principais)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Arquitetura](#-arquitetura)
  - [Exemplos de diagramas](#exemplos-de-diagramas)
- [Instalação e Execução](#-instalação-e-execução)
  - [Pré-requisitos](#pré-requisitos)
  - [Variáveis de Ambiente](#-variáveis-de-ambiente)
    - [1 Back-end (Node.js + Express)](#1-back-end-nodejs--express)
    - [2 Front-end (React, Vite)](#2-front-end-react-vite)
  - [Instalação de Dependências](#-instalação-de-dependências)
    - [Front-end (React)](#front-end-react)
    - [Back-end (Node.js)](#back-end-nodejs)
  - [Inicialização do Banco de Dados (PostgreSQL)](#-inicialização-do-banco-de-dados-postgresql)
  - [Como Executar a Aplicação](#-como-executar-a-aplicação)
    - [Terminal 1: Back-end (Node.js + Express)](#terminal-1-back-end-nodejs--express)
    - [Terminal 2: Front-end (React, Vite)](#terminal-2-front-end-react-vite)
    - [Execução Local Completa com Docker Compose](#-execução-local-completa-com-docker-compose-incluindo-banco-de-dados)
    - [Passos para build, inicialização e execução](#-passos-para-build-inicialização-e-execução)
- [Deploy](#-deploy)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Demonstração](#-demonstração)
  - [Aplicação Web](#-aplicação-web)
  - [Exemplo de saída no Terminal (API)](#-exemplo-de-saída-no-terminal-para-back-end-api)
- [Testes](#-testes)
- [Documentações utilizadas](#-documentações-utilizadas)
- [Autores](#-autores)
- [Contribuição](#-contribuição)
- [Agradecimentos](#-agradecimentos)
- [Licença](#-licença)

---

## 🔗 Links Úteis
* 🌐 **Repositório:** [github.com/Dolabelaa/trabalho-projetoSoftware3](https://github.com/Dolabelaa/trabalho-projetoSoftware3)
  > 💻 **Descrição:** Repositório principal do projeto com todo o histórico de commits por sprint.
* 📖 **Health Check da API:** `http://localhost:3333/api/health`
  > 📚 **Descrição:** Endpoint de verificação de saúde da API, disponível ao rodar a aplicação localmente.
* 🎓 **Disciplina:** Laboratório de Desenvolvimento de Software — PUC Minas

---

## 📝 Sobre o Projeto

O **Sistema de Moeda Estudantil** nasceu como projeto acadêmico da disciplina de **Laboratório de Desenvolvimento de Software** da **PUC Minas**, com o objetivo de criar um ecossistema digital de reconhecimento do mérito estudantil.

**Por que ele existe?**
Falta, no ambiente universitário, um mecanismo formal, digital e rastreável para que professores recompensem alunos pelo bom comportamento, participação em aula e dedicação. Ao mesmo tempo, empresas parceiras têm interesse em se conectar com o público universitário de forma relevante.

**Qual problema ele resolve?**
- Professores não possuem um canal estruturado para reconhecer e recompensar o mérito estudantil.
- Alunos não têm forma de converter seu esforço em benefícios concretos.
- Empresas carecem de um canal direto e contextualizado para oferecer vantagens ao público universitário.

**Como funciona?**
A cada semestre, professores recebem 1.000 moedas virtuais para distribuir a alunos. Alunos acumulam moedas e as trocam por vantagens (descontos, produtos, bolsas) no catálogo das empresas parceiras.

**Contexto — Release 1 (Lab03S01 a Lab03S03):**
Esta primeira release cobre a modelagem do sistema (Casos de Uso, Histórias de Usuário, Diagrama de Classes e Componentes), a implementação do banco de dados via ORM e os CRUDs completos de **Aluno** e **Empresa Parceira**, com front-end e back-end totalmente integrados.

> [!NOTE]
> As funcionalidades de autenticação JWT, lançamento de moedas por professores, catálogo de vantagens e sistema de cupons serão implementadas nas releases futuras.

---

## ✨ Funcionalidades Principais

- 🎒 **Cadastro de Alunos:** Formulário multi-seções com dados pessoais, endereço completo e credenciais de acesso. Cria atomicamente o registro de autenticação (`Usuario`) e o perfil do aluno em uma única transação de banco.
- 🏢 **Cadastro de Empresas Parceiras:** Formulário com dados corporativos (CNPJ, Razão Social, Nome Fantasia, Contato) e credenciais de acesso.
- 📋 **CRUD Completo de Alunos e Empresas:** Criação, listagem, busca por ID, atualização parcial e exclusão lógica (soft delete via `ativo = false`).
- 🔍 **Listagem e Gerenciamento:** Telas dedicadas para visualizar, editar e desativar alunos e empresas, com modais de edição e confirmação de ações destrutivas.
- 🔐 **Senha Segura com bcrypt:** Todas as senhas são armazenadas como hash (bcrypt, custo 10), nunca em texto puro.
- 🗑️ **Exclusão Lógica (Soft Delete):** Registros nunca são deletados fisicamente do banco — apenas desativados, preservando histórico e consistência referencial.
- ✅ **Validação em Duas Camadas:** Middleware server-side com Zod (formato de e-mail, CPF com 11 dígitos, CNPJ com 14 dígitos, senha mínima de 6 caracteres) e validação client-side nos formulários React.
- 🔔 **Toast Notifications:** Feedback visual instantâneo de sucesso ou erro após cada operação, com animação de entrada e saída e auto-dismiss.
- 💳 **Saldo de Moedas:** Campo `saldo_moedas` no perfil do Aluno, pronto para as próximas iterações do sistema de transações.

---

## 🛠 Tecnologias Utilizadas

As seguintes ferramentas, frameworks e bibliotecas foram utilizados na construção deste projeto.

### 💻 Front-end

* **Framework/Biblioteca:** React v18.3.1
* **Linguagem:** TypeScript 5.4.5
* **Estilização:** Tailwind CSS 3.4.4
* **Roteamento:** React Router DOM v6.23.1
* **Cliente HTTP:** Axios 1.7.2
* **Build Tool:** Vite 5.2.13

### 🖥️ Back-end

* **Runtime:** Node.js v20.x (LTS)
* **Linguagem:** TypeScript 5.4.5
* **Framework:** Express 4.19.2
* **Banco de Dados:** PostgreSQL 16
* **ORM:** Prisma 5.13.0 (migrations, type-safe queries, Prisma Studio)
* **Hash de Senhas:** bcryptjs 2.4.3
* **Validação:** Zod 4.4.3 (schemas + middleware)
* **Variáveis de Ambiente:** dotenv 16.4.5
* **CORS:** cors 2.8.5
* **Dev Server:** ts-node-dev 2.0.0 (hot reload)

### ⚙️ Infraestrutura & DevOps

* **Containerização:** Docker (para o banco de dados PostgreSQL em desenvolvimento)
* **CI/CD:** Git + GitHub

---

## 🏗 Arquitetura

O sistema adota a **arquitetura MVC (Model-View-Controller)** com uma camada de **Service** intermediária entre o Controller e o banco de dados, isolando completamente as regras de negócio.

**Fluxo de uma requisição:**
```
Requisição HTTP
      │
      ▼
 [ validarSchema ]     ← Middleware Zod: valida tipos, formatos (e-mail, CPF, CNPJ) e
      │                  normaliza dados (strip de máscara). Retorna 422 se inválido.
      ▼
 [ Controller ]        ← Extrai dados do Request, aciona o Service e retorna a Response
      │                  com o status HTTP correto. NÃO contém regras de negócio.
      ▼
  [ Service ]          ← Regras de negócio, verificação de duplicidade (CPF, CNPJ, e-mail)
      │                  e transações atômicas (prisma.$transaction).
      ▼
 [ Prisma ORM ]        ← Acesso ao banco com queries fortemente tipadas.
      │                  Inclui relações (include), filtros e ordenação.
      ▼
 [ PostgreSQL ]        ← Persistência dos dados com integridade referencial.
```

**Padrões de design adotados:**
- **Service Layer:** Toda a lógica de negócio fica nos Services, separada do Controller.
- **DTO (Data Transfer Object):** Interfaces TypeScript (`CriarAlunoDTO`, `AtualizarAlunoDTO`) definem os contratos de entrada de cada operação.
- **Singleton:** O `PrismaClient` é exportado como instância única (`database.ts`) para evitar conexões redundantes.
- **Table-Per-Type (TPT):** A tabela `usuarios` é a base de autenticação. `Aluno` e `EmpresaParceira` referenciam `Usuario` com relação 1-para-1 única.
- **Soft Delete:** Exclusão lógica via `ativo = false` no `Usuario` vinculado, preservando histórico de transações futuras.

**Atomicidade garantida:**
O cadastro de qualquer entidade utiliza `prisma.$transaction()`. Se a criação do `Usuario` ou do `Aluno`/`EmpresaParceira` falhar, **toda a operação é revertida automaticamente**, evitando registros órfãos no banco.

### Exemplos de diagramas

Para melhor visualização e entendimento da estrutura do sistema, os diagramas principais estão organizados lado a lado.

| Diagrama de Arquitetura | Detalhe da Arquitetura |
| :---: | :---: |
| **Visão Geral (Macro)** | **Fluxo MVC de uma Requisição** |
| <img src="https://joaopauloaramuni.github.io/image/aramunilogo.png" alt="Diagrama de Visão Geral do Sistema" width="120px" height="120px"> | <img src="https://joaopauloaramuni.github.io/image/aramunilogo.png" alt="Fluxo MVC" width="120px" height="120px"> |
| **Modelo de Dados (Entidades)** | **Diagrama de Componentes** |
| <img src="https://joaopauloaramuni.github.io/image/aramunilogo.png" alt="Diagrama Entidade-Relacionamento" width="120px" height="120px"> | <img src="https://joaopauloaramuni.github.io/image/aramunilogo.png" alt="Diagrama de Componentes" width="120px" height="120px"> |
| **Diagrama de Casos de Uso** | **Diagrama de Classes** |
| <img src="https://joaopauloaramuni.github.io/image/aramunilogo.png" alt="Diagrama de Casos de Uso" width="120px" height="120px"> | <img src="https://joaopauloaramuni.github.io/image/aramunilogo.png" alt="Diagrama de Classes" width="120px" height="120px"> |

> [!NOTE]
> Substitua as imagens acima pelas capturas reais dos diagramas UML produzidos nas sprints iniciais do projeto.

---

## 🔧 Instalação e Execução

### Pré-requisitos
Certifique-se de que o seu ambiente possui as seguintes ferramentas instaladas:

* **Node.js:** Versão **20.x (LTS)** ou superior (Necessário para o **Back-end** e **Front-end**)
* **npm:** Versão **10.x** ou superior (incluso com o Node.js)
* **PostgreSQL:** Versão **16.x** — instalado localmente ou via **Docker**
* **Docker** (Opcional, mas **altamente recomendado** para rodar o Banco de Dados)
* **Git**

---

### 🔑 Variáveis de Ambiente

Crie arquivos `.env` específicos para cada parte da aplicação.

#### 1 Back-end (Node.js + Express)

Crie um arquivo **`.env`** na raiz da pasta `/backend`:

| Variável | Descrição | Exemplo |
| :--- | :--- | :--- |
| `DATABASE_URL` | String de conexão do PostgreSQL para o Prisma | `postgresql://postgres:senha@localhost:5432/moeda_estudantil` |
| `PORT` | Porta onde o servidor Express será executado | `3333` |
| `FRONTEND_URL` | URL do front-end para configuração do CORS | `http://localhost:5173` |

```env
# backend/.env
DATABASE_URL="postgresql://postgres:sua_senha@localhost:5432/moeda_estudantil"
PORT=3333
FRONTEND_URL="http://localhost:5173"
```

#### 2 Front-end (React, Vite)

O front-end usa o **proxy do Vite** (`vite.config.ts`) para redirecionar `/api` → `http://localhost:3333` em desenvolvimento. Nenhuma variável adicional é necessária para rodar localmente.

Para **deploy em produção**, crie um arquivo **`.env`** na raiz da pasta `/frontend`:

| Variável | Descrição | Exemplo |
| :--- | :--- | :--- |
| `VITE_API_URL` | URL base da API em produção | `https://meu-backend.railway.app` |

> **Obs:** As variáveis em projetos **Vite** precisam começar com `VITE_` para serem incluídas no *bundle* do front-end; variáveis sem esse prefixo não ficam disponíveis no código do cliente.

---

### 📦 Instalação de Dependências

Clone o repositório e instale as dependências.

1. **Clone o Repositório:**

```bash
git clone https://github.com/Dolabelaa/trabalho-projetoSoftware3.git
cd trabalho-projetoSoftware3
```

2. **Instale as Dependências (Monorepo):**

Como o projeto está dividido em `/frontend` e `/backend`, instale separadamente.

#### Front-end (React)

```bash
cd frontend
npm install
cd ..
```

#### Back-end (Node.js)

```bash
cd backend
npm install
cd ..
```

---

### 💾 Inicialização do Banco de Dados (PostgreSQL)

O projeto utiliza **PostgreSQL**. A forma mais fácil de inicializar o banco é via Docker:

1. **Rode o Container do PostgreSQL:**

```bash
docker run --name moeda_estudantil_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=sua_senha \
  -e POSTGRES_DB=moeda_estudantil \
  -p 5432:5432 \
  -d postgres:16
```

2. **Configure o `.env`** do back-end com a `DATABASE_URL` correspondente.

3. **Execute as migrations do Prisma** (cria todas as tabelas automaticamente):

```bash
cd backend
npx prisma migrate dev --name init
```

4. **Gere o Prisma Client:**

```bash
npx prisma generate
```

> [!NOTE]
> Para inspecionar o banco de dados visualmente via interface web, utilize o **Prisma Studio**:
> ```bash
> cd backend
> npx prisma studio
> ```

---

### ⚡ Como Executar a Aplicação
Execute a aplicação em modo de desenvolvimento em **dois terminais separados**.

#### Terminal 1: Back-end (Node.js + Express)

```bash
cd backend
npm run dev
```
🚀 *O Back-end estará disponível em **http://localhost:3333***
🏥 *Health check: **http://localhost:3333/api/health***

---

#### Terminal 2: Front-end (React, Vite)

```bash
cd frontend
npm run dev
```
🎨 *O Front-end estará disponível em **http://localhost:5173***

---

#### 🐳 Execução Local Completa com Docker Compose (Incluindo Banco de Dados)

Para uma execução local que inclui o serviço de Back-end (**Node.js**), Front-end (**React**) e o banco de dados **PostgreSQL**, usaremos o **`docker-compose`** para orquestração.

Antes de tudo, certifique-se de que o **Docker Desktop** (no Mac/Windows) ou o **serviço Docker** (em Linux) está em execução.

- **No Mac/Windows**: basta abrir o aplicativo **Docker Desktop**.
- **No Linux**: rode o comando abaixo para iniciar o serviço:

```bash
sudo systemctl start docker
```

---

#### 📦 Passos para build, inicialização e execução

1. Acesse a pasta raiz do projeto:

```bash
cd trabalho-projetoSoftware3
```

2. Suba todos os serviços:

```bash
docker-compose up --build -d
```

> [!NOTE]
> 💡 O parâmetro `--build` garante que as imagens mais recentes do projeto sejam geradas, e `-d` executa em segundo plano.

3. Verifique se os containers estão rodando:

```bash
docker ps
```

4. **Execute as Migrations do Banco de Dados** (apenas na primeira vez):

```bash
docker exec -it <nome_do_container_backend> npx prisma migrate deploy
```

5. Abra no navegador: **http://localhost:5173**

6. Para parar e remover todos os containers:

```bash
docker-compose down
```

✅ **Em resumo:** Usar **`docker-compose`** simplifica a execução do ambiente completo, isolando as dependências de **Node.js** e garantindo que o PostgreSQL esteja disponível.

---

## 🚀 Deploy

Instruções para build e deploy em produção.

1. **Build do Projeto:**

```bash
# 1. Build do Front-end (React/Vite) — Gera a pasta /dist com arquivos estáticos
cd frontend
npm run build

# 2. Build do Back-end (Node.js/TypeScript) — Transpila TS para JS na pasta /dist
cd ../backend
npm run build
```

2. **Configuração do Ambiente de Produção:** Defina as variáveis de ambiente no seu provedor (e.g., Railway, Render, Vercel, DigitalOcean).

> 🔑 **Variáveis Cruciais:** Configure `DATABASE_URL` (apontando para o banco de produção, ex: Neon.tech ou Supabase) no Back-end e `VITE_API_URL` no Front-end.

3. **Execução em Produção:**

```bash
# 🟢 Execução do Back-end (Node.js compilado)
cd backend
npx prisma migrate deploy   # Aplica migrations pendentes em produção
npm start                   # Inicia: node dist/server.js

# 🌐 Execução do Front-end (arquivos estáticos gerados pelo Vite)
# Servido por Nginx, Vercel, Netlify, etc.
# Para simular produção localmente:
cd frontend
npm run preview
```

---

## 📂 Estrutura de Pastas

```
trabalho-projetoSoftware3/
│
├── README.md                          # 📘 Documentação principal do projeto
│
├── /backend                           # 📁 API RESTful — Node.js + Express + TypeScript
│   ├── .env                           # 🔒 Variáveis de ambiente (não versionado)
│   ├── package.json                   # 📦 Dependências e scripts npm
│   ├── tsconfig.json                  # ⚙️ Configuração do TypeScript
│   │
│   ├── /prisma
│   │   └── schema.prisma              # 🗄️ Modelo ER: Usuario, Aluno, EmpresaParceira
│   │
│   └── /src
│       ├── server.ts                  # 🚀 Ponto de entrada — configura e inicia o Express
│       │
│       ├── /config
│       │   └── database.ts            # 🔌 Singleton do PrismaClient
│       │
│       ├── /controllers               # 🎮 Camada Controller (MVC)
│       │   ├── AlunoController.ts     #    Orquestra HTTP ↔ AlunoService
│       │   └── EmpresaController.ts   #    Orquestra HTTP ↔ EmpresaService
│       │
│       ├── /services                  # ⚙️ Camada de Regras de Negócio
│       │   ├── AlunoService.ts        #    CRUD + transação atômica Usuario+Aluno
│       │   └── EmpresaService.ts      #    CRUD + transação atômica Usuario+Empresa
│       │
│       ├── /routes                    # 🛣️ Definição das rotas da API
│       │   ├── alunoRoutes.ts         #    GET/POST/PUT/DELETE /api/alunos
│       │   └── empresaRoutes.ts       #    GET/POST/PUT/DELETE /api/empresas
│       │
│       └── /middlewares               # 🛡️ Middlewares de validação
│           └── validationMiddleware.ts #   Zod schemas + fábrica validarSchema()
│
└── /frontend                          # 📁 SPA — React + TypeScript + TailwindCSS
    ├── index.html                     # 🌐 Ponto de entrada HTML
    ├── package.json                   # 📦 Dependências e scripts npm
    ├── tsconfig.json                  # ⚙️ Configuração do TypeScript
    ├── vite.config.ts                 # ⚡ Configuração do Vite + proxy /api → :3333
    ├── tailwind.config.js             # 🎨 Configuração do TailwindCSS
    ├── postcss.config.js              # 🔧 Configuração do PostCSS
    │
    └── /src
        ├── main.tsx                   # 🚀 Ponto de entrada React (ReactDOM.createRoot)
        ├── App.tsx                    # 🗺️ Roteamento principal + Navbar (React Router)
        ├── index.css                  # 🎨 Estilos globais + classes utilitárias Tailwind
        │
        ├── /pages
        │   └── Home.tsx               # 🏠 Página inicial com cards de navegação
        │
        ├── /components                # 🧱 Componentes React
        │   ├── CadastroAluno.tsx      #    Formulário multi-seções de cadastro de aluno
        │   ├── CadastroEmpresa.tsx    #    Formulário de cadastro de empresa parceira
        │   ├── ListagemAlunos.tsx     #    Tabela de alunos com edição e desativação
        │   ├── ListagemEmpresas.tsx   #    Tabela de empresas com edição e desativação
        │   └── Toast.tsx              #    Sistema de notificações (hook useToast + container)
        │
        └── /services
            └── api.ts                 # 🔌 Axios config + funções tipadas por endpoint
```

---

## 🎥 Demonstração

> [!WARNING]
> Dê preferência a hospedar suas imagens em um **CDN** ou no **GitHub Pages** para garantir que elas carreguem rapidamente e não quebrem. Saiba mais sobre o GitHub Pages clicando [aqui](https://github.com/joaopauloaramuni/joaopauloaramuni.github.io).

### 🌐 Aplicação Web

Para melhor visualização, as telas principais estão organizadas lado a lado.

| Tela | Captura de Tela |
| :---: | :---: |
| **Página Inicial (Home)** | **Cadastro de Aluno** |
| <img src="https://joaopauloaramuni.github.io/image/aramunilogo.png" alt="Página Inicial" width="120px" height="120px"> | <img src="https://joaopauloaramuni.github.io/image/aramunilogo.png" alt="Cadastro de Aluno" width="120px" height="120px"> |
| **Cadastro de Empresa Parceira** | **Listagem e Gestão de Alunos** |
| <img src="https://joaopauloaramuni.github.io/image/aramunilogo.png" alt="Cadastro de Empresa" width="120px" height="120px"> | <img src="https://joaopauloaramuni.github.io/image/aramunilogo.png" alt="Listagem de Alunos" width="120px" height="120px"> |
| **Modal de Edição** | **Listagem de Empresas Parceiras** |
| <img src="https://joaopauloaramuni.github.io/image/aramunilogo.png" alt="Modal de Edição" width="120px" height="120px"> | <img src="https://joaopauloaramuni.github.io/image/aramunilogo.png" alt="Listagem de Empresas" width="120px" height="120px"> |

> [!NOTE]
> Substitua as imagens acima por capturas de tela reais da aplicação rodando localmente.

### 💻 Exemplo de Saída no Terminal (para Back-end, API)

#### 1. Demonstração da API (Exemplo com cURL)

```bash
# Cadastrar um novo aluno
curl -X POST http://localhost:3333/api/alunos \
  -H "Content-Type: application/json" \
  -d '{
    "email_login": "joao.silva@aluno.puc.br",
    "senha": "senha123",
    "nome_completo": "João da Silva Pereira",
    "cpf": "12345678901",
    "cidade": "Belo Horizonte",
    "estado": "MG"
  }'
```

**Saída Esperada (201 Created):**
```json
{
  "sucesso": true,
  "mensagem": "Aluno cadastrado com sucesso!",
  "dados": {
    "id_aluno": 1,
    "nome_completo": "João da Silva Pereira",
    "cpf": "12345678901",
    "email_login": "joao.silva@aluno.puc.br",
    "tipo_perfil": "ALUNO",
    "criado_em": "2026-05-13T12:00:00.000Z"
  }
}
```

---

#### 2. Demonstração de Validação de Dados

```bash
# Tentativa com e-mail inválido e senha fraca
curl -X POST http://localhost:3333/api/alunos \
  -H "Content-Type: application/json" \
  -d '{ "email_login": "emailinvalido", "senha": "123", "nome_completo": "A", "cpf": "123" }'
```

**Saída Esperada (422 Unprocessable Entity):**
```json
{
  "sucesso": false,
  "mensagem": "Dados inválidos. Verifique os campos enviados.",
  "erros": [
    "E-mail com formato inválido.",
    "A senha deve ter no mínimo 6 caracteres.",
    "Nome completo é obrigatório.",
    "CPF deve conter exatamente 11 dígitos numéricos."
  ]
}
```

---

## 🧪 Testes

### Testes Manuais (via Prisma Studio)

```bash
cd backend
npx prisma studio
```

*Abre uma interface web em **http://localhost:5555** com visualização e edição das tabelas.*

### Testes Automatizados (planejados para releases futuras)

```bash
# Testes unitários dos Services (a implementar)
cd backend
npm run test

# Testes de integração da API (a implementar)
npm run test:integration
```

*Ferramentas planejadas: **Jest** (unitários) + **Supertest** (integração de endpoints).*

> [!NOTE]
> Os endpoints foram testados manualmente via **cURL** e **Postman** durante o desenvolvimento da Release 1. A implementação de testes automatizados está prevista para as próximas releases.

---

## 🔗 Documentações utilizadas

* 📖 **ORM (Back-end):** [Documentação Oficial do **Prisma**](https://www.prisma.io/docs)
* 📖 **Framework (Back-end):** [Documentação Oficial do **Express.js**](https://expressjs.com/pt-br/)
* 📖 **Validação (Back-end):** [Documentação Oficial do **Zod**](https://zod.dev/)
* 📖 **Framework/Biblioteca (Front-end):** [Documentação Oficial do **React**](https://react.dev/reference/react)
* 📖 **Build Tool (Front-end):** [Guia de Configuração do **Vite**](https://vitejs.dev/config/)
* 📖 **Estilização (Front-end):** [Documentação Oficial do **TailwindCSS**](https://tailwindcss.com/docs)
* 📖 **Cliente HTTP (Front-end):** [Documentação do **Axios**](https://axios-http.com/ptbr/docs/intro)
* 📖 **Roteamento (Front-end):** [Documentação do **React Router v6**](https://reactrouter.com/en/main)
* 📖 **Linguagem:** [Manual do **TypeScript**](https://www.typescriptlang.org/docs/)
* 📖 **Guia de Estilo:** [**Conventional Commits** (Padrão de Mensagens)](https://www.conventionalcommits.org/en/v1.0.0/)

---

## 👥 Autores

| 👤 Nome | 🖼️ Foto | :octocat: GitHub | 💼 LinkedIn | 📤 Gmail |
|---------|----------|-----------------|-------------|-----------|
| Lucas Dolabela  | <div align="center"><img src="https://joaopauloaramuni.github.io/image/aramunilogo.png" width="70px" height="70px"></div> | <div align="center"><a href="https://github.com/Dolabelaa"><img src="https://joaopauloaramuni.github.io/image/github6.png" width="50px" height="50px"></a></div> | <div align="center"><a href="https://www.linkedin.com/in/lucas-dolabela"><img src="https://joaopauloaramuni.github.io/image/linkedin2.png" width="50px" height="50px"></a></div> | <div align="center"><a href="mailto:dolabela.dev@gmail.com"><img src="https://joaopauloaramuni.github.io/image/gmail3.png" width="50px" height="50px"></a></div> |
| Vinicius Zegarra  | <div align="center"><img src="https://joaopauloaramuni.github.io/image/aramunilogo.png" width="70px" height="70px"></div> | <div align="center"><a href="https://github.com/"><img src="https://joaopauloaramuni.github.io/image/github6.png" width="50px" height="50px"></a></div> | <div align="center"><a href="https://www.linkedin.com/"><img src="https://joaopauloaramuni.github.io/image/linkedin2.png" width="50px" height="50px"></a></div> | <div align="center"><a href="mailto:vinicius.zegarra@gmail.com"><img src="https://joaopauloaramuni.github.io/image/gmail3.png" width="50px" height="50px"></a></div> |
| Davi Vinicius  | <div align="center"><img src="https://joaopauloaramuni.github.io/image/aramunilogo.png" width="70px" height="70px"></div> | <div align="center"><a href="https://github.com/"><img src="https://joaopauloaramuni.github.io/image/github6.png" width="50px" height="50px"></a></div> | <div align="center"><a href="https://www.linkedin.com/"><img src="https://joaopauloaramuni.github.io/image/linkedin2.png" width="50px" height="50px"></a></div> | <div align="center"><a href="mailto:davi.vinicius@gmail.com"><img src="https://joaopauloaramuni.github.io/image/gmail3.png" width="50px" height="50px"></a></div> |
| Marcos Antunes  | <div align="center"><img src="https://joaopauloaramuni.github.io/image/aramunilogo.png" width="70px" height="70px"></div> | <div align="center"><a href="https://github.com/"><img src="https://joaopauloaramuni.github.io/image/github6.png" width="50px" height="50px"></a></div> | <div align="center"><a href="https://www.linkedin.com/"><img src="https://joaopauloaramuni.github.io/image/linkedin2.png" width="50px" height="50px"></a></div> | <div align="center"><a href="mailto:marcos.antunes@gmail.com"><img src="https://joaopauloaramuni.github.io/image/gmail3.png" width="50px" height="50px"></a></div> |

> [!TIP]
> 💡 **Dica:** Atualize os links de GitHub, LinkedIn e e-mail de cada autor com os dados reais. Prefira fotos profissionais de rosto na coluna de foto.

*Estudantes de **Engenharia de Software** — PUC Minas*

---

## 🤝 Contribuição

1. Faça um `fork` do projeto.
2. Crie uma branch para sua feature (`git checkout -b feature/minha-feature`).
3. Commit suas mudanças (`git commit -m 'feat: Adiciona nova funcionalidade X'`). **(Utilize [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/))**
4. Faça o `push` para a branch (`git push origin feature/minha-feature`).
5. Abra um **Pull Request (PR)** com descrição clara da mudança.

> [!IMPORTANT]
> 📝 **Regras:** Siga os padrões de código já estabelecidos no projeto: nomenclatura em português para variáveis de domínio, comentários explicativos nas camadas de negócio e validação obrigatória em todos os endpoints de escrita.

---

## 🙏 Agradecimentos

Gostaria de agradecer aos seguintes canais e pessoas que foram fundamentais para o desenvolvimento deste projeto:

* [**Engenharia de Software PUC Minas**](https://www.instagram.com/engsoftwarepucminas/) - Pelo apoio institucional, estrutura acadêmica e fomento à inovação e boas práticas de engenharia.
* [**Prof. Dr. João Paulo Aramuni**](https://github.com/joaopauloaramuni) - Pelos valiosos ensinamentos sobre **Arquitetura de Software**, **Padrões de Projeto** e pela orientação durante todas as sprints do laboratório.

---

## 📄 Licença

Este projeto é distribuído sob a **[Licença MIT](https://github.com/Dolabelaa/trabalho-projetoSoftware3/blob/main/LICENSE)**.

---
