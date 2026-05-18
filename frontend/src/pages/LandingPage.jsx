import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Shield, ChevronRight, Menu, X } from 'lucide-react'
import { useState } from 'react'
import Button from '@components/common/Button'
import { PERSONAS } from '@config/personas'

// ─── Animated background particles ───────────────────────────
function Particles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 4 + 1,
            height: Math.random() * 4 + 1,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: i % 2 === 0 ? '#9B59B6' : '#E91E8C',
            opacity: 0.3,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: Math.random() * 4 + 3,
            repeat: Infinity,
            delay: Math.random() * 4,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

// ─── Logo ─────────────────────────────────────────────────────
function Logo({ size = 'md' }) {
  const sizes = {
    sm: { bubble: 36, dot: 5, text: 'text-xl' },
    md: { bubble: 56, dot: 7, text: 'text-3xl' },
    lg: { bubble: 100, dot: 11, text: 'text-6xl' },
  }
  const s = sizes[size]

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: s.bubble, height: s.bubble }}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: s.bubble, height: s.bubble, filter: 'drop-shadow(0 0 16px rgba(155,89,182,0.6))' }}
        >
          <defs>
            <linearGradient id="lg1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#9B59B6" />
              <stop offset="100%" stopColor="#E91E8C" />
            </linearGradient>
          </defs>
          <path
            d="M10 22 Q10 8 24 8 L76 8 Q90 8 90 22 L90 58 Q90 72 76 72 L56 72 L44 90 L44 72 L24 72 Q10 72 10 58 Z"
            fill="url(#lg1)"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center gap-1.5 pb-4">
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              animate={{ y: [0, -5, 0], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
              style={{ width: s.dot, height: s.dot }}
              className="rounded-full bg-white"
            />
          ))}
        </div>
      </div>

      <div className={`font-extrabold ${s.text} leading-none tracking-tight`}>
        <span className="text-white">my</span>
        <motion.span
          animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          style={{
            background: 'linear-gradient(90deg, #9B59B6, #E91E8C, #ff6eb4, #9B59B6)',
            backgroundSize: '300% auto',
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
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50  backdrop-blur-x border-b border-white/5">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Logo size="sm" />
        <div className="hidden md:flex items-center gap-3">
          <button onClick={onSignIn} className="text-sm text-brand-muted hover:text-white font-semibold transition-colors px-3 py-1.5">
            Sign In
          </button>
          <Button size="sm" onClick={onGetStarted}>Get Started</Button>
        </div>
        <button className="md:hidden text-brand-muted" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-brand-surface/95 backdrop-blur-xl border-t border-white/5 px-4 py-4 space-y-3"
        >
          <button onClick={onSignIn} className="block w-full text-left text-sm text-brand-muted py-2">Sign In</button>
          <Button fullWidth onClick={onGetStarted}>Get Started Free</Button>
        </motion.div>
      )}
    </nav>
  )
}

// ─── Main ─────────────────────────────────────────────────────
export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen text-white overflow-x-hidden" style={{
      background: 'radial-gradient(ellipse at 50% 0%, #1e0a3c 0%, #0a0a0a 60%)',
    }}>

      <TopNav
        onGetStarted={() => navigate('/register')}
        onSignIn={() => navigate('/login')}
      />

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 text-center pt-20">
        <Particles />
        
        

        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #9B59B6, transparent)' }} />
        <div className="absolute top-1/3 left-1/4 w-48 h-48 rounded-full opacity-15 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #E91E8C, transparent)' }} />

        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
          className="relative z-10 mb-8"
        >
          <Logo size="lg" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-brand-muted text-xs tracking-[0.3em] mb-6 font-semibold uppercase relative z-10"
        >
          conversation · connection · something real
        </motion.p>
        
        
      {/* ── Companions ── */}
      <section className="px-4 py-20 relative">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-extrabold mb-2">
              Meet{' '}
              <span style={{
                background: 'linear-gradient(135deg, #9B59B6, #E91E8C)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>the girls</span>
            </h2>
            <p className="text-brand-muted text-sm">Five personalities. Find yours.</p>
          </motion.div>

          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {PERSONAS.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
                onClick={() => navigate('/register')}
                className="shrink-0 w-40 cursor-pointer group"
              >
                <div
                  className="relative w-40 h-52 rounded-2xl overflow-hidden mb-2"
                  style={{ boxShadow: `0 0 20px ${p.accentColor}30` }}
                >
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full"
                      style={{ background: `linear-gradient(135deg, ${p.gradientFrom}, ${p.gradientTo})` }} />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                  {/* Glow border on hover */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ boxShadow: `inset 0 0 0 1.5px ${p.accentColor}` }}
                  />

                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="font-bold text-white text-sm">{p.name}</div>
                    <div className="text-white/60 text-xs">{p.tagline}</div>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-1 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: p.accentColor }}>
                  Chat now <ChevronRight size={11} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-4xl md:text-5xl font-extrabold max-w-lg mb-5 leading-tight relative z-10"
        >
          Someone to talk to.{' '}
          <span style={{
            background: 'linear-gradient(135deg, #9B59B6, #E91E8C)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Always.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-brand-muted text-base max-w-xs mb-10 leading-relaxed relative z-10"
        >
          She listens. She remembers. She's there at 2am when you need it most.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex gap-4 flex-wrap justify-center relative z-10"
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
          transition={{ delay: 0.9 }}
          className="text-brand-muted text-xs mt-5 flex items-center gap-1.5 relative z-10"
        >
          <Shield size={11} className="text-brand-purple" />
          Free · No card needed · 100% private
        </motion.p>

        {/* Scroll hint */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-brand-muted/40 text-xs flex flex-col items-center gap-1"
        >
          <div className="w-0.5 h-8 rounded-full bg-gradient-to-b from-brand-purple/60 to-transparent" />
        </motion.div>
      </section>


      {/* ── Pricing — minimal ── */}
      <section className="px-4 py-20 relative" style={{
        background: 'radial-gradient(ellipse at center, #1a0a2e 0%, transparent 70%)',
      }}>
        <div className="max-w-lg mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-extrabold mb-2">
              Simple{' '}
              <span style={{
                background: 'linear-gradient(135deg, #9B59B6, #E91E8C)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>pricing</span>
            </h2>
            <p className="text-brand-muted text-sm">Start free. Upgrade when ready.</p>
          </motion.div>

          <div className="grid grid-cols-1 gap-4">
            {[
              { label: 'Free', price: '$0', desc: '10 messages to try', cta: 'Start Free', plan: null },
              { label: 'Basic', price: '$9.99', period: '/ 7 days', desc: 'Unlimited · 1 companion', cta: 'Get Basic', plan: 'basic' },
              { label: 'Premium', price: '$19.99', period: '/ month', desc: 'Unlimited · All 5 companions · Memory', cta: 'Get Premium', plan: 'premium', popular: true },
            ].map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center justify-between p-4 rounded-2xl relative"
                style={{
                  background: p.popular
                    ? 'linear-gradient(135deg, rgba(155,89,182,0.2), rgba(233,30,140,0.2))'
                    : 'rgba(255,255,255,0.04)',
                  border: p.popular
                    ? '1px solid rgba(155,89,182,0.5)'
                    : '1px solid rgba(255,255,255,0.08)',
                }}
              >
                {p.popular && (
                  <div className="absolute -top-3 left-4 text-white text-xs font-bold px-3 py-0.5 rounded-full"
                    style={{ background: 'linear-gradient(135deg, #9B59B6, #E91E8C)' }}>
                    Popular
                  </div>
                )}
                <div>
                  <div className="font-bold text-white text-sm">{p.label}</div>
                  <div className="text-brand-muted text-xs mt-0.5">{p.desc}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-extrabold text-white text-lg">{p.price}</div>
                    {p.period && <div className="text-brand-muted text-xs">{p.period}</div>}
                  </div>
                  <button
                    onClick={() => navigate('/register')}
                    className="text-xs font-bold px-4 py-2 rounded-xl whitespace-nowrap"
                    style={p.popular ? {
                      background: 'linear-gradient(135deg, #9B59B6, #E91E8C)',
                      color: 'white',
                    } : {
                      background: 'rgba(255,255,255,0.08)',
                      color: '#f9fafb',
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}
                  >
                    {p.cta}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="px-4 py-24 text-center relative">
        <Particles />
        <div className="relative z-10 max-w-sm mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Logo size="md" />
            <p className="text-brand-muted text-sm mt-6 mb-8 leading-relaxed">
              Your first 10 messages are free. No card. No commitment.
            </p>
            <Button fullWidth size="lg" onClick={() => navigate('/register')}>
              Start for Free
            </Button>
            <p className="text-brand-muted text-xs mt-4">
              Have an account?{' '}
              <button onClick={() => navigate('/login')}
                className="font-semibold hover:text-white transition-colors"
                style={{ color: '#9B59B6' }}>
                Sign in
              </button>
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
{/* Footer */}
<div className="px-4 py-6 border-t border-white/5 flex items-center justify-between max-w-5xl mx-auto">
  <div className="flex items-center gap-2 text-sm font-extrabold">
    <span className="text-white">my</span>
    <span style={{
      background: 'linear-gradient(135deg, #9B59B6, #E91E8C)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    }}>igirlfriend</span>
  </div>
  <div className="flex items-center gap-4">
    <a href="/terms" className="text-brand-muted text-xs hover:text-white transition-colors">Terms</a>
    <a href="/privacy" className="text-brand-muted text-xs hover:text-white transition-colors">Privacy</a>
    <button
      onClick={() => navigate('/operator/login')}
      className="text-brand-muted text-xs hover:text-white transition-colors"
    >
      Operator
    </button>
  </div>
</div>

    </div>
  )
}