# 🔒 Guia de Segurança - SecApp

## Dados Sensíveis que NUNCA Devem Ser Compartilhados

### 1. Arquivo `.env.local`

Este arquivo contém suas credenciais pessoais e **NUNCA** deve ser commitado no GitHub.

```bash
# NUNCA faça isso:
git add .env.local
git commit -m "Add env file"

# O .gitignore já protege este arquivo, mas fique atento!
```

### 2. Chaves do Supabase

- `NEXT_PUBLIC_SUPABASE_URL` - URL do seu projeto
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Chave pública/anon
- `SUPABASE_SERVICE_ROLE_KEY` - **CRÍTICA** - Nunca exponha esta chave no frontend!

### 3. Credenciais da Evolution API

- `EVOLUTION_API_URL` - URL da sua instância
- `EVOLUTION_API_KEY` - Sua chave de API
- `EVOLUTION_INSTANCE_NAME` - Nome da instância

### 4. Número do WhatsApp

- `WHATSAPP_NUMBER` - Seu número pessoal

---

## Boas Práticas

### 1. Use Variáveis de Ambiente na Vercel

Ao invés de commitar `.env.local`, configure as variáveis diretamente na Vercel:

1. Vercel → Project → Settings → Environment Variables
2. Adicione cada variável individualmente
3. Faça deploy novamente

### 2. Repositório Privado

Recomendo manter o repositório como **Privado** no GitHub:

- Settings → Danger Zone → Change repository visibility
- Marque como Private

### 3. Troque o PIN Padrão

O PIN padrão é `1234`. Troque imediatamente após o primeiro uso:

1. Acesse https://bcrypt-generator.com
2. Gere hash para seu novo PIN (12 rounds)
3. Execute no Supabase SQL Editor:

```sql
UPDATE app_settings 
SET value = 'NOVO_HASH_AQUI', 
    updated_at = NOW()
WHERE key = 'pin_hash';
```

### 4. Revise o .gitignore

O arquivo `.gitignore` já protege os arquivos sensíveis, mas verifique sempre antes de commitar:

```bash
git status
```

### 5. Use Branch de Desenvolvimento

Trabalhe em uma branch separada antes de mergear na main:

```bash
git checkout -b dev
# Faça suas alterações
git push origin dev
# Teste e depois faça merge na main
```

---

## O Que Este Projeto já Faz por Você

### ✅ Proteções Implementadas

- **PIN com bcrypt**: Hash de 12 rounds para segurança
- **Sessão temporária**: Expira em 30 minutos
- **RLS no Supabase**: Row Level Security ativado
- **Logging de tentativas**: Registro de falhas de login
- **Cookies seguros**: HttpOnly e SameSite=strict

### ⚠️ O Que Você Precisa Fazer

- [ ] Trocar o PIN padrão (1234)
- [ ] Manter o repositório privado
- [ ] Nunca commitar `.env.local`
- [ ] Usar HTTPS para sua Evolution API (recomendado)
- [ ] Revisar logs periodicamente

---

## Em Caso de Vazamento

### Se suas chaves do Supabase vazarem:

1. Acesse https://supabase.com
2. Vá em Settings → API
3. Clique em "Regenerate" na chave comprometida
4. Atualize as variáveis na Vercel

### Se sua API Key da Evolution vazar:

1. Acesse o painel da Evolution
2. Gere uma nova API Key
3. Atualize na Vercel e no `.env.local`

### Se o PIN vazar:

1. Gere novo hash em https://bcrypt-generator.com
2. Execute o SQL de update no Supabase

---

## Checklist de Segurança

- [ ] Repositório configurado como Privado
- [ ] `.env.local` no `.gitignore` (já incluso)
- [ ] PIN padrão trocado
- [ ] Variáveis de ambiente configuradas na Vercel
- [ ] Evolution API com domínio HTTPS (recomendado)
- [ ] Logs monitorados periodicamente

---

**Segurança é responsabilidade de todos! 🔒**
