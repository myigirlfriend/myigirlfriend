import { useState, useEffect } from 'react'
import api from '@services/api'
import toast from 'react-hot-toast'

export default function AgentHours({ operatorId }) {
  const [clockedIn, setClockedIn] = useState(false)
  const [sessionStart, setSessionStart] = useState(null)
  const [elapsed, setElapsed] = useState(0)
  const [totalHours, setTotalHours] = useState(0)
  const [loading, setLoading] = useState(false)

  // Fetch today's hours on mount
  useEffect(() => {
    api.get('/api/operator/hours')
      .then(data => {
        setTotalHours(data.totalMinutesToday || 0)
        if (data.activeSince) {
          setClockedIn(true)
          setSessionStart(new Date(data.activeSince).getTime())
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

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
  }

  const formatMinutes = (minutes) => {
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    return h > 0 ? `${h}h ${m}m` : `${m}m`
  }

  const handleClockIn = async () => {
    setLoading(true)
    try {
      await api.post('/api/operator/hours/clockin')
      setClockedIn(true)
      setSessionStart(Date.now())
      setElapsed(0)
      toast.success('Clocked in!')
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
      setTotalHours(data.totalMinutesToday || 0)
      toast.success('Clocked out!')
    } catch (err) {
      toast.error(err.message)
    } finally { setLoading(false) }
  }

  return (
    <div className="border-t border-brand-border p-4 space-y-3">
      {/* Live timer */}
      {clockedIn && (
        <div className="text-center">
          <div className="gradient-text text-2xl font-extrabold font-mono">
            {formatTime(elapsed)}
          </div>
          <div className="text-brand-muted text-xs">Current session</div>
        </div>
      )}

      {/* Today total */}
      <div className="flex justify-between text-xs text-brand-muted">
        <span>Today's total</span>
        <span className="font-bold text-white">
          {formatMinutes(totalHours + Math.floor(elapsed / 60))}
        </span>
      </div>

      {/* Clock in/out button */}
      <button
        onClick={clockedIn ? handleClockOut : handleClockIn}
        disabled={loading}
        className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all ${
          clockedIn
            ? 'bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20'
            : 'bg-brand-gradient text-white shadow-brand hover:opacity-90'
        }`}
      >
        {loading ? '...' : clockedIn ? '⏹ Clock Out' : '▶ Clock In'}
      </button>
    </div>
  )
}