-- =====================================================
-- ADICIONAR COLUNAS DE ONBOARDING NA TABELA PROFILES
-- =====================================================
-- Execute este SQL no Supabase SQL Editor
-- =====================================================

-- Adicionar colunas para Noivas
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS wedding_date DATE,
ADD COLUMN IF NOT EXISTS phase TEXT CHECK (phase IN ('acabei_noivar', 'fechei_fornecedores', 'falta_pouco', 'estou_perdida')),
ADD COLUMN IF NOT EXISTS budget NUMERIC,
ADD COLUMN IF NOT EXISTS guest_count TEXT,
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;

-- Adicionar colunas para Fornecedores
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS business_name TEXT,
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT;

-- =====================================================
-- Verificar se as colunas foram criadas
-- =====================================================
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'profiles' AND table_schema = 'public'
ORDER BY ordinal_position;
