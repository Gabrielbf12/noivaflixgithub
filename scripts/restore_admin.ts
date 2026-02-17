
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
const ADMIN_PASS = '123456';

async function restoreAdmin() {
    console.log(`--- Restoring Admin: ${ADMIN_EMAIL} ---`);

    // 1. Try to Login first
    console.log('Attempting login...');
    let { data: { session }, error: loginError } = await supabase.auth.signInWithPassword({
        email: ADMIN_EMAIL,
        password: ADMIN_PASS
    });

    if (loginError) {
        console.log('Login failed (' + loginError.message + '). Attempting SIGN UP...');

        // 2. Try to Sign Up
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: ADMIN_EMAIL,
            password: ADMIN_PASS,
            options: {
                data: {
                    name: 'Gabriel Admin',
                    role: 'admin' // Some triggers might use this
                }
            }
        });

        if (signUpError) {
            console.error('❌ Sign Up failed:', signUpError.message);
            return;
        }

        session = signUpData.session;
        if (!session && signUpData.user) {
            console.log('⚠️ User created but email confirmation might be required.');
            // If email confirmation is off, we can't get check session immediately without login, 
            // but often auto-confirm is on for dev projects.
        } else if (session) {
            console.log('✅ User created and logged in!');
        }
    } else {
        console.log('✅ Login successful!');
    }

    if (session) {
        console.log('Updating profile to ADMIN role...');

        const { error: updateError } = await supabase
            .from('profiles')
            .update({ role: 'admin', name: 'Gabriel Admin' })
            .eq('id', session.user.id);

        if (updateError) {
            console.error('❌ Error updating profile:', updateError.message);
        } else {
            console.log('✅ Profile role updated to ADMIN successfully.');
        }
    } else {
        console.log('⚠️ Could not establish session to update profile. Check email for confirmation link if checking data.');
    }
}

restoreAdmin();
