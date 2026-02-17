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

async function fixUserRole() {
    const userId = '7955465d-833d-458d-8035-948f9f67d7e7';
    console.log(`Fixing role for user ID: ${userId}...`);

    const { error } = await supabase
        .from('profiles')
        .update({
            role: 'fornecedor',
            // keep onboarding_completed false so they can do the proper vendor onboarding
        })
        .eq('id', userId);

    if (error) {
        console.error('Error updating profile:', error.message);
    } else {
        console.log('Success! Role updated to "fornecedor".');
    }
}

fixUserRole();
