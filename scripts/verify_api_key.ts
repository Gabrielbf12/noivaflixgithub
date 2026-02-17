
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const API_KEY = process.env.VITE_GEMINI_API_KEY;

async function listModels() {
    console.log('--- Listing Available Gemini Models ---');

    if (!API_KEY) {
        console.error('❌ Missing API KEY');
        return;
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.models) {
            console.log('✅ Available Models:');
            data.models.forEach((m: any) => {
                if (m.supportedGenerationMethods.includes('generateContent')) {
                    console.log(`- ${m.name}`);
                }
            });
        } else {
            console.error('❌ No models found or error:', data);
        }
    } catch (error) {
        console.error('❌ Error fetching models:', error);
    }
}

listModels();
