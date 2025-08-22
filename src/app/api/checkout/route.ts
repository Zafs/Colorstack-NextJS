import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import Stripe from 'stripe';

export async function POST(request: Request) {
  try {
    // Log all environment variables for debugging
    console.log("[STRIPE_CHECKOUT_DEBUG] All environment variables:", {
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? 'SET' : 'MISSING',
      CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY ? 'SET' : 'MISSING',
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ? 'SET' : 'MISSING',
      STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET ? 'SET' : 'MISSING',
      NEXT_PUBLIC_STRIPE_PRICE_ID: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID ? 'SET' : 'MISSING',
      NEXT_PUBLIC_STRIPE_PROMO_CODE: process.env.NEXT_PUBLIC_STRIPE_PROMO_CODE ? 'SET' : 'MISSING',
    });

    const { userId } = await auth();
    console.log("[STRIPE_CHECKOUT_DEBUG] Auth check:", { userId: userId ? 'present' : 'missing' });
    
    if (!userId) {
      console.error("[STRIPE_CHECKOUT_ERROR] User not authenticated");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID;
    const promoCodeString = process.env.NEXT_PUBLIC_STRIPE_PROMO_CODE;
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const origin = request.headers.get('origin');

    // Log environment variable status for debugging
    console.log("[STRIPE_CHECKOUT_DEBUG] Environment check:", {
      hasPriceId: !!priceId,
      hasPromoCode: !!promoCodeString,
      hasStripeKey: !!stripeSecretKey,
      priceId: priceId ? `${priceId.substring(0, 10)}...` : 'missing',
      origin
    });

    if (!priceId) {
      console.error("[STRIPE_CHECKOUT_ERROR] Stripe Price ID is not configured");
      return new NextResponse("Stripe Price ID is not configured", { status: 500 });
    }

    if (!stripeSecretKey) {
      console.error("[STRIPE_CHECKOUT_ERROR] Stripe Secret Key is not configured");
      return new NextResponse("Stripe Secret Key is not configured", { status: 500 });
    }

    // Initialize Stripe with the secret key
    const stripe = new Stripe(stripeSecretKey);

    const checkoutOptions: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${origin}/pro`,
      cancel_url: `${origin}/`,
      metadata: { userId: userId },
    };

    // Only apply discount if a promo code is configured and found
    if (promoCodeString) {
      const promotionCodes = await stripe.promotionCodes.list({
        code: promoCodeString,
        active: true,
        limit: 1,
      });

      if (promotionCodes.data.length > 0) {
        checkoutOptions.discounts = [{ promotion_code: promotionCodes.data[0].id }];
      } else {
        console.warn(`[STRIPE_WARN] Promotion code "${promoCodeString}" not found or inactive.`);
      }
    }

    const session = await stripe.checkout.sessions.create(checkoutOptions);
    return NextResponse.json({ url: session.url });

  } catch (error) {
    // Log the actual error on the server for better debugging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("[STRIPE_CHECKOUT_ERROR]", errorMessage);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
