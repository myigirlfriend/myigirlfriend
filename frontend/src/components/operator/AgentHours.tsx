import { useCallback, useEffect, useState } from 'react'
import { Play, Square } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from '@components/common/Button'
import { operatorApi } from '@services/api'
import { formatClock, formatDuration, startOfLocalDay } from '@utils/formatTime'
import { errorMessage } from '@utils/text'

// Clock in / clock out control shown at the bottom of the dashboard rail
export default function AgentHours() {
  /** When the running shift started (ms), or null when clocked out */
  const [sessionStart, setSessionStart] = useState<number | null>(null)
  /** Local midnight that "today" is counted from */
  const [dayStart, setDayStart] = useState(() => startOfLocalDay().getTime())
  const [now, setNow] = useState(Date.now)
  /** Finished shifts today, in minutes. The running shift is added on top. */
  const [totalMinutes, setTotalMinutes] = useState(0)
  const [loading, setLoading] = useState(false)
  const clockedIn = sessionStart !== null

  // Ask the server for today's hours and whether a shift is running (it may have started on another device or day)
  const sync = useCallback(() => {
    const today = startOfLocalDay()
    setDayStart(today.getTime())
    return operatorApi.hours(today)
      .then((data) => {
        setTotalMinutes(data.totalMinutesToday || 0)
        setSessionStart(data.activeSince ? new Date(data.activeSince).getTime() : null)
        setNow(Date.now())
      })
      .catch(() => {})
  }, [])
  useEffect(() => { void sync() }, [sync])

  // Live timer tick. Re-sync once the day rolls over at midnight.
  useEffect(() => {
    if (sessionStart === null) return
    const interval = setInterval(() => {
      setNow(Date.now())
      if (startOfLocalDay().getTime() !== dayStart) void sync()
    }, 1000)
    return () => clearInterval(interval)
  }, [sessionStart, dayStart, sync])

  const elapsedSeconds = sessionStart === null ? 0 : Math.max(0, Math.floor((now - sessionStart) / 1000))
  // Only the part of the running shift after midnight counts towards today
  const runningTodayMs = sessionStart === null ? 0 : Math.max(0, now - Math.max(sessionStart, dayStart))
  const todayMinutes = totalMinutes + Math.floor(runningTodayMs / 60000)

  const handleClockIn = async () => {
    setLoading(true)
    try {
      const { session } = await operatorApi.clockIn()
      setSessionStart(new Date(session.clock_in).getTime())
      setNow(Date.now())
      toast.success('Clocked in')
    } catch (err) {
      toast.error(errorMessage(err))
      void sync()
    } finally { setLoading(false) }
  }

  const handleClockOut = async () => {
    setLoading(true)
    try {
      const data = await operatorApi.clockOut(startOfLocalDay())
      setSessionStart(null)
      setTotalMinutes(data.totalMinutesToday || 0)
      toast.success('Clocked out')
    } catch (err) {
      toast.error(errorMessage(err))
      void sync()
    } finally { setLoading(false) }
  }

  return (
    <div className="mx-3 mb-3 rounded-3xl bg-brand-card p-4">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-sm font-semibold text-brand-muted">{clockedIn ? 'On shift' : 'Your shift'}</span>
        <span className="text-sm text-brand-muted">
          Today <span className="font-bold tabular-nums text-brand-text">{formatDuration(todayMinutes)}</span>
        </span>
      </div>

      {clockedIn && (
        <div className="mt-1 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" />
          <span className="text-2xl font-black tabular-nums text-brand-text">{formatClock(elapsedSeconds)}</span>
        </div>
      )}

      <Button
        variant={clockedIn ? 'secondary' : 'primary'}
        size="sm"
        fullWidth
        onClick={clockedIn ? handleClockOut : handleClockIn}
        disabled={loading}
        className="mt-3"
      >
        {clockedIn
          ? <><Square size={14} aria-hidden="true" /> Clock out</>
          : <><Play size={14} aria-hidden="true" /> Clock in</>}
      </Button>
    </div>
  )
}
