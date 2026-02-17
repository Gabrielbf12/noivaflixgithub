-- SCRIPT PARA CORRIGIR DADOS DE USUÁRIOS EXISTENTES
-- Se você criou a conta da Yasmin e o nome não apareceu, rode este script.

-- 1. Garante que a coluna 'name' existe e não 'full_name'
-- (Isso já deve estar certo, mas por segurança)
DO $$ 
BEGIN 
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='full_name') THEN
        ALTER TABLE public.profiles RENAME COLUMN full_name TO name;
    END IF;
END $$;

-- 2. Tenta recuperar o nome do metadado do Auth para quem está com nome vazio
UPDATE public.profiles p
SET name = (u.raw_user_meta_data->>'name')
FROM auth.users u
WHERE p.id = u.id 
AND (p.name IS NULL OR p.name = '');

-- 3. Caso o metadado use 'full_name', tenta recuperar dele também
UPDATE public.profiles p
SET name = (u.raw_user_meta_data->>'full_name')
FROM auth.users u
WHERE p.id = u.id 
AND (p.name IS NULL OR p.name = '');

-- 4. Garante o trial de 7 dias para todos que não tem data de expiração
UPDATE public.profiles
SET 
    subscription_status = 'trialing',
    trial_ends_at = NOW() + INTERVAL '7 days'
WHERE trial_ends_at IS NULL 
AND subscription_status != 'active';
