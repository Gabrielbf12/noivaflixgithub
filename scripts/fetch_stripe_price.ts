import Stripe from 'stripe';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix for __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const stripeKey = process.env.STRIPE_SECRET_KEY;

if (!stripeKey) {
    console.error("STRIPE_SECRET_KEY not found in .env.local");
    process.exit(1);
}

const stripe = new Stripe(stripeKey, {
    apiVersion: '2025-01-27.acacia',
});

const productId = 'prod_TztkWNzP6FCbmW';

async function getPrice() {
    console.log(`Fetching prices for product: ${productId}...`);
    try {
        const prices = await stripe.prices.list({
            product: productId,
            active: true,
            limit: 1,
        });

        if (prices.data.length > 0) {
            console.log('FOUND_PRICE_ID:', prices.data[0].id);
            console.log('Price Amount:', prices.data[0].unit_amount);
            console.log('Currency:', prices.data[0].currency);
        } else {
            console.log('NO_PRICES_FOUND');
            console.log('Please ensure you have created a Price for this Product in the Stripe Dashboard.');
        }
    } catch (error) {
        console.error('Error fetching prices:', error);
    }
}

getPrice();
