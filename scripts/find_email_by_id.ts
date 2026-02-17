import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// We need the SERVICE ROLE KEY to list users from auth.
// Searching for it in .env.local... 
// If not found, we can't list users directly.
// Let's assume we don't have it and try to find a workaround or just ask the user.
// BUT, maybe the user has it in .env.local?
// Let's check .env.local first.

import fs from 'fs';
const envPath = path.resolve(process.cwd(), '.env.local');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

const serviceKey = envConfig.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!serviceKey) {
    console.log("No Service Role Key found. Cannot list auth users directly.");
    // Fallback: Check if we can find the email in the profile itself if we select slightly differently or if there is a 'contact_email' field?
    // The previous script didn't show email.
}

const supabaseAdmin = createClient(
    process.env.VITE_SUPABASE_URL!,
    serviceKey || process.env.VITE_SUPABASE_ANON_KEY! // Fallback to anon (will fail for listUsers)
);

async function listAuthUsers() {
    if (!serviceKey) {
        console.error("❌ ABORTING: Service Role Key required to find email by ID.");
        return;
    }

    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();

    if (error) {
        console.error('Error fetching users:', error);
        return;
    }

    const targetId = 'e22a3758-d3a1-4326-8657-8d435d00d068';

    console.log(`Searching for user ID: ${targetId}`);

    const foundUser = users.find(u => u.id === targetId);

    if (foundUser) {
        console.log("✅ FOUND USER EMAIL:", foundUser.email);
        console.log("User Metadata:", foundUser.user_metadata);
    } else {
        console.log("❌ User not found in the first page of results.");
    }
}

listAuthUsers();
