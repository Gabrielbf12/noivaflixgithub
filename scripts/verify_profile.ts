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

async function verifyProfileState() {
    const userId = '7955465d-833d-458d-8035-948f9f67d7e7';
    console.log(`Verifying state for user ID: ${userId}...`);

    const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) {
        console.error('Error fetching profile:', error.message);
    } else {
        console.log('--- Current DB State ---');
        console.log(`ID: ${profile.id}`);
        console.log(`Role: ${profile.role}`);
        console.log(`Onboarding Completed: ${profile.onboarding_completed}`);
        console.log(`Name: ${profile.name}`);
        console.log(`Business Name: ${profile.business_name}`);
        console.log(`Updated At: ${profile.updated_at}`);
        console.log('------------------------');
    }
}

verifyProfileState();
