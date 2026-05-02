const router = require('express').Router()
const stripe = require('../config/stripe')
const supabase = require('../config/supabase')
const { authMiddleware } = require('../middleware/auth.middleware')
const { ok, err } = require('../utils/response')

const PLANS = {
  basic:   { priceId: process.env.STRIPE_BASIC_PRICE_ID,   label: 'Basic' },
  premium: { priceId: process.env.STRIPE_PREMIUM_PRICE_ID, label: 'Premium' },
}

// Create Stripe Checkout session
router.post('/checkout', authMiddleware, async (req, res) => {
  const { plan } = req.body
  if (!PLANS[plan]) return err(res, 'Invalid plan')

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: PLANS[plan].priceId, quantity: 1 }],
    success_url: `${process.env.FRONTEND_URL}/chat?upgraded=true`,
    cancel_url: `${process.env.FRONTEND_URL}/subscription`,
    metadata: { userId: req.user.id, plan },
  })
  ok(res, { url: session.url })
})

// Stripe webhook — update subscription in DB
router.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature']
  let event
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch {
    return res.status(400).send('Webhook Error')
  }

  if (event.type === 'checkout.session.completed') {
    const { userId, plan } = event.data.object.metadata
    const customerId = event.data.object.customer
    await supabase.from('subscriptions').upsert({
      user_id: userId, plan, status: 'active', stripe_customer_id: customerId,
    }, { onConflict: 'user_id' })
  }

  if (event.type === 'customer.subscription.deleted') {
    const customerId = event.data.object.customer
    await supabase.from('subscriptions').update({ status: 'cancelled' })
      .eq('stripe_customer_id', customerId)
  }

  res.json({ received: true })
})

// Get subscription status
router.get('/status', authMiddleware, async (req, res) => {
  const { data: sub } = await supabase.from('subscriptions')
    .select('plan, status').eq('user_id', req.user.id).single()
  ok(res, { plan: sub?.plan || 'free', status: sub?.status || 'inactive' })
})

module.exports = router
