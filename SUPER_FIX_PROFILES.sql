-- =====================================================
-- SUPER FIX: TABELA PROFILES (COLUNAS E PERMISSÕES)
-- =====================================================
-- 1. GARANTIR QUE AS COLUNAS EXISTEM
-- =====================================================
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS wedding_date DATE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phase TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS budget NUMERIC;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS guest_count TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS business_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS state TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'noiva';

-- =====================================================
-- 2. RE-APLICAR POLÍTICAS (PARA TER CERTEZA)
-- =====================================================
-- Removemos as antigas para evitar conflitos
DROP POLICY IF EXISTS "Users can insert own profile during signup" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

-- Criamos as novas com permissões totais para o próprio usuário
CREATE POLICY "Allow individual insert" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Allow individual update" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Allow individual select" ON public.profiles FOR SELECT USING (auth.uid() = id);

-- = ::::::::::::::::::::::::::::::::::::::::::::::::: : --
-- VERIFICAÇÃO FINAL (O QUE DEVE APARECER NO RESULTADO)
-- = ::::::::::::::::::::::::::::::::::::::::::::::::: : --
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND table_schema = 'public';
