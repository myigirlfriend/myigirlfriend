import { Link, type LinkProps } from 'react-router-dom'
import { buttonClasses, type ButtonSize, type ButtonVariant } from './Button'

interface ButtonLinkProps extends LinkProps {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
}

/** A link that looks like a Button. Use it whenever the action is navigation. */
export default function ButtonLink({ variant = 'primary', size = 'md', fullWidth = false, className = '', ...rest }: ButtonLinkProps) {
  return <Link className={buttonClasses(variant, size, fullWidth, className)} {...rest} />
}
