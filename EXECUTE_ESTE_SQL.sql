-- =====================================================
-- SOLUÇÃO RÁPIDA: Apenas desabilite o trigger
-- =====================================================
-- Copie APENAS estas 2 linhas e execute no Supabase SQL Editor
-- =====================================================

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Pronto! Agora o cadastro vai funcionar via código client-side
