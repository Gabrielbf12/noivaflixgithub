import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.VITE_SUPABASE_ANON_KEY!);

async function check() {
    const { data, error } = await supabase.from('profiles').select('*');
    console.log('Error:', error);
    console.log('Data:', JSON.stringify(data, null, 2));
}

check();
