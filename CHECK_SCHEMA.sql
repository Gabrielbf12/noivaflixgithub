-- =====================================================
-- VERIFICAR ESTRUTURA DA TABELA PROFILES
-- =====================================================
-- Execute este SQL para ver quais colunas existem
-- =====================================================

SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'profiles' AND table_schema = 'public'
ORDER BY ordinal_position;

-- =====================================================
-- Depois de ver os resultados, me envie a lista de colunas!
-- =====================================================
