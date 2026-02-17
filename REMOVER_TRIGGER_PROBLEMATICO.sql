-- REMOVE O TRIGGER ANTIGO QUE ESTAVA TENTANDO USAR A COLUNA 'full_name'
-- Isso evitará o erro "Could not find the 'full_name' column" ao criar conta.

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- A criação do perfil agora é feita diretamente pelo sistema (Front-end) 
-- para garantir que o trial de 7 dias e o nome sejam salvos corretamente.

-- Opcional: Recarregar o cache do PostgREST para garantir que as colunas novas apareçam
NOTIFY pgrst, 'reload schema';
