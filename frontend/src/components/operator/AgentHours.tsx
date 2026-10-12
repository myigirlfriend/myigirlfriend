import { useEffect, useState } from 'react'
import { Play, Square } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '@components/common/Button'
import { operatorApi } from '@services/api'
import { formatClock, formatDuration } from '@utils/formatTime'
import { errorMessage } from '@utils/text'

// Clock in / clock out control shown at the bottom of the dashboard rail
export default function AgentHours() {
  /** When the running shift started (ms), or null when clocked out */
  const [sessionStart, setSessionStart] = useState<number | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const [totalMinutes, setTotalMinutes] = useState(0)
  const [loading, setLoading] = useState(false)
  const clockedIn = sessionStart !== null

  // Fetch today's hours on mount
  useEffect(() => {
    operatorApi.hours()
      .then((data) => {
        setTotalMinutes(data.totalMinutesToday || 0)
        if (data.activeSince) {
          const start = new Date(data.activeSince).getTime()
          setSessionStart(start)
          setElapsed(Math.floor((Date.now() - start) / 1000))
        }
      })
      .catch(() => {})
  }, [])

  // Live timer tick
  useEffect(() => {
    if (sessionStart === null) return
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - sessionStart) / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [sessionStart])

  const handleClockIn = async () => {
    setLoading(true)
    try {
      await operatorApi.clockIn()
      setSessionStart(Date.now())
      setElapsed(0)
      toast.success('Clocked in')
    } catch (err) {
      toast.error(errorMessage(err))
    } finally { setLoading(false) }
  }

  const handleClockOut = async () => {
    setLoading(true)
    try {
      const data = await operatorApi.clockOut()
      setSessionStart(null)
      setElapsed(0)
      setTotalMinutes(data.totalMinutesToday || 0)
      toast.success('Clocked out')
    } catch (err) {
      toast.error(errorMessage(err))
    } finally { setLoading(false) }
  }

  return (
    <div className="mx-3 mb-3 rounded-xl border border-brand-border p-3">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-xs text-brand-muted">{clockedIn ? 'On shift' : 'Your shift'}</span>
        <span className="text-xs text-brand-muted">
          Today <span className="font-bold tabular-nums text-white">{formatDuration(totalMinutes + Math.floor(elapsed / 60))}</span>
        </span>
      </div>

      {clockedIn && (
        <div className="mt-1 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" />
          <span className="text-xl font-extrabold tabular-nums text-white">{formatClock(elapsed)}</span>
        </div>
      )}

      <Button
        variant="ghost"
        size="sm"
        fullWidth
        onClick={clockedIn ? handleClockOut : handleClockIn}
        disabled={loading}
        className="mt-2.5"
      >
        {clockedIn
          ? <><Square size={14} aria-hidden="true" /> Clock out</>
          : <><Play size={14} aria-hidden="true" /> Clock in</>}
      </Button>
    </div>
  )
}
