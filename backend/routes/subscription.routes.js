const router = require('express').Router()
const stripe = require('../config/stripe')
const supabase = require('../config/supabase')
const { authMiddleware } = require('../middleware/auth.middleware')
const { ok, err } = require('../utils/response')

const PLANS = {
  basic: {
    priceId: process.env.STRIPE_BASIC_PRICE_ID,
    label: 'Basic',
  },
  premium: {
    priceId: process.env.STRIPE_PREMIUM_PRICE_ID,
    label: 'Premium',
  },
}

// Create Stripe Checkout session
router.post('/checkout', authMiddleware, async (req, res) => {
  const { plan } = req.body
  if (!PLANS[plan]) return err(res, 'Invalid plan')
  if (!PLANS[plan].priceId) return err(res, 'Price ID not configured', 500)

  try {
    // Check if user already has a Stripe customer ID
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', req.user.id)
      .single()

    const sessionParams = {
      mode: 'subscription',
      line_items: [{ price: PLANS[plan].priceId, quantity: 1 }],
      success_url: `${process.env.FRONTEND_URL}/chat?upgraded=true`,
      cancel_url: `${process.env.FRONTEND_URL}/subscription?cancelled=true`,
      metadata: { userId: req.user.id, plan },
      allow_promotion_codes: true,
    }

    // Attach existing customer if available
    if (sub?.stripe_customer_id) {
      sessionParams.customer = sub.stripe_customer_id
    } else {
      sessionParams.customer_email = req.user.email
    }

    const session = await stripe.checkout.sessions.create(sessionParams)
    ok(res, { url: session.url })
  } catch (e) {
    console.error('[Stripe checkout error]', e.message)
    err(res, 'Could not create checkout session', 500)
  }
})

// Stripe webhook — handles all subscription events
router.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature']
  let event

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (e) {
    console.error('[Webhook error]', e.message)
    return res.status(400).send(`Webhook Error: ${e.message}`)
  }

  console.log('[Stripe webhook]', event.type)

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object
      const { userId, plan } = session.metadata
      const customerId = session.customer

      await supabase.from('subscriptions').upsert({
        user_id: userId,
        plan,
        status: 'active',
        stripe_customer_id: customerId,
      }, { onConflict: 'user_id' })

      // Reset usage count so paid user starts fresh
      await supabase.from('usage_tracking')
        .update({ message_count: 0 })
        .eq('user_id', userId)

      console.log(`[Stripe] User ${userId} subscribed to ${plan}`)
      break
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object
      const customerId = subscription.customer
      const status = subscription.status === 'active' ? 'active' : 'inactive'

      await supabase.from('subscriptions')
        .update({ status })
        .eq('stripe_customer_id', customerId)
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object
      const customerId = subscription.customer

      await supabase.from('subscriptions')
        .update({ status: 'cancelled', plan: 'free' })
        .eq('stripe_customer_id', customerId)

      console.log(`[Stripe] Subscription cancelled for customer ${customerId}`)
      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object
      const customerId = invoice.customer

      await supabase.from('subscriptions')
        .update({ status: 'past_due' })
        .eq('stripe_customer_id', customerId)
      break
    }

    default:
      console.log(`[Stripe] Unhandled event: ${event.type}`)
  }

  res.json({ received: true })
})

// Get subscription status
router.get('/status', authMiddleware, async (req, res) => {
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('plan, status, stripe_customer_id')
    .eq('user_id', req.user.id)
    .single()

  ok(res, {
    plan: sub?.plan || 'free',
    status: sub?.status || 'inactive',
    isPaid: sub?.status === 'active',
  })
})

// Cancel subscription
router.post('/cancel', authMiddleware, async (req, res) => {
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', req.user.id)
    .single()

  if (!sub?.stripe_customer_id) return err(res, 'No active subscription')

  try {
    // Get subscriptions from Stripe
    const subscriptions = await stripe.subscriptions.list({
      customer: sub.stripe_customer_id,
      status: 'active',
      limit: 1,
    })

    if (subscriptions.data.length === 0) return err(res, 'No active subscription found')

    // Cancel at period end — user keeps access until billing period ends
    await stripe.subscriptions.update(subscriptions.data[0].id, {
      cancel_at_period_end: true,
    })

    ok(res, { message: 'Subscription will cancel at end of billing period' })
  } catch (e) {
    console.error('[Cancel error]', e.message)
    err(res, 'Could not cancel subscription', 500)
  }
})

module.exports = router