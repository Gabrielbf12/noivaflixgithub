
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
// If admin key is available, use it to bypass RLS
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey || supabaseKey);

async function debugVendors() {
    console.log('--- Debugging Vendors ---');

    // 1. Count total profiles
    const { count: totalProfiles, error: countError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

    if (countError) console.error('Error counting profiles:', countError);
    else console.log(`Total Profiles: ${totalProfiles}`);

    // 2. Fetch all vendors (raw)
    const { data: vendors, error: vendorsError } = await supabase
        .from('profiles')
        .select('id, name, role, onboarding_completed, subscription_status')
        .eq('role', 'fornecedor');

    if (vendorsError) {
        console.error('Error fetching vendors:', vendorsError);
        return;
    }

    console.log(`Found ${vendors?.length || 0} vendors with role='fornecedor':`);
    vendors?.forEach(v => {
        console.log(`- [${v.id}] ${v.name} | Onboarding: ${v.onboarding_completed} | Sub: ${v.subscription_status}`);
    });
}

debugVendors();
