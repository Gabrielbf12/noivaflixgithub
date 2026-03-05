import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Setup Supabase Client
const supabaseUrl = process.env.VITE_SUPABASE_URL!;
// Usar ANON KEY (Pode depender de RLS para update), ou tentar bypass.
// Caso o RLS impeça, a mensagem de erro mostrará e precisaremos do Service Role.
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function grantLifetime() {
    const targetEmail = 'yasminsilva12@gmail.com';
    console.log(`Buscando usuário por email: ${targetEmail}`);

    const { data: profiles, error: fetchErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', targetEmail);

    if (fetchErr) {
        console.error('Erro ao buscar perfil:', fetchErr.message);
        return;
    }

    if (!profiles || profiles.length === 0) {
        console.error(`O usuário com email ${targetEmail} não foi encontrado na tabela profiles.`);
        return;
    }

    const user = profiles[0];
    console.log(`Usuário encontrado: ${user.name} (ID: ${user.id})`);

    console.log('Atualizando para Premium Vitalício...');

    // Tentativa de update (Sujeita a RLS)
    const { data, error: updateErr } = await supabase
        .from('profiles')
        .update({
            plan: 'Premium',
            subscription_status: 'active'
        })
        .eq('id', user.id)
        .select();

    if (updateErr) {
        console.error('Falha ao atualizar o perfil. O RLS (Row Level Security) pode estar bloqueando a atualização via Anon Key:', updateErr.message);
    } else {
        console.log('✅ SUCESSO! O usuário agora é Premium Vitalício:', data[0]);
    }
}

grantLifetime();
