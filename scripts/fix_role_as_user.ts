import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.VITE_SUPABASE_ANON_KEY!
);

async function fixAsUser() {
    const email = 'fortunatofotocine@gmail.com';
    // Using the user's real password provided earlier
    const password = '31521635';

    console.log(`Logging in as ${email}...`);
    const { data: { session }, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (loginError || !session) {
        console.error('Login failed:', loginError);
        return;
    }

    console.log('Login successful. ID:', session.user.id);

    // Check current profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

    console.log('Current Profile State (before update):', profile?.role, profile?.onboarding_completed);

    // Update profile with FULL data including portfolio from the "lost" profile
    const updateData = {
        role: 'fornecedor',
        name: 'Fortunato Fotocine',
        business_name: 'Fortunato Fotocine',
        category: 'Fotografia',
        description: 'Sou fotógrafo especializado em casamentos e apaixonado por contar histórias reais através da imagem. Mais do que registrar momentos, eu capturo emoções, olhares, abraços e cada detalhe que transforma o seu grande dia em uma memória eterna.\n\nAcredito que cada casamento é único, por isso busco entender a essência de cada casal para entregar fotos autênticas, naturais e cheias de significado. Meu compromisso é fazer você se sentir segura, tranquila e confiante, enquanto eu transformo sentimentos em lembranças que durarão para sempre.',
        experience_years: 10,
        instagram: '@fortunatofotocine',
        website: 'https://www.instagram.com/fortunatofotocine/',

        // Portfolio images recovered from the lost profile
        portfolio: [
            'https://vdopngpciznhwialsiuu.supabase.co/storage/v1/object/public/wedding-images/vendors/portfolio/e22a3758-d3a1-4326-8657-8d435d00d068-0.09869202090604579.jpg',
            'https://vdopngpciznhwialsiuu.supabase.co/storage/v1/object/public/wedding-images/vendors/portfolio/e22a3758-d3a1-4326-8657-8d435d00d068-0.9650187613526074.jpg',
            'https://vdopngpciznhwialsiuu.supabase.co/storage/v1/object/public/wedding-images/vendors/portfolio/e22a3758-d3a1-4326-8657-8d435d00d068-0.6771917478690826.jpg',
            'https://vdopngpciznhwialsiuu.supabase.co/storage/v1/object/public/wedding-images/vendors/portfolio/e22a3758-d3a1-4326-8657-8d435d00d068-0.120942336535382.jpg',
            'https://vdopngpciznhwialsiuu.supabase.co/storage/v1/object/public/wedding-images/vendors/portfolio/e22a3758-d3a1-4326-8657-8d435d00d068-0.16326430798335279.jpg',
            'https://vdopngpciznhwialsiuu.supabase.co/storage/v1/object/public/wedding-images/vendors/portfolio/e22a3758-d3a1-4326-8657-8d435d00d068-0.4627648869604767.jpg'
        ],
        avatar_url: 'https://vdopngpciznhwialsiuu.supabase.co/storage/v1/object/public/wedding-images/vendors/avatars/e22a3758-d3a1-4326-8657-8d435d00d068-0.7701054014580339.png',

        onboarding_completed: true,
        subscription_status: 'active'
    };

    const { error: updateError } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', session.user.id);

    if (updateError) {
        console.error('Update failed:', updateError);
    } else {
        console.log('✅ Profile FULLY updated with images as the user.');
    }
}

fixAsUser();
