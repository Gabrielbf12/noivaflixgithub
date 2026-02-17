-- =====================================================
-- CORREÇÃO DE VISIBILIDADE DE FORNECEDORES
-- =====================================================
-- O problema de "Fornecedor não aparece" ocorre porque as
-- políticas de segurança (RLS) atuais só permitem ver o próprio perfil.

-- 1. Permitir que QUALQUER usuário autenticado (Noiva, Admin, etc) veja os Fornecedores
CREATE POLICY "Authenticated users can view vendors"
ON public.profiles
FOR SELECT
TO authenticated
USING ( role = 'fornecedor' );

-- 2. Permitir que o Admin veja TODOS os perfis (para a aba Noivas e Fornecedores)
-- Se você ainda não tem RLS habilitado para admins, pode adicionar:
-- CREATE POLICY "Admins can view all profiles"
-- ON public.profiles
-- FOR SELECT
-- TO authenticated
-- USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));
-- (Mas a política de vendors acima já resolve o problema principal)

-- Para aplicar: Copie e cole este código no SQL Editor do Supabase.
