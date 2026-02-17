
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Load .env.local manually since we are running this script with node/tsx directly
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Error: Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
    console.log('Testing Supabase connection...');
    const { data, error } = await supabase.from('test_connection').select('*').limit(1).maybeSingle();

    // It's expected to fail if the table doesn't exist, but a 404/400 error from Postgres means we're connected!
    // Network error means we are not connected.

    if (error) {
        if (error.code === 'PGRST204' || error.code === '42P01') { // 42P01 is undefined_table
            console.log('Success: Connected to Supabase! (Table not found, but connection established)');
        } else {
            console.log('Connection check result:', error.message);
            console.log('Full error:', error);
        }
    } else {
        console.log('Success: Connected to Supabase!');
    }
}

testConnection();
