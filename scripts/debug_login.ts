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

async function debugLogin() {
    const email = 'fortunatofotocine@gmail.com';
    const password = 'xxxxxxxx'; // Redacted in output but used in real execution if I put real password here. 
    // Wait, I should use the real password provided by user: 31521635

    console.log(`Attempting login for: ${email}...`);

    const { data, error } = await supabase.auth.signInWithPassword({
        email: 'fortunatofotocine@gmail.com',
        password: '31521635'
    });

    if (error) {
        console.error('Login Failed:', error.message);
        return;
    }

    const user = data.user;
    console.log('Login Successful!');
    console.log('User ID:', user.id);
    console.log('User Email:', user.email);
    console.log('User Meta:', user.user_metadata);

    // Now fetch profile
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (profileError) {
        console.error('Error fetching profile:', profileError.message);
    } else {
        console.log('Profile Data:', profile);
    }
}

debugLogin();
