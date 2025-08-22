# Monetization Setup Guide

## Environment Variables Required

Create a `.env.local` file in the `colorstack-app` directory with the following variables:

```bash
# Clerk Keys (already provided)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_bWF4aW11bS1za2luay05NC5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_SECRET_KEY=sk_test_NgXhkfpQG0ql5ziRv09FyFYZH3fdvepKcpk5kioVe4

# Stripe Keys (you need to fill these in)
STRIPE_SECRET_KEY=sk_live_...  # Your Stripe secret key
STRIPE_WEBHOOK_SECRET=whsec_ujz58DaR0VRkg3TMMb2gPJW72PGck6KV  # Your webhook secret
NEXT_PUBLIC_STRIPE_PRICE_ID=price_...  # Your $7.99/month subscription price ID
NEXT_PUBLIC_STRIPE_PROMO_CODE=LAUNCH  # Your promotion code
```

## Stripe Setup Steps

1. **Get your Price ID**: 
   - Go to your Stripe Dashboard
   - Navigate to Products > Your $7.99/month subscription
   - Copy the Price ID (starts with `price_`)

2. **Set up Webhook**:
   - In Stripe Dashboard, go to Developers > Webhooks
   - Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
   - Select events: `checkout.session.completed`
   - Copy the webhook signing secret

3. **Create Promotion Code**:
   - In Stripe Dashboard, go to Products > Coupons
   - Create a new coupon with code "LAUNCH"
   - Set the discount amount/percentage as needed

## Features Implemented

✅ **Authentication Flow**: Users must sign in before upgrading
✅ **Stripe Checkout**: Integrated with promotion codes
✅ **Webhook Processing**: Automatically upgrades users after payment
✅ **Tier Gating**: Pro users get 24 layers and unlimited exports
✅ **Loading States**: Proper UX during checkout process

## How It Works

1. User hits tier limit → Upgrade modal appears
2. User clicks "Upgrade to Pro" → Redirected to sign in if not authenticated
3. After sign in → Stripe checkout session created with promotion code
4. User completes payment → Webhook updates user metadata to 'pro' tier
5. User returns to app → Now has pro features unlocked

## Testing

- Test the flow in development mode
- Use Stripe test keys for development
- Switch to live keys for production
