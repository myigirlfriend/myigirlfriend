import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight, Mail, Menu, Shield, X } from 'lucide-react'
import Button from '@components/common/Button'
import IconButton from '@components/common/IconButton'
import Logo from '@components/common/Logo'
import HeroLogo from '@components/landing/HeroLogo'
import Particles from '@components/landing/Particles'
import { RedditIcon, TikTokIcon, XIcon } from '@components/landing/SocialIcons'
import PlanCard from '@components/subscription/PlanCard'
import { FREE_MESSAGE_LIMIT } from '@config/limits'
import { PERSONAS, setLivePersonas, shufflePersonas } from '@config/personas'
import { FREE_PLAN, PAID_PLANS } from '@config/plans'
import { personaApi } from '@services/api'
import type { Persona } from '@/types'

const PLANS = [FREE_PLAN, ...PAID_PLANS]

/** The models switched on in the admin dashboard, shuffled. Built-in ones show until the list arrives. */
function useLandingPersonas(): Persona[] {
  const [personas, setPersonas] = useState<Persona[]>(() => shufflePersonas(PERSONAS))
  useEffect(() => {
    personaApi.listPublic()
      .then((data) => { if (data.personas.length > 0) setPersonas(shufflePersonas(setLivePersonas(data.personas))) })
      .catch(() => {})
  }, [])
  return personas
}

const SOCIAL_LINKS = [
  { label: 'X', href: 'https://x.com/myigirlfriend?s=21', Icon: XIcon },
  { label: 'TikTok', href: 'https://www.tiktok.com/@myigirlfriend?_r=1&_t=ZN-96Jd88qwFSY', Icon: TikTokIcon },
  { label: 'Reddit', href: 'https://www.reddit.com/u/Myigirlfriend/s/S6wxKCZsNX', Icon: RedditIcon },
]

const PLATFORM_LINKS = [
  { label: 'Get started', to: '/register' },
  { label: 'Sign in', to: '/login' },
  { label: 'Pricing', to: '/subscription' },
  { label: 'Operator access', to: '/operator/login' },
]

const CONTACTS = [
  { label: 'Support', email: 'Customerservice@myigirlfriend.com' },
]

// ─── Top Nav ──────────────────────────────────────────────────
function TopNav() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  return (
    <nav aria-label="Main" className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-brand-dark/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Logo />
        <div className="hidden items-center gap-3 md:flex">
          <Link to="/login" className="rounded-lg px-3 py-1.5 text-sm font-semibold text-brand-muted transition-colors hover:text-white">
            Sign in
          </Link>
          <Button size="sm" onClick={() => navigate('/register')}>Get started free</Button>
        </div>
        <IconButton label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)} className="md:hidden">
          {open ? <X size={22} /> : <Menu size={22} />}
        </IconButton>
      </div>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3 border-t border-white/5 bg-brand-surface/95 px-4 py-4 backdrop-blur-xl md:hidden"
        >
          <Link to="/login" className="block rounded-lg py-2 text-sm text-brand-muted">Sign in</Link>
          <Button fullWidth onClick={() => navigate('/register')}>Get started free</Button>
        </motion.div>
      )}
    </nav>
  )
}

// ─── Animated persona bg ──────────────────────────────────────
function PersonaBg({ personas }: { personas: Persona[] }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Five floating photos fit across the hero */}
      {personas.filter((p) => p.image).slice(0, 5).map((p, i) => (
        <motion.div
          key={p.id}
          className="absolute h-40 w-[120px] overflow-hidden rounded-2xl opacity-0"
          style={{ left: `${10 + i * 20}%`, top: `${5 + (i % 2) * 30}%` }}
          animate={{ opacity: [0, 0.12, 0.12, 0] }}
          transition={{ duration: 6, repeat: Infinity, delay: i * 2, ease: 'easeInOut' }}
        >
          <img src={p.image ?? undefined} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brand-dark" />
        </motion.div>
      ))}
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────
export default function LandingPage() {
  const navigate = useNavigate()
  const personas = useLandingPersonas()

  return (
    <div className="page overflow-x-hidden text-white">
      <TopNav />

      {/* ── Hero ── */}
      <section className="relative flex min-h-[100dvh] flex-col items-center justify-center px-4 pt-20 text-center">
        <Particles />
        <PersonaBg personas={personas} />

        <div className="pointer-events-none absolute left-1/2 top-1/4 h-96 w-96 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgb(var(--color-brand-purple)),transparent)] opacity-20 blur-3xl" />
        <div className="pointer-events-none absolute left-1/4 top-1/3 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgb(var(--color-brand-pink)),transparent)] opacity-[0.15] blur-3xl" />

        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
          className="relative z-10 mb-8"
        >
          <HeroLogo size="lg" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="relative z-10 mb-6 text-xs font-semibold uppercase tracking-[0.3em] text-brand-muted"
        >
          conversation • connection • companionship
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative z-10 mb-5 max-w-lg text-4xl font-extrabold leading-tight md:text-5xl"
        >
          Someone to talk to.{' '}
          <span className="gradient-text">Always.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="relative z-10 mb-10 max-w-xs text-base leading-relaxed text-brand-muted"
        >
          Meet your real companion and chat with her whenever you need.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="relative z-10 flex flex-wrap justify-center gap-4"
        >
          <Button size="lg" onClick={() => navigate('/register')}>Start for free</Button>
          <Button size="lg" variant="ghost" onClick={() => navigate('/login')}>Sign in</Button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="relative z-10 mt-5 flex items-center gap-1.5 text-xs text-brand-muted"
        >
          <Shield size={11} className="text-brand-purple" aria-hidden="true" />
          Free to start · No card needed · 100% private
        </motion.p>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          aria-hidden="true"
        >
          <div className="mx-auto h-8 w-0.5 rounded-full bg-gradient-to-b from-brand-purple/60 to-transparent" />
        </motion.div>
      </section>

      {/* ── Companions ── */}
      <section className="relative px-4 py-20">
        <div className="mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-2 text-3xl font-extrabold">
              Meet <span className="gradient-text">the girls</span>
            </h2>
            <p className="text-sm text-brand-muted">Different personalities. Find yours.</p>
          </motion.div>

          <div className="scrollbar-hide flex gap-4 overflow-x-auto pb-4">
            {personas.map((p, i) => (
              <motion.button
                key={p.id}
                type="button"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
                onClick={() => navigate('/register')}
                className="group w-40 shrink-0 rounded-2xl text-left"
              >
                {/* Each card glows in its companion's own colour */}
                <div className="relative mb-2 h-52 w-40 overflow-hidden rounded-2xl" style={{ boxShadow: `0 0 20px ${p.accentColor}30` }}>
                  {p.image ? (
                    <img src={p.image} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  ) : (
                    <div className="h-full w-full" style={{ backgroundImage: `linear-gradient(135deg, ${p.gradientFrom}, ${p.gradientTo})` }} />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                  <div
                    className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{ boxShadow: `inset 0 0 0 1.5px ${p.accentColor}` }}
                  />
                  <div className="absolute inset-x-3 bottom-3">
                    <div className="text-sm font-bold text-white">{p.name}</div>
                    <div className="text-xs text-white/70">{p.tagline}</div>
                  </div>
                </div>
                <div
                  className="flex items-center justify-center gap-1 text-xs font-semibold opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                  style={{ color: p.accentColor }}
                >
                  Chat now <ChevronRight size={11} aria-hidden="true" />
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="relative bg-[radial-gradient(ellipse_at_center,rgb(var(--color-brand-glow)),transparent_70%)] px-4 py-20">
        <div className="mx-auto max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 text-center"
          >
            <h2 className="mb-2 text-3xl font-extrabold">
              Simple <span className="gradient-text">pricing</span>
            </h2>
            <p className="text-sm text-brand-muted">Start free. Upgrade when ready.</p>
          </motion.div>

          <div className="space-y-6">
            {PLANS.map((plan, i) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <PlanCard
                  plan={plan}
                  action={
                    <Button variant={plan.popular ? 'primary' : 'secondary'} fullWidth onClick={() => navigate('/register')}>
                      {plan.id === 'free' ? 'Start free' : `Get ${plan.label}`}
                    </Button>
                  }
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="relative px-4 py-24 text-center">
        <Particles />
        <div className="relative z-10 mx-auto max-w-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <HeroLogo size="md" />
            <p className="mb-8 mt-6 text-sm leading-relaxed text-brand-muted">
              Your first {FREE_MESSAGE_LIMIT} messages are free. No card. No commitment. Just a conversation.
            </p>
            <Button fullWidth size="lg" onClick={() => navigate('/register')}>Start for free</Button>
            <p className="mt-4 text-xs text-brand-muted">
              Have an account?{' '}
              <Link to="/login" className="gradient-text rounded font-semibold">Sign in</Link>
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 px-4 py-10">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Brand */}
            <div>
              <Logo />
              <p className="mt-3 max-w-xs text-xs leading-relaxed text-brand-muted">
                conversation. connection. companionship. Your companion is always here.
              </p>
              <div className="mt-4 flex items-center gap-3">
                {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`myigirlfriend on ${label}`}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/5 bg-white/5 text-brand-muted transition-colors hover:bg-white/10 hover:text-white"
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            <div>
              <h3 className="mb-4 text-sm font-bold text-white">Platform</h3>
              <ul className="space-y-2">
                {PLATFORM_LINKS.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="rounded text-xs text-brand-muted transition-colors hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="mb-4 text-sm font-bold text-white">Contact</h3>
              <ul className="space-y-3">
                {CONTACTS.map((contact) => (
                  <li key={contact.email}>
                    <a href={`mailto:${contact.email}`} className="group flex items-center gap-2 rounded-lg text-brand-muted transition-colors hover:text-white">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-brand-gradient-soft">
                        <Mail size={12} className="text-brand-purple" aria-hidden="true" />
                      </span>
                      <span>
                        <span className="block text-xs font-semibold text-white/70 group-hover:text-white/90">{contact.label}</span>
                        <span className="block text-xs">{contact.email}</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col items-center justify-between gap-3 border-t border-white/5 pt-6 md:flex-row">
            <p className="text-xs text-brand-muted">© 2026 myigirlfriend. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link to="/terms" className="rounded text-xs text-brand-muted transition-colors hover:text-white">Terms</Link>
              <Link to="/privacy" className="rounded text-xs text-brand-muted transition-colors hover:text-white">Privacy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
