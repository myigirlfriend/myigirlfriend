import { useEffect } from 'react'
import { subscriptionApi } from '@services/api'
import { useSubStore } from '@store/index'

/** The member's plan. Refreshes it from the server when the component mounts. */
export function useSubscription() {
  const { plan, subStatus, setPlan, setSubStatus } = useSubStore()

  useEffect(() => {
    subscriptionApi.status()
      .then((data) => {
        setPlan(data.plan)
        setSubStatus(data.status)
      })
      .catch(() => {}) // silent fail — free plan is default
  }, [setPlan, setSubStatus])

  const isPaid = subStatus === 'active'

  return { plan, subStatus, isPaid, setSubStatus }
}
