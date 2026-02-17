-- =====================================================
-- DIAGNÓSTICO: POR QUE NÃO ESTÁ SALVANDO?
-- =====================================================
-- Execute este SQL no Supabase SQL Editor
-- =====================================================

-- 1. Verifique se as colunas de onboarding existem
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name IN ('wedding_date', 'phase', 'budget', 'guest_count', 'onboarding_completed');

-- 2. Verifique se existem políticas de UPDATE
SELECT 
    policyname, 
    cmd, 
    qual, 
    with_check
FROM pg_policies 
WHERE tablename = 'profiles';

-- 3. Verifique se você está logado corretamente (id do usuário atual)
-- Isso deve retornar o ID do usuário que você está tentando atualizar
-- SELECT auth.uid(); 
