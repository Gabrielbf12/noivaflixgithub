-- SCRIPT PARA CRIAR O BUCKET DE IMAGENS DO SITE E CONFIGURAR PERMISSÕES
-- Execute este script no SQL Editor do Supabase.

-- 1. Cria o bucket 'wedding-images' se não existir
INSERT INTO storage.buckets (id, name, public)
VALUES ('wedding-images', 'wedding-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Permite que qualquer pessoa veja as fotos (Bucket Público para o Site)
CREATE POLICY "Imagens do Site Públicas"
ON storage.objects FOR SELECT
USING (bucket_id = 'wedding-images');

-- 3. Permite que usuários autenticados façam upload de suas próprias fotos
CREATE POLICY "Upload de Imagens do Site"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'wedding-images' 
    AND auth.role() = 'authenticated'
);

-- 4. Permite que usuários atualizem ou deletem suas próprias fotos
CREATE POLICY "Atualizar Próprias Imagens do Site"
ON storage.objects FOR UPDATE
USING (bucket_id = 'wedding-images' AND auth.uid()::text = (storage.foldername(name))[1])
WITH CHECK (bucket_id = 'wedding-images');

CREATE POLICY "Deletar Próprias Imagens do Site"
ON storage.objects FOR DELETE
USING (bucket_id = 'wedding-images' AND auth.uid()::text = (storage.foldername(name))[1]);
