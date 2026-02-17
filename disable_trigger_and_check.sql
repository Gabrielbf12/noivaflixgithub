-- =====================================================
-- DESABILITAR TRIGGER E VERIFICAR TABELA
-- =====================================================
-- Execute este SQL para desabilitar o trigger problemático
-- e verificar a estrutura da tabela profiles
-- =====================================================

-- Passo 1: DESABILITAR o trigger que está causando o erro
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Passo 2: Verificar se a tabela profiles existe
SELECT table_name, table_schema
FROM information_schema.tables
WHERE table_name = 'profiles';

-- Passo 3: Ver a estrutura da tabela profiles
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'profiles' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Passo 4: Se a tabela NÃO existir, crie-a com este comando:
/*
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    email TEXT,
    role TEXT DEFAULT 'noiva',
    subscription_status TEXT DEFAULT 'trialing',
    trial_ends_at TIMESTAMPTZ,
    wedding_date DATE,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Política: usuários podem ler e atualizar seu próprio perfil
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- Política: permitir INSERT durante signup (service_role)
CREATE POLICY "Enable insert for authenticated users"
    ON public.profiles FOR INSERT
    WITH CHECK (true);
*/

-- =====================================================
-- IMPORTANTE: Depois de executar, o cadastro vai funcionar
-- via código client-side (AuthScreen.tsx)
-- =====================================================
