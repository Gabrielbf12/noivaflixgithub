
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase URL or Anon Key');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkSiteAccess() {
    const slug = 'ana-e-joao';
    console.log(`Checking access for slug: ${slug}`);

    // 1. Try to fetch with anon key
    const { data, error } = await supabase
        .from('wedding_sites')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error) {
        console.error('Error fetching site (Anon):', error);
    } else {
        console.log('Success (Anon):', data ? 'Site found' : 'Site not found');
        if (data) console.log('Site ID:', data.id);
    }

    // 2. List all sites to help debug
    const { data: listData, error: listError } = await supabase
        .from('wedding_sites')
        .select('slug, bride_name, groom_name')
        .limit(50);

    if (listError) {
        console.error('Error listing sites:', listError);
    } else {
        console.log('Available sites:', listData);
    }
}

checkSiteAccess();
