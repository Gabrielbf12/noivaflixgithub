
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAnalytics() {
    console.log('Checking analytics for vendors...');

    const { data, error } = await supabase
        .from('profiles')
        .select('id, name, business_name, role, views, leads')
        .eq('role', 'fornecedor');

    if (error) {
        console.error('Error fetching profiles:', error);
    } else {
        console.table(data);
    }
}

checkAnalytics();
