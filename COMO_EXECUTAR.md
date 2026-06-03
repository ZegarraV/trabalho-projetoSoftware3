# 🚀 Como Executar o Projeto Unicred

## Pré-requisitos
- Node.js 18+
- PostgreSQL rodando
- Conta Gmail com App Password configurada

## 1. Backend

### Instalar dependências
```bash
cd backend
npm install
```

### Configurar o .env
O arquivo `.env` já vem configurado com as credenciais de e-mail.
Altere apenas o `DATABASE_URL` conforme seu PostgreSQL:
```
DATABASE_URL="postgresql://SEU_USUARIO:SUA_SENHA@localhost:5432/moeda_estudantil"
```

### Criar o banco e aplicar migrações
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### Iniciar o servidor
```bash
npm run dev
# Servidor rodando em http://localhost:3333
```

## 2. Frontend

### Instalar dependências
```bash
cd frontend
npm install
```

### Iniciar o frontend
```bash
npm run dev
# Frontend rodando em http://localhost:5173
```

## 📧 E-mail Configurado

O sistema está configurado com Gmail para enviar e-mails reais:
- **Envio de créditos**: notifica o aluno e o professor
- **Resgate de vantagem**: envia o cupom ao aluno
- **Validação de cupom**: confirma ao aluno que foi validado

## 🎁 Novidades nesta versão

### Cadastro de Vantagens (Empresa)
- Formulário completo com nome, descrição, custo e foto
- Pré-visualização da imagem antes de salvar
- Listagem de vantagens cadastradas
- Edição e desativação de vantagens existentes

### Interface Melhorada
- Design modernizado do Login com painel visual
- Sidebar redesenhada com badge de perfil
- Formulário de cadastro de vantagens completo

### E-mail Real (Gmail)
- Templates HTML melhorados e responsivos
- Envio automático em todas as operações relevantes
