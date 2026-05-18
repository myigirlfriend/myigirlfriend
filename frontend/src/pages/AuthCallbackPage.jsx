import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@services/supabaseClient'
import { useAuthStore } from '@store/index'
import api from '@services/api'
import Spinner from '@components/common/Spinner'

export default function AuthCallbackPage() {
  const navigate = useNavigate()
  const setUser = useAuthStore(s => s.setUser)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error || !session) {
          navigate('/login')
          return
        }

        // Sync with our backend — create user if first time
        const data = await api.post('/api/auth/google', {
          email: session.user.email,
          name: session.user.user_metadata?.full_name || session.user.email.split('@')[0],
          googleId: session.user.id,
          token: session.access_token,
        })

        setUser(data.user)
        navigate('/personas')
      } catch (err) {
        console.error('Auth callback error:', err)
        navigate('/login')
      }
    }

    handleCallback()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-dark">
      <div className="text-center">
        <Spinner size="lg" className="mx-auto mb-4" />
        <p className="text-brand-muted text-sm">Signing you in...</p>
      </div>
    </div>
  )
}