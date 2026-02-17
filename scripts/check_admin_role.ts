
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const ADMIN_EMAIL = 'contatogabrielbf@gmail.com';

async function checkAdmin() {
    console.log(`--- Checking User: ${ADMIN_EMAIL} ---`);

    // 1. Get User ID from Auth (if possible with anon key? No, need checking profiles by email if exposed or login)
    // Since I have login credentials, I'll log in to check myself.

    const { data: { session }, error: loginError } = await supabase.auth.signInWithPassword({
        email: ADMIN_EMAIL,
        password: '123456'
    });

    if (loginError) {
        console.error('❌ Login failed:', loginError.message);
        return;
    }

    const userId = session?.user.id;
    console.log(`✅ Logged in. User ID: ${userId}`);
    console.log(`Auth Meta Role:`, session?.user.role); // This is usually 'authenticated'
    console.log(`Auth User Metadata:`, session?.user.user_metadata);

    // 2. Check Profile Table
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (profileError) {
        console.error('❌ Error fetching profile:', profileError.message);
    } else {
        console.log('--- PROFILE DATA ---');
        console.log('ID:', profile.id);
        console.log('Email:', profile.email);
        console.log('Role:', profile.role);
        console.log('Name:', profile.name);

        if (profile.role !== 'admin') {
            console.error('⚠️ ROLE IS NOT ADMIN! It is:', profile.role);

            // Attempt to fix it again
            console.log('Attempting to fix role to admin...');
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ role: 'admin' })
                .eq('id', userId);

            if (updateError) console.error('Failed to update:', updateError.message);
            else console.log('✅ Role updated to admin.');
        } else {
            console.log('✅ Role is correctly set to ADMIN in database.');
        }
    }
}

checkAdmin();
