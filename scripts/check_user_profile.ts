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

async function checkUser() {
    const email = 'fortunatofotocine@gmail.com';
    console.log(`Checking user: ${email}...`);

    // 1. Get User ID from Auth
    // Note: internal auth tables aren't directly accessible via client usually, 
    // but we can try to query the public profiles table if it exists and is linked.

    const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .ilike('email', email);

    if (error) {
        console.error('Error fetching profile:', error);
        return;
    }

    if (profiles && profiles.length > 0) {
        console.log('Profile found:', profiles[0]);
    } else {
        console.log('No profile found in "profiles" table for this email.');
        // Attempt to list users if we had service role key, but we only have anon key usually.
    }
}

checkUser();
