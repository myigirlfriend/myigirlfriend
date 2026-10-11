import { useState, useEffect } from 'react'
import { Play, Square } from 'lucide-react'
import api from '@services/api'
import toast from 'react-hot-toast'
import { formatDuration } from '@utils/formatTime'

// Clock in / clock out control shown at the bottom of the dashboard rail
export default function AgentHours() {
  const [clockedIn, setClockedIn] = useState(false)
  const [sessionStart, setSessionStart] = useState(null)
  const [elapsed, setElapsed] = useState(0)
  const [totalMinutes, setTotalMinutes] = useState(0)
  const [loading, setLoading] = useState(false)

  // Fetch today's hours on mount
  useEffect(() => {
    api.get('/api/operator/hours')
      .then(data => {
        setTotalMinutes(data.totalMinutesToday || 0)
        if (data.activeSince) {
          const start = new Date(data.activeSince).getTime()
          setClockedIn(true)
          setSessionStart(start)
          setElapsed(Math.floor((Date.now() - start) / 1000))
        }
      })
      .catch(() => {})
  }, [])

  // Live timer tick
  useEffect(() => {
    if (!clockedIn || !sessionStart) return
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - sessionStart) / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [clockedIn, sessionStart])

  const formatClock = (seconds) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  const handleClockIn = async () => {
    setLoading(true)
    try {
      await api.post('/api/operator/hours/clockin')
      setClockedIn(true)
      setSessionStart(Date.now())
      setElapsed(0)
      toast.success('Clocked in')
    } catch (err) {
      toast.error(err.message)
    } finally { setLoading(false) }
  }

  const handleClockOut = async () => {
    setLoading(true)
    try {
      const data = await api.post('/api/operator/hours/clockout')
      setClockedIn(false)
      setSessionStart(null)
      setElapsed(0)
      setTotalMinutes(data.totalMinutesToday || 0)
      toast.success('Clocked out')
    } catch (err) {
      toast.error(err.message)
    } finally { setLoading(false) }
  }

  return (
    <div className="mx-3 mb-3 rounded-xl border border-brand-border p-3">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-xs text-zinc-400">{clockedIn ? 'On shift' : 'Your shift'}</span>
        <span className="text-xs text-zinc-400">
          Today <span className="font-bold text-white tabular-nums">{formatDuration(totalMinutes + Math.floor(elapsed / 60))}</span>
        </span>
      </div>

      {clockedIn && (
        <div className="mt-1 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" />
          <span className="text-xl font-extrabold text-white tabular-nums">{formatClock(elapsed)}</span>
        </div>
      )}

      <button
        onClick={clockedIn ? handleClockOut : handleClockIn}
        disabled={loading}
        className="admin-btn mt-2.5 w-full py-2"
      >
        {clockedIn
          ? <><Square size={14} aria-hidden="true" /> Clock out</>
          : <><Play size={14} aria-hidden="true" /> Clock in</>}
      </button>
    </div>
  )
}
