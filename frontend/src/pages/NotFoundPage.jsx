import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Button from '@components/common/Button'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
      style={{ background: 'radial-gradient(ellipse at top, #1a0a2e 0%, #0a0a0a 60%)' }}>

      {/* Animated 404 */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100 }}
        className="mb-6"
      >
        <div className="text-8xl font-extrabold leading-none"
          style={{
            background: 'linear-gradient(135deg, #9B59B6, #E91E8C)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          404
        </div>
      </motion.div>

      {/* Chat bubble icon */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-16 h-16 rounded-2xl bg-brand-gradient flex items-center justify-center mb-6 shadow-brand"
      >
        <span className="text-2xl">💬</span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-2xl font-extrabold text-white mb-2"
      >
        She's not here…
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-brand-muted text-sm mb-8 max-w-xs leading-relaxed"
      >
        The page you're looking for doesn't exist. Maybe she moved on 💜
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex gap-3"
      >
        <Button onClick={() => navigate('/')}>Go Home</Button>
        <Button variant="ghost" onClick={() => navigate(-1)}>Go Back</Button>
      </motion.div>
    </div>
  )
}