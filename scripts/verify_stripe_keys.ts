import Stripe from 'stripe';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const stripeKey = process.env.STRIPE_SECRET_KEY;

if (!stripeKey) {
    console.error("STRIPE_SECRET_KEY not found in .env.local");
    process.exit(1);
}

const stripe = new Stripe(stripeKey, {
    apiVersion: '2025-02-24.acacia' as any,
});

async function verify() {
    console.log("Verifying Stripe Keys...");
    try {
        const account = await stripe.accounts.retrieve();
        console.log("SUCCESS: Keys are valid!");
        console.log("Account ID:", account.id);
        console.log("Account Email:", account.email);
        console.log("Charges Enabled:", account.charges_enabled);
        console.log("Payouts Enabled:", account.payouts_enabled);
        console.log("Mode:", account.type); // standard, express, etc.
    } catch (error: any) {
        console.error("ERROR: Keys are invalid or permission denied.");
        console.error(error.message);
    }
}

verify();
