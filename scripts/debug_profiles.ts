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

async function debugProfiles() {
    const userId = '7955465d-833d-458d-8035-948f9f67d7e7';
    console.log(`Debugging profiles for ID: ${userId}...`);

    // 1. List all profiles with this ID (should be 1)
    const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId);

    if (error) {
        console.error('Error fetching profiles:', error.message);
    } else {
        console.log(`Found ${profiles?.length} profiles with this ID.`);
        profiles?.forEach(p => {
            console.log(p);
        });
    }

    // 2. List all profiles created recently to see if there's another one
    console.log('--- Recent Profiles ---');
    const { data: recentProfiles } = await supabase
        .from('profiles')
        .select('id, name, role, created_at, onboarding_completed')
        .order('created_at', { ascending: false })
        .limit(5);

    recentProfiles?.forEach(p => {
        console.log(`ID: ${p.id}, Role: ${p.role}, Name: ${p.name}, Onboarding: ${p.onboarding_completed}, Created: ${p.created_at}`);
    });
}

debugProfiles();
