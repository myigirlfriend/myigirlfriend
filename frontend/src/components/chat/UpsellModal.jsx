import { useNavigate } from 'react-router-dom'
import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import { useSubStore } from '@store/index'

export default function UpsellModal() {
  const { showUpsell, setShowUpsell } = useSubStore()
  const navigate = useNavigate()

  return (
    <Modal isOpen={showUpsell} title={null} size="md">
      <div className="text-center py-4">
        {/* Gradient icon */}
        <div className="w-16 h-16 rounded-full bg-brand-gradient flex items-center justify-center text-3xl mx-auto mb-4 shadow-brand">
          💜
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">
          She wants to keep talking…
        </h2>
        <p className="text-brand-muted text-sm mb-6">
          You've reached the free limit. Unlock unlimited conversations and get closer.
        </p>

        {/* Plan options */}
<div className="grid grid-cols-2 gap-3 mb-6">
  <div className="card border-brand-purple/40 text-left">
    <div className="gradient-text font-bold text-lg mb-1">Basic</div>
    <div className="text-white font-bold text-2xl mb-1">
      $9.99
      <span className="text-xs text-brand-muted font-normal"> / 7 days</span>
    </div>
    <div className="text-brand-muted text-xs">Unlimited · 1 companion</div>
  </div>
  <div className="plan-wrap relative">
    <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-brand-gradient text-white text-xs font-bold px-3 py-0.5 rounded-full whitespace-nowrap">
      Popular
    </div>
    <div className="card border border-brand-pink/40 text-left">
      <div className="gradient-text font-bold text-lg mb-1">Premium</div>
      <div className="text-white font-bold text-2xl mb-1">
        $19.99
        <span className="text-xs text-brand-muted font-normal"> / month</span>
      </div>
      <div className="text-brand-muted text-xs">All personas · Memory</div>
    </div>
  </div>
</div>

        <Button
          fullWidth
          onClick={() => { setShowUpsell(false); navigate('/subscription') }}
        >
          Unlock Now
        </Button>
        <button
          onClick={() => setShowUpsell(false)}
          className="mt-3 text-brand-muted text-sm hover:text-white transition-colors"
        >
          Maybe later
        </button>
      </div>
    </Modal>
  )
}
