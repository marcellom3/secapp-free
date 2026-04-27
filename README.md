# SecApp - Sistema de Medições Corporais

Aplicação web para registro e acompanhamento de medidas corporais com notificação automática no WhatsApp.

![Status](https://img.shields.io/badge/status-stable-success)
![License](https://img.shields.io/badge/license-MIT-blue)

 [![▶️  Ver Demo](https://img.youtube.com/vi/uA79ahqZ7MM/maxresdefault.jpg)](https://youtube.com/shorts/uA79ahqZ7MM)

## 🚀 Funcionalidades

- 🔐 **PIN de Segurança** (4 dígitos) com hash bcrypt
- 📝 **Formulário de Lançamento** de medidas corporais
- 📊 **Comparação Automática** entre medições (última vs. anterior vs. primeira)
- 📱 **Notificação WhatsApp** via Evolution API
- 🎨 **Design Responsivo** e moderno (Tailwind CSS)

## 🛠️ Tecnologias

| Camada | Tecnologia |
|--------|------------|
| Framework | Next.js 14 (App Router) |
| Linguagem | TypeScript |
| Estilização | Tailwind CSS |
| Banco de Dados | Supabase (PostgreSQL) |
| Auth | PIN com bcrypt + sessionStorage |
| WhatsApp | Evolution API |
| Deploy | Vercel |

## 📋 Pré-requisitos

Antes de começar, você precisa ter:

- ✅ **VPS configurada** com Evolution API instalada
- ✅ **Conta no Supabase** (https://supabase.com)
- ✅ **Conta na Vercel** (https://vercel.com)
- ✅ **Conta no GitHub** (https://github.com)
- ✅ **Node.js** instalado (versão LTS recomendada)
- ✅ **Git** instalado

## 🚀 Quick Start

### 1. Clone o Repositório

```bash
git clone https://github.com/marcellom3/secapp-free.git
cd secapp-free
```

### 2. Instale as Dependências

```bash
npm install
```

### 3. Configure as Variáveis de Ambiente

```bash
cp .env.local.example .env.local
```

Edite `.env.local` com seus dados:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Evolution API
EVOLUTION_API_URL=https://api.seudominio.com
EVOLUTION_API_KEY=sua-api-key-aqui
EVOLUTION_INSTANCE_NAME=secapp

# WhatsApp
WHATSAPP_NUMBER=5511999999999
```

### 4. Execute em Desenvolvimento

```bash
npm run dev
```

Acesse `http://localhost:3000`

## 📦 Deploy na Vercel

1. Suba o código para o GitHub
2. Importe o repositório na Vercel
3. Configure as variáveis de ambiente
4. Deploy automático!

> 📖 **Veja o guia completo em [setup.md](./setup.md)**

## 🔐 PIN Padrão

**PIN inicial:** `1234`

⚠️ **Importante:** Altere o PIN após o primeiro acesso! Instruções em [setup.md](./setup.md).

## 📁 Estrutura do Projeto

```
secapp-free/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   └── validate-pin/
│   │   │   │       └── route.ts      # Validação do PIN
│   │   │   └── measurements/
│   │   │       └── route.ts          # CRUD de medições
│   │   ├── dashboard/
│   │   │   └── page.tsx              # Tela de lançamento
│   │   ├── layout.tsx                # Layout principal
│   │   ├── page.tsx                  # Tela de PIN
│   │   └── globals.css               # Estilos globais
│   ├── lib/
│   │   ├── supabase.ts               # Cliente Supabase
│   │   ├── measurements.ts           # Operações de medições
│   │   ├── whatsapp.ts               # Formatação de mensagens
│   │   └── whatsapp-api.ts           # Integração Evolution API
│   └── utils/
│       └── formatters.ts             # Utilitários de formatação
├── .env.local.example                # Modelo de variáveis
├── package.json                      # Dependências
├── setup.md                          # Guia completo de configuração
├── supabase.sql                      # Script do banco de dados
└── README.md                         # Este arquivo
```

## 📊 Como Funciona

1. **Acesso:** Usuário digita PIN de 4 dígitos para acessar
2. **Lançamento:** Preenche peso e cintura (obrigatórios) + opcionais
3. **Comparação:** Sistema compara com medição anterior e primeira
4. **Notificação:** Envia relatório formatado no WhatsApp via Evolution API

### Mensagem do WhatsApp

O relatório enviado inclui:
- Comparação desde o início do projeto
- Comparação com a medição anterior
- Dias de projeto
- Status do IMC

## 🗄️ Banco de Dados

O projeto utiliza as seguintes tabelas no Supabase:

- `measurements` - Armazena todas as medições
- `app_settings` - Configurações (PIN hash)
- `failed_login_attempts` - Controle de tentativas falhas

Veja o script completo em `supabase.sql`.

## 🔒 Segurança

- PIN armazenado com hash bcrypt (12 rounds)
- Sessão expira em 30 minutos
- Row Level Security (RLS) ativado no Supabase
- Registro de tentativas falhas de login

## 📄 Licença

MIT License - veja o arquivo LICENSE para detalhes.

---

**SecApp** © 2026 - Projeto MCE

Desenvolvido por Marcello
