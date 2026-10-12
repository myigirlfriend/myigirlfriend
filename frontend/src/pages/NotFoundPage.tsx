import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MessageCircleOff } from 'lucide-react'
import Button from '@components/common/Button'
import IconTile from '@components/common/IconTile'
import { usePageTitle } from '@hooks/usePageTitle'

export default function NotFoundPage() {
  const navigate = useNavigate()
  usePageTitle('Page not found')

  return (
    <div className="page flex flex-col items-center justify-center px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center"
      >
        <p className="gradient-text mb-6 text-8xl font-extrabold leading-none">404</p>
        <IconTile icon={MessageCircleOff} size="lg" className="mb-6" />
        <h1 className="mb-2 text-2xl font-extrabold text-white">She's not here…</h1>
        <p className="mb-8 max-w-xs text-sm leading-relaxed text-brand-muted">
          The page you're looking for doesn't exist. Maybe she moved on.
        </p>
        <div className="flex gap-3">
          <Button onClick={() => navigate('/')}>Go home</Button>
          <Button variant="ghost" onClick={() => navigate(-1)}>Go back</Button>
        </div>
      </motion.div>
    </div>
  )
}
