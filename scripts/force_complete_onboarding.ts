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

async function forceCompleteOnboarding() {
    const userId = '7955465d-833d-458d-8035-948f9f67d7e7';
    console.log(`Forcing onboarding complete for user ID: ${userId}...`);

    // We need to fill in some required fields so the dashboard doesn't crash or look empty
    const updateData = {
        role: 'fornecedor',
        onboarding_completed: true,
        business_name: 'Fortunato Fotocine',
        category: 'Fotografia', // Inferred from email
        city: 'São Paulo', // Default
        state: 'SP',       // Default
        description: 'Fotografia e Filmagem para Casamentos.',
        subscription_status: 'active' // Giving them premium/active status to ensure they see everything
    };

    const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', userId);

    if (error) {
        console.error('Error updating profile:', error.message);
    } else {
        console.log('Success! Profile updated and onboarding marked as complete.');
    }
}

forceCompleteOnboarding();
