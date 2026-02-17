-- SCRIPT PARA ADICIONAR COLUNAS DE FORNECEDOR NA TABELA PROFILES
-- Execute este script no SQL Editor do seu projeto Supabase

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS business_name TEXT,
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS experience_years INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS instagram TEXT,
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS portfolio TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS leads INTEGER DEFAULT 0;

-- Recarrega o cache do PostgREST para garantir que o erro "not find column" desapareça
NOTIFY pgrst, 'reload schema';
