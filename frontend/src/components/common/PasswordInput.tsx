import { useState, type InputHTMLAttributes } from 'react'
import { Eye, EyeOff } from 'lucide-react'

type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>

/** Password field with a show / hide toggle. */
export default function PasswordInput({ className = '', ...rest }: PasswordInputProps) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="relative">
      <input type={visible ? 'text' : 'password'} className={`input pr-12 ${className}`} {...rest} />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'Hide password' : 'Show password'}
        aria-pressed={visible}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-brand-muted transition-colors hover:text-white"
      >
        {visible ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
      </button>
    </div>
  )
}
