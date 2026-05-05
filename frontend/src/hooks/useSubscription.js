import { useEffect } from 'react'
import { useSubStore } from '@store/index'
import api from '@services/api'

export function useSubscription() {
  const { plan, subStatus, setPlan, setSubStatus } = useSubStore()

  useEffect(() => {
    api.get('/api/subscription/status')
      .then((data) => {
        setPlan(data.plan)
        setSubStatus(data.status)
      })
      .catch(() => {}) // silent fail — free plan is default
  }, [])

  const isPaid = subStatus === 'active'
  const isPremium = plan === 'premium' && isPaid
  const isBasic = plan === 'basic' && isPaid

  return { plan, subStatus, isPaid, isPremium, isBasic }
}
