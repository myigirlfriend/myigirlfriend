import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Button from '@components/common/Button'
import Field from '@components/common/Field'
import PasswordInput from '@components/common/PasswordInput'
import AuthLayout from '@components/layout/AuthLayout'
import { supabase } from '@services/supabaseClient'
import { errorMessage } from '@utils/text'

const MIN_PASSWORD_LENGTH = 8

/** How strong the password looks, as words. Shown as help text under the field. */
const passwordStrength = (password: string): { label: string; tone: string } | null => {
  if (!password) return null
  if (password.length < MIN_PASSWORD_LENGTH) {
    return { label: `Too short: ${MIN_PASSWORD_LENGTH - password.length} more characters needed`, tone: 'text-red-300' }
  }
  if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
    return { label: 'Fair. A capital letter and a number make it stronger.', tone: 'text-amber-200' }
  }
  return { label: 'Strong password', tone: 'text-emerald-300' }
}

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)

  const strength = passwordStrength(password)
  const mismatch = confirm.length > 0 && password !== confirm

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (password !== confirm) return void toast.error('The two passwords are different. Type the same one twice.')
    if (password.length < MIN_PASSWORD_LENGTH) {
      return void toast.error(`Use at least ${MIN_PASSWORD_LENGTH} characters.`)
    }

    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      toast.success('Password updated. Sign in with your new password.')
      navigate('/login')
    } catch (err) {
      toast.error(errorMessage(err, 'Could not update your password. Open the link from the email again.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Choose a new password" tabTitle="New password" subtitle="Pick one you have not used here before.">
      <form onSubmit={handleSubmit} className="space-y-5">
        <Field
          id="reset-password"
          label="New password"
          help={strength
            ? <span className={`font-bold ${strength.tone}`}>{strength.label}</span>
            : `At least ${MIN_PASSWORD_LENGTH} characters.`}
        >
          <PasswordInput id="reset-password" autoComplete="new-password"
            value={password} onChange={(e) => setPassword(e.target.value)} required minLength={MIN_PASSWORD_LENGTH} autoFocus />
        </Field>

        <Field id="reset-confirm" label="Type it again" error={mismatch ? 'The two passwords are different.' : undefined}>
          <PasswordInput id="reset-confirm" autoComplete="new-password"
            value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
        </Field>

        <Button type="submit" fullWidth size="lg" loading={loading} loadingText="Saving…">Save new password</Button>
      </form>
    </AuthLayout>
  )
}
