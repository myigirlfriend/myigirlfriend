/** "or" rule between the Google button and the email form. */
export default function OrDivider() {
  return (
    <div className="my-5 flex items-center gap-3" role="separator">
      <div className="h-px flex-1 bg-brand-border" />
      <span className="text-xs font-semibold text-brand-muted">or</span>
      <div className="h-px flex-1 bg-brand-border" />
    </div>
  )
}
