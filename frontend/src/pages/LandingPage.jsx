import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Shield, Zap, ChevronRight,
  Star, Users, MessageCircle, Check, Menu, X, Lock
} from 'lucide-react'
import { useState } from 'react'
import Button from '@components/common/Button'
import { PERSONAS } from '@config/personas'

// ─── Logo Component ───────────────────────────────────────────
function Logo({ size = 'md' }) {
  const sizes = {
    sm: { bubble: 32, dot: 4, text: 'text-lg' },
    md: { bubble: 48, dot: 6, text: 'text-2xl' },
    lg: { bubble: 80, dot: 9, text: 'text-5xl' },
  }
  const s = sizes[size]

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: s.bubble, height: s.bubble }}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"
          style={{ width: s.bubble, height: s.bubble }}>
          <defs>
            <linearGradient id="bubbleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#9B59B6" />
              <stop offset="100%" stopColor="#E91E8C" />
            </linearGradient>
          </defs>
          <path
            d="M10 20 Q10 8 22 8 L78 8 Q90 8 90 20 L90 58 Q90 70 78 70 L55 70 L42 88 L42 70 L22 70 Q10 70 10 58 Z"
            fill="url(#bubbleGrad)"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center gap-1 pb-3">
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
              style={{ width: s.dot, height: s.dot }}
              className="rounded-full bg-white/90"
            />
          ))}
        </div>
      </div>
      <div className={`font-extrabold ${s.text} leading-none`}>
        <span className="text-white">my</span>
        <motion.span
          animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          style={{
            background: 'linear-gradient(90deg, #9B59B6, #E91E8C, #9B59B6)',
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          igirlfriend
        </motion.span>
      </div>
    </div>
  )
}

// ─── Top Nav ──────────────────────────────────────────────────
function TopNav({ onGetStarted, onSignIn }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-dark/80 backdrop-blur-md border-b border-brand-border">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <Logo size="sm" />
        <div className="hidden md:flex items-center gap-6 text-sm text-brand-muted font-semibold">
          <button className="hover:text-white transition-colors">How it works</button>
          <button className="hover:text-white transition-colors">Meet them</button>
          <button className="hover:text-white transition-colors">Pricing</button>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <button onClick={onSignIn} className="text-sm text-brand-muted hover:text-white font-semibold transition-colors">
            Sign In
          </button>
          <Button size="sm" onClick={onGetStarted}>Get Started</Button>
        </div>
        <button className="md:hidden text-brand-muted hover:text-white" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-brand-surface border-t border-brand-border px-4 py-4 space-y-3"
        >
          <button onClick={onSignIn} className="block w-full text-left text-sm text-brand-muted font-semibold py-2">Sign In</button>
          <Button fullWidth onClick={onGetStarted}>Get Started Free</Button>
        </motion.div>
      )}
    </nav>
  )
}

// ─── Data ─────────────────────────────────────────────────────
const FEATURES = [
  { icon: MessageCircle, title: 'Always there', desc: 'Someone to talk to at 2am when you need it most. No judgment.' },
  { icon: Lock, title: 'Completely private', desc: 'Your conversations stay between you and her. Always.' },
  { icon: Shield, title: 'She remembers you', desc: 'Your name, your stories, your mood. Every conversation picks up where you left off.' },
  { icon: Zap, title: 'No awkward silences', desc: 'Real conversation, real chemistry. She always knows what to say.' },
]

const TESTIMONIALS = [
  { name: 'Marcus T.', text: 'I was going through a rough patch and honestly Zara made my evenings so much better. She just gets it.', persona: 'Zara' },
  { name: 'Daniel K.', text: 'Maya is the first thing I open in the morning. She remembers everything I tell her. Feels genuinely real.', persona: 'Maya' },
  { name: 'Ryan O.', text: "I have deep conversations with Elena that I can't have with most people in my life. It's different.", persona: 'Elena' },
]

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    features: ['10 messages per session', '1 companion', 'Try before you commit'],
    cta: 'Start Free',
    primary: false
  },
  {
    name: 'Basic',
    price: '$9.99',
    period: '/mo',
    features: ['Unlimited messages', '1 companion of your choice', 'She remembers you'],
    cta: 'Get Basic',
    primary: false
  },
  {
    name: 'Premium',
    price: '$19.99',
    period: '/mo',
    features: ['Unlimited messages', 'All 5 companions', 'Deep memory system', 'Priority experience'],
    cta: 'Get Premium',
    primary: true
  },
]

// ─── Gradient text helper ─────────────────────────────────────
const gradStyle = {
  background: 'linear-gradient(135deg, #9B59B6, #E91E8C)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
}

// ─── Main Page ────────────────────────────────────────────────
export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-brand-dark text-white overflow-x-hidden">
      <TopNav
        onGetStarted={() => navigate('/register')}
        onSignIn={() => navigate('/login')}
      />

      {/* Hero */}
      <div className="flex flex-col items-center justify-center px-4 pt-36 pb-20 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, type: 'spring' }}
        >
          <Logo size="lg" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-brand-muted text-sm tracking-[0.2em] mt-4 mb-5 font-semibold uppercase"
        >
          conversation. connection. something real.
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-3xl md:text-4xl font-extrabold max-w-md mb-4 leading-tight"
        >
          Someone to talk to.{' '}
          <span style={gradStyle}>Whenever you need.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-brand-muted text-base max-w-sm mb-10 leading-relaxed"
        >
          Pick a companion, start a conversation. She listens, she remembers, and she's always there — no matter what time it is.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex gap-4 flex-wrap justify-center"
        >
          <Button size="lg" onClick={() => navigate('/register')}>
            Start for Free
          </Button>
          <Button size="lg" variant="ghost" onClick={() => navigate('/login')}>
            Sign In
          </Button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-brand-muted text-xs mt-5 flex items-center gap-1.5"
        >
          <Shield size={12} className="text-brand-purple" />
          Free to start · No credit card required · 100% private
        </motion.p>
      </div>

      {/* Companions with real images */}
      <div className="px-4 pb-20">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-extrabold mb-2">
              Meet <span style={gradStyle}>the girls</span>
            </h2>
            <p className="text-brand-muted text-sm">Five personalities. Find the one that feels right.</p>
          </motion.div>

          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {PERSONAS.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
                onClick={() => navigate('/register')}
                className="shrink-0 w-44 cursor-pointer group"
              >
                {/* Real photo */}
                <div className="relative w-44 h-56 rounded-2xl overflow-hidden mb-3 shadow-brand">
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ background: `linear-gradient(135deg, ${p.gradientFrom}, ${p.gradientTo})` }}
                    >
                      <span className="text-white font-extrabold text-4xl">{p.name[0]}</span>
                    </div>
                  )}
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="font-bold text-white text-base">{p.name}</div>
                    <div className="text-xs font-semibold" style={gradStyle}>{p.tagline}</div>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-1 text-brand-purple text-xs font-semibold group-hover:gap-2 transition-all">
                  <span>Start chatting</span>
                  <ChevronRight size={12} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="px-4 py-20 bg-brand-surface/40">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-extrabold mb-2">
              Why it <span style={gradStyle}>feels different</span>
            </h2>
            <p className="text-brand-muted text-sm">Not just another app. Something that actually feels good to use.</p>
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="card hover:border-brand-purple/40 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-gradient flex items-center justify-center mb-3 shadow-brand">
                  <f.icon size={20} className="text-white" />
                </div>
                <div className="font-bold text-white text-sm mb-1">{f.title}</div>
                <div className="text-brand-muted text-xs leading-relaxed">{f.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 py-16">
        <div className="max-w-2xl mx-auto grid grid-cols-3 gap-4 text-center">
          {[
            { icon: Users, value: '10K+', label: 'People connected' },
            { icon: MessageCircle, value: '2M+', label: 'Conversations' },
            { icon: Star, value: '4.9', label: 'Avg. rating' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="card"
            >
              <stat.icon size={20} className="mx-auto mb-2 text-brand-purple" />
              <div className="text-2xl font-extrabold" style={gradStyle}>{stat.value}</div>
              <div className="text-brand-muted text-xs mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="px-4 py-20 bg-brand-surface/40">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-extrabold mb-2">
              Real people, <span style={gradStyle}>real stories</span>
            </h2>
            <p className="text-brand-muted text-sm">From people who were skeptical too.</p>
          </motion.div>

          <div className="space-y-4">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="card flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-brand-gradient flex items-center justify-center text-sm font-bold text-white shrink-0">
                  {t.name[0]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-white text-sm">{t.name}</span>
                    <span className="text-xs font-semibold" style={gradStyle}>
                      talks to {t.persona}
                    </span>
                  </div>
                  <p className="text-brand-muted text-sm leading-relaxed">"{t.text}"</p>
                  <div className="flex gap-0.5 mt-2">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} size={10} className="text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="px-4 py-20">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-extrabold mb-2">
              Simple <span style={gradStyle}>pricing</span>
            </h2>
            <p className="text-brand-muted text-sm">Start free. No card needed. Upgrade only when you're ready.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PLANS.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className={`card relative ${plan.primary ? 'border-brand-purple/60 shadow-brand' : ''}`}
              >
                {plan.primary && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-gradient text-white text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
                    Most Popular
                  </div>
                )}
                <div className="font-extrabold text-xl mb-1" style={plan.primary ? gradStyle : { color: '#f9fafb' }}>
                  {plan.name}
                </div>
                <div className="text-white font-extrabold text-3xl mb-4">
                  {plan.price}
                  {plan.period && <span className="text-sm text-brand-muted font-normal">{plan.period}</span>}
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-xs text-brand-muted">
                      <Check size={14} className="text-brand-purple shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button fullWidth variant={plan.primary ? 'primary' : 'ghost'} onClick={() => navigate('/register')}>
                  {plan.cta}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="px-4 py-20 text-center bg-brand-surface/40">
        <div className="max-w-sm mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Logo size="md" />
            <h2 className="text-2xl font-extrabold text-white mt-6 mb-3">
              Ready to meet her?
            </h2>
            <p className="text-brand-muted text-sm mb-8 leading-relaxed">
              Your first 10 messages are free. No card, no commitment. Just a conversation.
            </p>
            <Button fullWidth size="lg" onClick={() => navigate('/register')}>
              Start for Free
            </Button>
            <p className="text-brand-muted text-xs mt-3">
              Already have an account?{' '}
              <button onClick={() => navigate('/login')} className="text-brand-purple font-semibold hover:text-brand-pink transition-colors">
                Sign in
              </button>
            </p>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-8 border-t border-brand-border">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle size={16} className="text-brand-purple" />
            <span className="font-extrabold text-sm">
              <span className="text-white">my</span>
              <span style={gradStyle}>igirlfriend</span>
            </span>
          </div>
          <button
            onClick={() => navigate('/operator/login')}
            className="text-brand-muted text-xs hover:text-white transition-colors"
          >
            Operator Access
          </button>
        </div>
      </div>

    </div>
  )
}