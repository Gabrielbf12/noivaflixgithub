-- =====================================================
-- SOLUÇÃO DEFINITIVA: Trigger com Tratamento de Erros
-- =====================================================
-- Execute este SQL no Supabase SQL Editor
-- =====================================================

-- Passo 1: Remover trigger antigo se existir
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Passo 2: Remover função antiga se existir
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Passo 3: Criar nova função com tratamento robusto de erros
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Tentar inserir o perfil
  INSERT INTO public.profiles (
    id,
    full_name,
    email,
    role,
    subscription_status,
    trial_ends_at,
    created_at
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'noiva'),
    'trialing',
    NOW() + INTERVAL '7 days',
    NOW()
  )
  ON CONFLICT (id) DO NOTHING; -- Ignora se já existe
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log o erro mas NÃO falha o signup
    RAISE WARNING 'Erro ao criar perfil para usuário %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Passo 4: Criar o trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Passo 5: Verificar se funcionou
SELECT 
  trigger_name, 
  event_object_table, 
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- =====================================================
-- IMPORTANTE: Depois de executar, teste criar um usuário
-- =====================================================
