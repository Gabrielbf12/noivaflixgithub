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

async function searchProfileByDesc() {
    const searchTerm = "Sou fotógrafo especializado em casamentos";
    console.log(`Searching profiles for description containing: "${searchTerm}"...`);

    const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .ilike('description', `%${searchTerm}%`);

    if (error) {
        console.error('Error fetching profiles:', error);
        return;
    }

    console.log(`Found ${profiles.length} profiles matching description.`);

    profiles.forEach(p => {
        console.log('--- FOUND PROFILE ---');
        console.log(`ID: ${p.id}`);
        console.log(`Role: ${p.role}`);
        console.log(`Name: ${p.name}`);
        console.log(`Business Name: ${p.business_name}`);
        console.log(`Email (if available in profile): ${p.email}`); // Some profiles might have email column if schema allows, or it's just in logging
        console.log(`Onboarding Completed: ${p.onboarding_completed}`);
        console.log('---------------------');
    });

    if (profiles.length > 0) {
        // Also try to get the email from auth if possible (requires admin key usually, but let's see if we can infer anything or if the user is using a different login)
        // Actually, we can't get auth data easily without service key. But getting the ID is huge.
    }
}

searchProfileByDesc();
