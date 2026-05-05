export default function Badge({ label, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-brand-card border-brand-border text-brand-muted',
    gradient: 'bg-brand-gradient text-white border-transparent',
    success: 'bg-green-500/10 border-green-500/30 text-green-400',
    warning: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
    danger: 'bg-red-500/10 border-red-500/30 text-red-400',
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${variants[variant]} ${className}`}>
      {label}
    </span>
  )
}
