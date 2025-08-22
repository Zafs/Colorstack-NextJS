import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import Stripe from 'stripe';

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      console.error("[MANAGE_SUBSCRIPTION_ERROR] User not authenticated");
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const origin = request.headers.get('origin');

    if (!stripeSecretKey) {
      console.error("[MANAGE_SUBSCRIPTION_ERROR] Stripe Secret Key is not configured");
      return NextResponse.json({ error: 'stripe_error' }, { status: 500 });
    }

    if (!origin) {
      console.error("[MANAGE_SUBSCRIPTION_ERROR] Origin header is missing");
      return NextResponse.json({ error: 'stripe_error' }, { status: 400 });
    }

    // Initialize Stripe
    const stripe = new Stripe(stripeSecretKey);

    // Get user from Clerk
    const { clerkClient } = await import('@clerk/nextjs/server');
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);
    const userEmail = user.emailAddresses[0]?.emailAddress;

    if (!userEmail) {
      console.error("[MANAGE_SUBSCRIPTION_ERROR] User email not found");
      return NextResponse.json({ error: 'missing_id' }, { status: 400 });
    }

    // Check if user has stripeCustomerId in publicMetadata
    const stripeCustomerId = user.publicMetadata.stripeCustomerId as string;
    
    if (!stripeCustomerId) {
      console.error("[MANAGE_SUBSCRIPTION_ERROR] User does not have stripeCustomerId in publicMetadata");
      return NextResponse.json({ error: 'missing_id' }, { status: 400 });
    }

    // Verify the customer exists in Stripe
    try {
      const customer = await stripe.customers.retrieve(stripeCustomerId);
      
      if (customer.deleted) {
        console.error("[MANAGE_SUBSCRIPTION_ERROR] Stripe customer has been deleted");
        return NextResponse.json({ error: 'missing_id' }, { status: 400 });
      }
    } catch (stripeError) {
      console.error("[MANAGE_SUBSCRIPTION_ERROR] Failed to retrieve Stripe customer:", stripeError);
      return NextResponse.json({ error: 'missing_id' }, { status: 400 });
    }

    // Create a customer portal session
    try {
      const session = await stripe.billingPortal.sessions.create({
        customer: stripeCustomerId,
        return_url: `${origin}/account`,
      });

      return NextResponse.json({ url: session.url });
    } catch (stripeError) {
      console.error("[MANAGE_SUBSCRIPTION_ERROR] Failed to create billing portal session:", stripeError);
      return NextResponse.json({ error: 'stripe_error' }, { status: 500 });
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("[MANAGE_SUBSCRIPTION_ERROR]", errorMessage);
    return NextResponse.json({ error: 'stripe_error' }, { status: 500 });
  }
}
