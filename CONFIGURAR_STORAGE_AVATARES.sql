-- SCRIPT PARA CRIAR O BUCKET DE AVATARES E CONFIGURAR PERMISSÕES
-- Execute este script no SQL Editor do Supabase.

-- 1. Cria o bucket 'avatars' se não existir
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Permite que qualquer pessoa veja as fotos (Bucket Público)
CREATE POLICY "Avatares Públicos"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- 3. Permite que usuários autenticados façam upload de suas próprias fotos
CREATE POLICY "Upload de Avatares Autenticados"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.role() = 'authenticated'
);

-- 4. Permite que usuários atualizem ou deletem suas próprias fotos
CREATE POLICY "Atualizar Próprio Avatar"
ON storage.objects FOR UPDATE
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1])
WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Deletar Próprio Avatar"
ON storage.objects FOR DELETE
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
