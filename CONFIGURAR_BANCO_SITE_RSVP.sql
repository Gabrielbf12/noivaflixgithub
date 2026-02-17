-- SCRIPT PARA PERSISTÊNCIA DO SITE E RSVP
-- Execute este script no SQL Editor do Supabase.

-- 1. Tabela para configurações do Site de Casamento
CREATE TABLE IF NOT EXISTS public.wedding_sites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    slug TEXT UNIQUE NOT NULL,
    theme TEXT DEFAULT 'Classic',
    bride_name TEXT,
    groom_name TEXT,
    wedding_date DATE,
    wedding_time TIME,
    location_name TEXT,
    location_address TEXT,
    location_url TEXT,
    headline TEXT,
    story TEXT,
    hero_image TEXT,
    album TEXT[] DEFAULT '{}',
    rsvp_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS para wedding_sites
ALTER TABLE public.wedding_sites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sites são visíveis por todos" ON public.wedding_sites
    FOR SELECT USING (true);

CREATE POLICY "Usuários podem criar seu próprio site" ON public.wedding_sites
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seu próprio site" ON public.wedding_sites
    FOR UPDATE USING (auth.uid() = user_id);

-- 2. Tabela para respostas de RSVP
CREATE TABLE IF NOT EXISTS public.rsvp_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id UUID REFERENCES public.wedding_sites(id) ON DELETE CASCADE,
    guest_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    confirmed BOOLEAN DEFAULT true,
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS para rsvp_responses
ALTER TABLE public.rsvp_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "RSVPs são visíveis apenas para o dono do site" ON public.rsvp_responses
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.wedding_sites 
            WHERE id = rsvp_responses.site_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Qualquer pessoa pode enviar RSVP" ON public.rsvp_responses
    FOR INSERT WITH CHECK (true);

-- Trigger para atualizar o timestamp updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_wedding_sites_updated_at
    BEFORE UPDATE ON public.wedding_sites
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
