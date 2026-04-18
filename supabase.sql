-- ========================================
-- SECAPP - Criação das Tabelas no Supabase
-- ========================================
-- Execute este script no SQL Editor do Supabase
-- para criar todas as tabelas necessárias

-- Tabela: measurements (armazena suas medições)
CREATE TABLE IF NOT EXISTS measurements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Dados obrigatórios
  peso DECIMAL(5,2) NOT NULL,
  cintura DECIMAL(5,2) NOT NULL,

  -- Dados opcionais
  gordura_corporal DECIMAL(5,2),
  gordura_visceral INTEGER,
  massa_muscular DECIMAL(5,2),
  idade_corporal INTEGER,
  rm_basal DECIMAL(8,2),
  imc DECIMAL(4,2),

  -- Controle
  user_id TEXT DEFAULT 'single-user'
);

-- Tabela: app_settings (armazena configurações como o PIN)
CREATE TABLE IF NOT EXISTS app_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela: failed_login_attempts (controle de tentativas falhas)
CREATE TABLE IF NOT EXISTS failed_login_attempts (
  id SERIAL PRIMARY KEY,
  ip_address TEXT,
  attempted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para limpeza automática de tentativas
CREATE INDEX IF NOT EXISTS idx_failed_attempts_time
ON failed_login_attempts(attempted_at);

-- ========================================
-- CONFIGURAÇÃO INICIAL DO PIN
-- ========================================
-- O PIN inicial será: 1234
-- Você poderá mudar depois pela própria aplicação
-- O hash abaixo é do PIN "1234" com bcrypt (12 rounds)

INSERT INTO app_settings (key, value)
VALUES ('pin_hash', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzS3MebAJu')
ON CONFLICT (key) DO NOTHING;

-- ========================================
-- POLÍTICAS DE SEGURANÇA (RLS)
-- ========================================

-- Ativar Row Level Security
ALTER TABLE measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Política: qualquer um pode INSERT (via API segura)
CREATE POLICY "Allow insert measurements" ON measurements
  FOR INSERT WITH CHECK (true);

-- Política: leitura pública bloqueada (só via API)
-- Nota: As queries de leitura serão feitas via API Routes do Next.js
-- que não passam pelo RLS do Supabase

-- ========================================
-- FUNÇÃO PARA LIMPAR TENTATIVAS ANTIGAS
-- ========================================

CREATE OR REPLACE FUNCTION clean_old_failed_attempts()
RETURNS void AS $$
BEGIN
  DELETE FROM failed_login_attempts
  WHERE attempted_at < NOW() - INTERVAL '1 hour';
END;
$$ LANGUAGE plpgsql;
