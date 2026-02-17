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

async function listProfiles() {
    console.log("Listing profiles...");

    const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .limit(50);

    if (error) {
        console.error('Error fetching profiles:', error);
        return;
    }

    console.log(`Found ${profiles.length} profiles.`);

    // Try to find one that looks like the vendor
    profiles.forEach(p => {
        console.log(`ID: ${p.id}, Role: ${p.role}, Name: ${p.name || p.business_name}, Onboarding: ${p.onboarding_completed}`);
    });
}

listProfiles();
