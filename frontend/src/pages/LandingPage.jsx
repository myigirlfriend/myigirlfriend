import { motion } from 'framer-motion'
import { Shield, ChevronRight, Check, Mail, Bell } from 'lucide-react'
import { useState } from 'react'
import { PERSONAS } from '@config/personas'

// ─── Social icons ─────────────────────────────────────────────
function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  )
}

function TikTokIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z"/>
    </svg>
  )
}

function RedditIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
    </svg>
  )
}

// ─── Particles ────────────────────────────────────────────────
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
          animate={{ y: [0, -30, 0], opacity: [0.3, 0.8, 0.3], scale: [1, 1.5, 1] }}
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

// ─── Logo text only ───────────────────────────────────────────
function LogoBubble({ size = 'md' }) {
  const sizes = {
    sm: { bubble: 36, dot: 5, text: 'text-xl' },
    md: { bubble: 56, dot: 7, text: 'text-3xl' },
    lg: { bubble: 100, dot: 11, text: 'text-6xl' },
  }
  const s = sizes[size]

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: s.bubble, height: s.bubble }}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"
          style={{ width: s.bubble, height: s.bubble, filter: 'drop-shadow(0 0 16px rgba(155,89,182,0.6))' }}>
          <defs>
            <linearGradient id="lg1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#9B59B6" />
              <stop offset="100%" stopColor="#E91E8C" />
            </linearGradient>
          </defs>
          <path d="M10 22 Q10 8 24 8 L76 8 Q90 8 90 22 L90 58 Q90 72 76 72 L56 72 L44 90 L44 72 L24 72 Q10 72 10 58 Z" fill="url(#lg1)" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center gap-1.5 pb-4">
          {[0, 1, 2].map(i => (
            <motion.div key={i}
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
        >igirlfriend</motion.span>
      </div>
    </div>
  )
}

// Nav logo — text only
function NavLogo() {
  return (
    <div className="flex items-center gap-2">
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 28, height: 28 }}>
        <defs>
          <linearGradient id="navGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9B59B6" />
            <stop offset="100%" stopColor="#E91E8C" />
          </linearGradient>
        </defs>
        <path d="M10 22 Q10 8 24 8 L76 8 Q90 8 90 22 L90 58 Q90 72 76 72 L56 72 L44 90 L44 72 L24 72 Q10 72 10 58 Z" fill="url(#navGrad)" />
        <circle cx="35" cy="40" r="6" fill="white" opacity="0.9" />
        <circle cx="50" cy="40" r="6" fill="white" opacity="0.9" />
        <circle cx="65" cy="40" r="6" fill="white" opacity="0.9" />
      </svg>
      <span className="font-extrabold text-lg leading-none">
        <span className="text-white">my</span>
        <span style={{
          background: 'linear-gradient(90deg, #9B59B6, #E91E8C)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>igirlfriend</span>
      </span>
    </div>
  )
}

// ─── Top Nav ──────────────────────────────────────────────────
function TopNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-dark/70 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <NavLogo />
        <div className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full border border-brand-purple/40"
          style={{ background: 'rgba(155,89,182,0.1)', color: '#9B59B6' }}>
          <Bell size={11} />
          Coming Soon
        </div>
      </div>
    </nav>
  )
}

// ─── Animated persona bg ──────────────────────────────────────
function PersonaBg() {
  const visible = PERSONAS.filter(p => p.image)
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {visible.map((p, i) => (
        <motion.div
          key={p.id}
          className="absolute rounded-2xl overflow-hidden"
          style={{
            width: 120,
            height: 160,
            left: `${10 + i * 20}%`,
            top: `${5 + (i % 2) * 30}%`,
            opacity: 0,
          }}
          animate={{ opacity: [0, 0.12, 0.12, 0] }}
          transition={{
            duration: 6,
            repeat: Infinity,
            delay: i * 2,
            ease: 'easeInOut',
          }}
        >
          <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(to bottom, transparent, #0a0a0a)'
          }} />
        </motion.div>
      ))}
    </div>
  )
}

const gradStyle = {
  background: 'linear-gradient(135deg, #9B59B6, #E91E8C)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
}

// ─── Email capture ────────────────────────────────────────────
function EmailCapture() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email) setSubmitted(true)
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-2 text-sm font-semibold px-5 py-3 rounded-xl"
        style={{ background: 'rgba(155,89,182,0.15)', border: '1px solid rgba(155,89,182,0.4)', color: '#c084fc' }}
      >
        <div className="w-5 h-5 rounded-full flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #9B59B6, #E91E8C)' }}>
          <Check size={11} className="text-white" />
        </div>
        You're on the list! We'll notify you.
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-sm">
      <input
        type="email"
        required
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="flex-1 px-4 py-3 rounded-xl text-sm text-white placeholder-brand-muted outline-none"
        style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
      />
      <button
        type="submit"
        className="px-5 py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
        style={{ background: 'linear-gradient(135deg, #9B59B6, #E91E8C)', whiteSpace: 'nowrap' }}
      >
        Notify Me
      </button>
    </form>
  )
}

// ─── Main ─────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="min-h-screen text-white overflow-x-hidden" style={{
      background: 'radial-gradient(ellipse at 50% 0%, #1e0a3c 0%, #0a0a0a 60%)',
    }}>
      <TopNav />

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 text-center pt-20">
        <Particles />
        <PersonaBg />

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
          <LogoBubble size="lg" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-brand-muted text-xs tracking-[0.3em] mb-6 font-semibold uppercase relative z-10"
        >
          conversation · connection · something real
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-4xl md:text-5xl font-extrabold max-w-lg mb-5 leading-tight relative z-10"
        >
          Someone to talk to.{' '}
          <span style={gradStyle}>Always.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-brand-muted text-base max-w-xs mb-6 leading-relaxed relative z-10"
        >
          meet your real companion and chat with her when ever you need.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="mb-6 relative z-10"
        >
          <span className="text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full"
            style={{ background: 'linear-gradient(135deg, rgba(155,89,182,0.2), rgba(233,30,140,0.2))', border: '1px solid rgba(155,89,182,0.5)', color: '#c084fc' }}>
            🚀 Launching Soon
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex justify-center relative z-10 w-full px-4"
        >
          <EmailCapture />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-brand-muted text-xs mt-5 flex items-center gap-1.5 relative z-10"
        >
          <Shield size={11} className="text-brand-purple" />
          Free to start · No card needed · 100% private
        </motion.p>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-0.5 h-8 rounded-full bg-gradient-to-b from-brand-purple/60 to-transparent mx-auto" />
        </motion.div>
      </section>

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
              Meet <span style={gradStyle}>the girls</span>
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
                className="shrink-0 w-40 group"
              >
                <div className="relative w-40 h-52 rounded-2xl overflow-hidden mb-2"
                  style={{ boxShadow: `0 0 20px ${p.accentColor}30` }}>
                  {p.image ? (
                    <img src={p.image} alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full"
                      style={{ background: `linear-gradient(135deg, ${p.gradientFrom}, ${p.gradientTo})` }} />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
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

      {/* ── Pricing ── */}
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
              Simple <span style={gradStyle}>pricing</span>
            </h2>
            <p className="text-brand-muted text-sm">Start free. Upgrade when ready.</p>
          </motion.div>

          <div className="space-y-4">
            {[
              {
                label: 'Free',
                price: '$0',
                desc: 'Try it out',
                features: ['5 messages per session', '1 companion', 'No credit card needed'],
                cta: 'Start Free',
                popular: false,
              },
              {
                label: 'Basic',
                price: '$9.99',
                period: '/ 7 days',
                desc: 'Perfect for getting started',
                features: ['Unlimited messages', '1 companion of your choice', 'She remembers you', 'Standard support'],
                cta: 'Get Basic',
                popular: false,
              },
              {
                label: 'Premium',
                price: '$19.99',
                period: '/ month',
                desc: 'The full experience',
                features: ['Unlimited messages', 'All 5 companions', 'Deep memory system', 'Priority support', 'Early access to new features'],
                cta: 'Get Premium',
                popular: true,
              },
            ].map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="rounded-2xl p-5 relative"
                style={{
                  background: p.popular
                    ? 'linear-gradient(135deg, rgba(155,89,182,0.15), rgba(233,30,140,0.15))'
                    : 'rgba(255,255,255,0.04)',
                  border: p.popular
                    ? '1px solid rgba(155,89,182,0.5)'
                    : '1px solid rgba(255,255,255,0.08)',
                }}
              >
                {p.popular && (
                  <div className="absolute -top-3 left-5 text-white text-xs font-bold px-3 py-0.5 rounded-full"
                    style={{ background: 'linear-gradient(135deg, #9B59B6, #E91E8C)' }}>
                    Most Popular
                  </div>
                )}

                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="font-extrabold text-white text-lg">{p.label}</div>
                    <div className="text-brand-muted text-xs mt-0.5">{p.desc}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-extrabold text-white text-2xl">{p.price}</div>
                    {p.period && <div className="text-brand-muted text-xs">{p.period}</div>}
                  </div>
                </div>

                <ul className="space-y-2 mb-5">
                  {p.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-brand-muted">
                      <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: 'linear-gradient(135deg, #9B59B6, #E91E8C)' }}>
                        <Check size={10} className="text-white" />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => navigate('/register')}
                  className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all"
                  style={p.popular ? {
                    background: 'linear-gradient(135deg, #9B59B6, #E91E8C)',
                    boxShadow: '0 0 20px rgba(155,89,182,0.3)',
                  } : {
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.12)',
                  }}
                >
                  {p.cta}
                </button>
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
            <LogoBubble size="md" />
            <p className="text-brand-muted text-sm mt-6 mb-6 leading-relaxed">
              We're putting the finishing touches on something special. Be the first to know when we launch.
            </p>
            <EmailCapture />
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 px-4 py-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">

            {/* Brand */}
            <div>
              <NavLogo />
              <p className="text-brand-muted text-xs mt-3 leading-relaxed max-w-xs">
                conversation. connection. something real. Your companion is always here.
              </p>
              {/* Social links */}
              <div className="flex items-center gap-3 mt-4">
                <a href="https://x.com/myigirlfriend?s=21" target="_blank" rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-brand-muted hover:text-white transition-all border border-white/5">
                  <XIcon />
                </a>
                <a href="https://www.tiktok.com/@myigirlfriend?_r=1&_t=ZN-96Jd88qwFSY" target="_blank" rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-brand-muted hover:text-white transition-all border border-white/5">
                  <TikTokIcon />
                </a>
                <a href="https://www.reddit.com/u/Myigirlfriend/s/S6wxKCZsNX" target="_blank" rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-brand-muted hover:text-white transition-all border border-white/5">
                  <RedditIcon />
                </a>
              </div>
            </div>

            {/* Links */}
            <div>
              <div className="text-white font-bold text-sm mb-4">Platform</div>
              <div className="space-y-2">
                {[
                  { label: 'Terms', href: '/terms' },
                  { label: 'Privacy', href: '/privacy' },
                  { label: 'Operator Access', href: '/operator/login' },
                ].map(link => (
                  <a key={link.label} href={link.href}
                    className="block text-brand-muted text-xs hover:text-white transition-colors">
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div>
              <div className="text-white font-bold text-sm mb-4">Contact</div>
              <div className="space-y-3">
                {[
                  { email: 'Admin@myigirlfriend.com', label: 'Admin' },
                  { email: 'Customerservice@myigirlfriend.com', label: 'Support' },
                  { email: 'management@myigirlfriend.com', label: 'Management' },
                ].map(c => (
                  <a key={c.email} href={`mailto:${c.email}`}
                    className="flex items-center gap-2 text-brand-muted hover:text-white transition-colors group">
                    <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                      style={{ background: 'linear-gradient(135deg, rgba(155,89,182,0.3), rgba(233,30,140,0.3))' }}>
                      <Mail size={12} className="text-brand-purple" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white/60 group-hover:text-white/80">{c.label}</div>
                      <div className="text-xs">{c.email}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col md:flex-row items-center justify-between pt-6 border-t border-white/5 gap-3">
            <p className="text-brand-muted text-xs">
              © 2026 myigirlfriend. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a href="/terms" className="text-brand-muted text-xs hover:text-white transition-colors">Terms</a>
              <a href="/privacy" className="text-brand-muted text-xs hover:text-white transition-colors">Privacy</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}