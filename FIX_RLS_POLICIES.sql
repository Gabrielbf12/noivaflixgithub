-- =====================================================
-- CORRIGIR RLS (Row Level Security) DA TABELA PROFILES
-- =====================================================
-- Execute este SQL no Supabase SQL Editor
-- =====================================================

-- Passo 1: Verificar políticas existentes
SELECT 
    policyname, 
    permissive, 
    roles, 
    cmd, 
    qual
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'profiles';

-- Passo 2: Criar política para permitir INSERT durante signup
-- Esta política permite que qualquer usuário autenticado crie seu próprio perfil
CREATE POLICY "Users can insert own profile during signup"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Passo 3: Garantir que usuários podem ler seu próprio perfil
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Passo 4: Garantir que usuários podem atualizar seu próprio perfil
CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- =====================================================
-- IMPORTANTE: Se já existirem políticas com esses nomes,
-- você verá um erro "already exists". Isso é OK!
-- =====================================================
