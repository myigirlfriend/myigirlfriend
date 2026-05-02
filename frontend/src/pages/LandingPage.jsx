import { useNavigate } from 'react-router-dom'
import Button from '@components/common/Button'

export default function LandingPage() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-brand-gradient flex items-center justify-center text-4xl mb-6 shadow-brand-lg">
        💬
      </div>
      <h1 className="text-5xl font-extrabold mb-2">
        <span className="text-white">my</span>
        <span className="gradient-text">igirlfriend</span>
      </h1>
      <p className="text-brand-muted text-sm tracking-widest mb-10">
        conversation. connection. something real.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => navigate('/register')}>Get Started</Button>
        <Button variant="ghost" onClick={() => navigate('/login')}>Sign In</Button>
      </div>
    </div>
  )
}
