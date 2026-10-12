import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Spinner from '@components/common/Spinner'
import { authApi } from '@services/api'
import { supabase } from '@services/supabaseClient'
import { useAuthStore } from '@store/index'
import { errorMessage } from '@utils/text'

// Read once at load — Supabase puts OAuth failures in the callback URL
const urlParams = new URLSearchParams(
  window.location.hash.replace(/^#/, '') || window.location.search
)
const urlError = urlParams.get('error_description') || urlParams.get('error')

export default function AuthCallbackPage() {
  const navigate = useNavigate()
  const setUser = useAuthStore((s) => s.setUser)

  useEffect(() => {
    const fail = (reason: string) => {
      console.error('Auth callback error:', reason)
      toast.error(`Google login failed: ${reason}`)
      navigate('/login')
    }

    const handleCallback = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        const email = session?.user.email
        if (error || !session || !email) {
          return fail(urlError || error?.message || 'No session returned')
        }

        // Sync with our backend — create user if first time
        const fullName: unknown = session.user.user_metadata?.full_name
        const data = await authApi.google({
          email,
          name: typeof fullName === 'string' && fullName ? fullName : (email.split('@')[0] ?? email),
          googleId: session.user.id,
          token: session.access_token,
        })

        setUser(data.user)
        navigate('/personas')
      } catch (err) {
        fail(errorMessage(err, 'could not reach the server'))
      }
    }

    handleCallback()
  }, [navigate, setUser])

  return (
    <div className="page flex items-center justify-center" role="status">
      <div className="text-center">
        <Spinner size="lg" className="mb-4" />
        <p className="text-sm text-brand-muted">Signing you in…</p>
      </div>
    </div>
  )
}
