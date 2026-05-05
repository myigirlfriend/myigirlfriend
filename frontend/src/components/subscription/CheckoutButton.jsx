import { useState } from 'react'
import toast from 'react-hot-toast'
import Button from '@components/common/Button'
import api from '@services/api'

export default function CheckoutButton({ planId, label = 'Upgrade Now', fullWidth = false }) {
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    setLoading(true)
    try {
      const data = await api.post('/api/subscription/checkout', { plan: planId })
      window.location.href = data.url
    } catch (err) {
      toast.error(err.message || 'Checkout failed. Try again.')
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleCheckout} loading={loading} fullWidth={fullWidth}>
      {label}
    </Button>
  )
}
