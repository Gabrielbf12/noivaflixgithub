
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase URL or Anon Key');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function simulateSave() {
    // Use the ID of 'Yasmin Tavares' found in previous SQL query
    const userId = '79fb440e-5e96-4df2-b8a2-5c16cee5b396';

    console.log('Simulating save for user:', userId);

    const payload = {
        user_id: userId,
        slug: 'yasmin-e-pedrito-test-debug', // Unique slug to avoid slug collision for now
        bride_name: 'Yasmin Debug',
        groom_name: 'Pedrito Debug',
        wedding_date: '2026-12-12',
        wedding_time: '18:00',
        rsvp_enabled: true
    };

    console.log('Payload:', payload);

    const { data, error } = await supabase
        .from('wedding_sites')
        .upsert(payload, { onConflict: 'user_id' })
        .select()
        .single();

    if (error) {
        console.error('❌ Save Error:', error);
    } else {
        console.log('✅ Save Success:', data);
    }
}

simulateSave();
