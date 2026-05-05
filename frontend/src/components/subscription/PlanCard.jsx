import Button from '@components/common/Button'

export default function PlanCard({ plan, onSelect, loading, current }) {
  return (
    <div className={`card relative ${plan.popular ? 'border-brand-purple/50 shadow-brand' : ''}`}>
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-gradient text-white text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
          Most Popular
        </div>
      )}

      {current && (
        <div className="absolute -top-3 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
          Current Plan
        </div>
      )}

      <div className="mb-4">
        <div className="gradient-text font-extrabold text-xl">{plan.label}</div>
        <div className="text-white font-extrabold text-3xl mt-1">
          {plan.price}
          <span className="text-sm text-brand-muted font-normal">/mo</span>
        </div>
      </div>

      <ul className="space-y-2 mb-5">
        {plan.features.map((f) => (
          <li key={f} className="flex items-center gap-2 text-sm text-brand-muted">
            <span className="gradient-text font-bold text-base">✓</span>
            {f}
          </li>
        ))}
      </ul>

      <Button
        fullWidth
        loading={loading}
        disabled={current}
        onClick={() => onSelect(plan.id)}
        variant={current ? 'ghost' : 'primary'}
      >
        {current ? 'Active' : `Get ${plan.label}`}
      </Button>
    </div>
  )
}
