
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
const TARGET_ID = '7bd805c5-9ee7-4cd6-8893-7868207a7e95'; // From previous log

async function fixDuplicates() {
    console.log(`--- Fixing Duplicates for ID: ${TARGET_ID} ---`);

    const { data: { session }, error: loginError } = await supabase.auth.signInWithPassword({
        email: 'contatogabrielbf@gmail.com',
        password: '123456'
    });

    if (loginError) {
        console.error('Login failed:', loginError.message);
        return;
    }
    const userId = session.user.id;
    console.log('✅ Logged in as Admin. User ID:', userId);

    // 1. Delete ALL profiles for this ID
    console.log('Deleting ALL existing profiles for this ID...');
    const { error: deleteError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

    if (deleteError) {
        console.error('❌ Error deleting profiles:', deleteError.message);
        // Proceeding anyway? Maybe not if delete failed.
    } else {
        console.log('✅ Cleaned up old profiles.');
    }

    // 2. Insert FRESH Admin Profile
    console.log('Inserting FRESH Admin profile...');
    const { error: insertError } = await supabase
        .from('profiles')
        .insert({
            id: userId,
            role: 'admin',
            // email: 'contatogabrielbf@gmail.com', // Column apparently missing
            name: 'Gabriel Admin',
            subscription_status: 'active'
        });

    if (insertError) {
        console.error('❌ Insert failed:', insertError.message);
    } else {
        console.log('✅ Created new SINGULAR Admin profile.');
    }
}

fixDuplicates();
