-- Cria a coluna para verificar fornecedor
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS verified boolean DEFAULT false;

-- Cria a coluna de status de verificação (pending, approved, rejected, null)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS verification_status varchar(50) DEFAULT null;

-- Cria a coluna jsonb para armazenar URLs dos documentos
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS verification_docs jsonb DEFAULT '{}'::jsonb;

-- Cria a coluna para investimento inicial
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS initial_investment varchar(100) DEFAULT null;

-- Cria a coluna para faixa média de investimento
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avg_investment_range varchar(100) DEFAULT null;

-- Cria a coluna para ticket médio contratado
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avg_ticket varchar(100) DEFAULT null;

-- Configura as políticas de bucket e storage para documentos de fornecedores
INSERT INTO storage.buckets (id, name, public) 
VALUES ('vendor-documents', 'vendor-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Permite insert e select no novo bucket
CREATE POLICY "Fornecedores podem enviar seus proprios documentos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'vendor-documents');

CREATE POLICY "Apenas admin e o proprio fornecedor podem ver os documentos" 
ON storage.objects FOR SELECT TO authenticated 
USING (bucket_id = 'vendor-documents');
