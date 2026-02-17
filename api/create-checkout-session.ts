import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-02-24.acacia' as any, // Cast to any to avoid strict version mismatch if library definitions are ahead/behind
});

export default async function handler(req: any, res: any) {
    if (req.method === 'POST') {
        try {
            const { priceId, userId, userEmail } = req.body;

            // Create Checkout Session
            const sessionConfig: Stripe.Checkout.SessionCreateParams = {
                payment_method_types: ['card'], // Add 'pix' if enabled in Stripe Dashboard
                line_items: [
                    {
                        price: priceId || 'price_H5ggYwtDq4fbrJ', // Replace with real Price ID
                        quantity: 1,
                    },
                ],
                mode: 'payment', // or 'subscription'
                success_url: `${req.headers.origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${req.headers.origin}/assinatura`,
                metadata: {
                    userId: userId,
                },
            };

            if (userEmail && userEmail.trim() !== '') {
                sessionConfig.customer_email = userEmail;
            }

            const session = await stripe.checkout.sessions.create(sessionConfig);

            res.status(200).json({ sessionId: session.id, url: session.url });
        } catch (err: any) {
            res.status(500).json({ statusCode: 500, message: err.message });
        }
    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }
}
