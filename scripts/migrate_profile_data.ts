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

async function migrateProfileData() {
    const sourceId = 'e22a3758-d3a1-4326-8657-8d435d00d068'; // The "lost" profile with good data
    const targetId = '7955465d-833d-458d-8035-948f9f67d7e7'; // The active login profile (fortunatofotocine@gmail.com)

    console.log(`Migrating data from ${sourceId} to ${targetId}...`);

    // 1. Fetch source data
    const { data: sourceProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', sourceId)
        .single();

    if (fetchError || !sourceProfile) {
        console.error('Error fetching source profile:', fetchError);
        return;
    }

    console.log('Source profile found. Data:', sourceProfile);

    // 2. Prepare update payload (exclude ID, email, created_at, etc.)
    const updatePayload = {
        role: 'fornecedor', // Ensure role is correct
        name: sourceProfile.name,
        business_name: sourceProfile.business_name,
        description: sourceProfile.description,
        category: sourceProfile.category,
        city: sourceProfile.city,
        state: sourceProfile.state,
        phone: sourceProfile.phone,
        website: sourceProfile.website,
        instagram: sourceProfile.instagram,
        portfolio: sourceProfile.portfolio,
        onboarding_completed: true,
        subscription_status: 'active' // Keep them happy
    };

    // 3. Update target profile
    const { error: updateError } = await supabase
        .from('profiles')
        .update(updatePayload)
        .eq('id', targetId);

    if (updateError) {
        console.error('Error updating target profile:', updateError);
    } else {
        console.log('✅ Success! Data migrated to active account.');
    }
}

migrateProfileData();
