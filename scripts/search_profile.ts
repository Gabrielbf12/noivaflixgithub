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

async function searchProfile() {
    console.log("Searching profiles...");

    const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .or('name.ilike.%Fortunato%,business_name.ilike.%Fortunato%,name.ilike.%Foto%,business_name.ilike.%Foto%');

    if (error) {
        console.error('Error fetching profiles:', error);
        return;
    }

    console.log(`Found ${profiles.length} profiles matching search.`);

    profiles.forEach(p => {
        console.log(`ID: ${p.id}`);
        console.log(`Role: ${p.role}`);
        console.log(`Name: ${p.name}`);
        console.log(`Business Name: ${p.business_name}`);
        console.log(`Onboarding Completed: ${p.onboarding_completed}`);
        console.log('---');
    });
}

searchProfile();
