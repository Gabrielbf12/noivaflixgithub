
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const API_KEY = process.env.VITE_GEMINI_API_KEY;

async function testGemini() {
    console.log('--- Testing Gemini API ---');

    if (!API_KEY) {
        console.error('❌ Missing API KEY');
        return;
    }
    console.log('API Key found:', API_KEY.substring(0, 10) + '...');

    try {
        const ai = new GoogleGenerativeAI(API_KEY);
        const model = ai.getGenerativeModel({ model: "gemini-flash-latest" });

        console.log('Sending message...');
        const result = await model.generateContent("Olá, quem é você?");
        const response = result.response;
        const text = response.text();

        console.log('✅ Response received:');
        console.log(text);
    } catch (error: any) {
        console.error('❌ Error testing Gemini:', error);
        if (error.response) {
            console.error('Error details:', JSON.stringify(error.response, null, 2));
        }
    }
}

testGemini();
