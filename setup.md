# 📘 Guia Completo de Configuração - SecApp

> **Siga estes passos na ordem exata**. Cada seção contém o que fazer e como fazer.

---

## 📋 Pré-requisitos Obrigatórios

Antes de começar, você **DEVE** ter:

- ✅ **VPS configurada** com Evolution API instalada e rodando
- ✅ **Conta no Supabase** (https://supabase.com)
- ✅ **Conta na Vercel** (https://vercel.com)
- ✅ **Conta no GitHub** (https://github.com)
- ✅ **Node.js instalado** no seu computador (versão LTS)
- ✅ **Git instalado** no seu computador

> ⚠️ **Importante:** Este guia não ensina a instalar a Evolution API ou criar contas. Pressupõe-se que você já tenha tudo isso configurado.

---

## 🔧 PASSO 1: Criar Banco de Dados no Supabase

### 1.1 Acesse o Supabase

1. Vá para https://supabase.com
2. Faça login na sua conta
3. Clique em **"New Project"** ou selecione um projeto existente

### 1.2 Criar as Tabelas

1. No menu lateral esquerdo, clique em **"SQL Editor"**
2. Clique em **"New Query"**
3. Copie e cole **TODO** o conteúdo do arquivo `supabase.sql` (incluído neste repositório) no editor
4. Clique no botão **"Run"** (ou pressione `Ctrl+Enter`)
5. Aguarde a mensagem de sucesso no rodapé

### 1.3 Obter as Credenciais

1. No menu lateral, clique em **"Settings"** (ícone de engrenagem)
2. Clique em **"API"**
3. Anote estas duas informações:
   - **Project URL** (ex: `https://xxxxx.supabase.co`)
   - **anon/public key** (chave longa que começa com `eyJ...`)

> ⚠️ **Importante:** Não compartilhe essas chaves!

---

## 🔧 PASSO 2: Configurar Evolution API na VPS

### 2.1 Verificar se a Evolution API está rodando

Acesse sua VPS via SSH e execute:

```bash
docker ps | grep evolution
```

Você deve ver algo como:
```
abc123def456   evolution-api   "docker-entrypoint…"   2 days ago   Up 2 days
```

### 2.2 Obter a URL e API Key

**URL da API:**
- Se configurou domínio: `https://seu-dominio.com`
- Se usa IP direto: `http://SEU_IP:8080`

**Para obter a API Key:**

1. Acesse o painel da Evolution no navegador (`http://SEU_IP:8080` ou `https://seu-dominio.com`)
2. Faça login (se tiver senha)
3. Vá em **"API Key"** ou **"Settings"**
4. Copie a **API Key** (chave longa)

### 2.3 Configurar uma Instância do WhatsApp

Se ainda não tem uma instância:

1. No painel da Evolution, clique em **"Create Instance"**
2. Dê o nome: `secapp`
3. Clique em **Create**
4. Um QR Code aparecerá
5. Abra o WhatsApp no celular → Aparelhos conectados → Conectar aparelho
6. Escaneie o QR Code
7. Anote o nome da instância (ex: `secapp`)

---

## 🔧 PASSO 3: Clonar e Configurar o Projeto

### 3.1 Clonar o Repositório

```bash
# Clone o repositório
git clone https://github.com/marcellom3/secapp-free.git

# Acesse a pasta
cd secapp-free
```

### 3.2 Instalar Dependências

```bash
npm install
```

### 3.3 Configurar Variáveis de Ambiente

1. Copie o arquivo de exemplo:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edite o arquivo `.env.local` e preencha com **SEUS** dados:

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

### 3.4 Testar Localmente (Opcional)

```bash
# Rodar em desenvolvimento
npm run dev
```

Acesse `http://localhost:3000` e teste com o PIN `1234`.

---

## 🔧 PASSO 4: Subir para o GitHub

### 4.1 Configurar Git (se for a primeira vez)

```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu-email@email.com"
```

### 4.2 Criar Repositório no GitHub

1. Acesse https://github.com
2. Faça login
3. Clique no **"+"** → **"New repository"**
4. Preencha:
   - **Repository name:** `secapp-free`
   - **Description:** `Web app para medições corporais com notificação WhatsApp`
   - **Public** ou **Private** (recomendo Private)
   - **NÃO** marque "Initialize with README"
5. Clique em **"Create repository"**

### 4.3 Subir o Código

```bash
git init
git add .
git commit -m "Initial commit - SecApp"
git branch -M main
git remote add origin https://github.com/marcellom3/secapp-free.git
git push -u origin main
```

> ⚠️ **Substitua** `SEU_USUARIO` pelo seu usuário do GitHub

---

## 🔧 PASSO 5: Deploy na Vercel

### 5.1 Importar o Projeto

1. Vá para https://vercel.com
2. Faça login (pode usar conta do GitHub)
3. Clique em **"Add New..."** → **"Project"**
4. Em **"Import Git Repository"**, selecione o repositório `secapp-free`
5. Clique em **"Import"**

### 5.2 Configurar Variáveis de Ambiente

Na tela de configuração, clique em **"Environment Variables"** → **"Add"**

Adicione **UMA POR UMA** estas variáveis:

| Nome | Valor |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do seu projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave anon/public do Supabase |
| `EVOLUTION_API_URL` | URL da sua Evolution API |
| `EVOLUTION_API_KEY` | API Key da Evolution |
| `EVOLUTION_INSTANCE_NAME` | Nome da instância (ex: `secapp`) |
| `WHATSAPP_NUMBER` | Seu número (ex: `5511999999999`) |

**Exemplo de preenchimento:**

```
NEXT_PUBLIC_SUPABASE_URL = https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbG...
EVOLUTION_API_URL = https://api.seudominio.com
EVOLUTION_API_KEY = abc123def456...
EVOLUTION_INSTANCE_NAME = secapp
WHATSAPP_NUMBER = 5511999999999
```

### 5.3 Fazer o Deploy

1. Clique em **"Deploy"**
2. Aguarde alguns minutos
3. Quando estiver pronto, você verá um link: `https://secapp-xxxx.vercel.app`

---

## 🔧 PASSO 6: Testar a Aplicação

### 6.1 Acessar o App

1. Abra o link da Vercel no navegador
2. Você verá a tela de PIN

### 6.2 Testar o PIN

**PIN inicial:** `1234`

1. Digite `1234` no teclado numérico
2. Clique em **OK**
3. Você deve acessar a tela de lançamento

### 6.3 Fazer Primeiro Lançamento

1. Preencha **Peso** e **Cintura** (obrigatórios)
2. Preencha os opcionais se quiser
3. Clique em **"Salvar Medidas"**
4. Aguarde alguns segundos
5. Verifique seu WhatsApp - você deve receber a mensagem!

---

## 🔧 PASSO 7: Mudar o PIN (Recomendado!)

Após o primeiro acesso, **MUDE** o PIN para algo pessoal:

### 7.1 Gerar Novo Hash

1. Vá em https://bcrypt-generator.com
2. Digite seu novo PIN de 4 dígitos (ex: `5678`)
3. Rounds: `12`
4. Clique em **Generate**
5. Copie o hash gerado

### 7.2 Atualizar no Supabase

1. No Supabase → **SQL Editor**
2. Execute:

```sql
UPDATE app_settings 
SET value = 'COLE_O_NOVO_HASH_AQUI', 
    updated_at = NOW()
WHERE key = 'pin_hash';
```

3. Substitua `COLE_O_NOVO_HASH_AQUI` pelo hash gerado
4. Execute o comando

Pronto! Novo PIN configurado!

---

## 🛠️ Solução de Problemas

### ❌ "PIN inválido" mesmo digitando 1234

**Solução:** O hash pode não ter sido criado corretamente.

1. No Supabase → SQL Editor, execute:
```sql
SELECT * FROM app_settings WHERE key = 'pin_hash';
```

2. Se estiver vazio ou diferente, recrie:
```sql
DELETE FROM app_settings WHERE key = 'pin_hash';
INSERT INTO app_settings (key, value) 
VALUES ('pin_hash', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzS3MebAJu');
```

### ❌ Mensagem do WhatsApp não chega

**Verifique:**

1. A Evolution API está rodando na VPS?
   ```bash
   docker ps | grep evolution
   ```

2. A instância está conectada? (QR Code escaneado?)

3. O número está no formato correto? (55 + DDD + número, sem traços)

4. Teste a API manualmente:
   ```bash
   curl -X POST http://SEU_IP:8080/message/sendText/secapp \
     -H "Content-Type: application/json" \
     -H "apikey: SUA_API_KEY" \
     -d '{"number": "5511999999999", "textMessage": {"text": "teste"}}'
   ```

### ❌ Deploy na Vercel falhou

1. Verifique as **Environment Variables** (estão corretas?)
2. Verifique os **Logs** do deploy na Vercel
3. Tente redeploy: Vercel → Project → Deployments → ⋯ → Redeploy

### ❌ Erro de conexão com Supabase

1. Verifique se a URL está correta (https://xxxxx.supabase.co)
2. Verifique se a chave anon está completa
3. Teste no navegador: `https://SUA_URL/supabase/rest/v1/measurements`

---

## 📚 Comandos Úteis

### Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar produção
npm start
```

### Na VPS (Evolution API)

```bash
# Ver se a Evolution está rodando
docker ps | grep evolution

# Reiniciar a Evolution
docker restart $(docker ps -q --filter "name=evolution")

# Ver logs da Evolution
docker logs -f $(docker ps -q --filter "name=evolution")

# Verificar porta 8080
netstat -tulpn | grep 8080
```

---

## ✅ Checklist de Conclusão

- [ ] Tabelas criadas no Supabase
- [ ] Credenciais do Supabase anotadas
- [ ] Evolution API verificada na VPS
- [ ] Instância do WhatsApp conectada
- [ ] Repositório criado no GitHub
- [ ] Código subido para o GitHub
- [ ] Projeto importado na Vercel
- [ ] Variáveis de ambiente configuradas na Vercel
- [ ] Deploy realizado com sucesso
- [ ] PIN testado (1234)
- [ ] Primeiro lançamento feito
- [ ] Mensagem do WhatsApp recebida
- [ ] PIN alterado para valor pessoal

---

## 📞 Precisa de Ajuda?

1. Verifique este guia passo a passo
2. Confira os logs de erro (Vercel, Supabase, Evolution)
3. Teste cada parte isoladamente

---

**🎉 Parabéns! Seu SecApp está no ar!**
