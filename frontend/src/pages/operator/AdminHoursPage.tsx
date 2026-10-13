import { useCallback, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import LoadError from '@components/common/LoadError'
import { operatorApi } from '@services/api'
import { useAuthStore } from '@store/index'
import { formatDuration, formatTime, localDateISO, localDayBounds } from '@utils/formatTime'
import type { AgentHours, AgentSession } from '@/types'


// A session still running counts up to now
const sessionMinutes = (session: AgentSession) => {
  const end = session.clock_out ? new Date(session.clock_out) : new Date()
  return Math.floor((end.getTime() - new Date(session.clock_in).getTime()) / 60000)
}

// Shifts that cross midnight show the date too, so "22:00 to 02:00" is not confusing
const sessionTime = (iso: string, day: string) => {
  const { from, to } = localDayBounds(day)
  const t = new Date(iso)
  return t < from || t >= to
    ? `${t.toLocaleDateString([], { month: 'short', day: 'numeric' })} ${formatTime(iso)}`
    : formatTime(iso)
}

export default function AdminHoursPage() {
  const operator = useAuthStore((s) => s.operator)
  const [agents, setAgents] = useState<AgentHours[] | null>(null)
  const [failed, setFailed] = useState(false)
  const [selectedDate, setSelectedDate] = useState(() => localDateISO())

  const load = useCallback(() => {
    setAgents(null)
    setFailed(false)
    operatorApi.adminHours(selectedDate)
      .then((data) => setAgents(data.agents))
      .catch(() => setFailed(true))
  }, [selectedDate])
  useEffect(load, [load])

  if (operator?.role !== 'admin') return <Navigate to="/operator/chats" replace />

  const totalMinutes = (agents ?? []).reduce((sum, agent) => sum + (agent.totalMinutes || 0), 0)

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-8 sm:py-10">
      <div className="max-w-3xl">
        <h1 className="text-2xl font-extrabold text-white">Agent hours</h1>
        <p className="mt-1 text-sm text-brand-muted">Time each agent was clocked in on the day you choose.</p>

        <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <label htmlFor="hours-date" className="field__label">Day</label>
            <input
              id="hours-date"
              type="date"
              value={selectedDate}
              max={localDateISO()}
              onChange={(e) => e.target.value && setSelectedDate(e.target.value)}
              className="input input--compact input--sunken w-auto [color-scheme:dark]"
            />
          </div>
          <div className="text-right">
            <div className="text-sm text-brand-muted">All agents</div>
            <div className="text-2xl font-extrabold tabular-nums text-white">{formatDuration(totalMinutes)}</div>
          </div>
        </div>

        {failed ? (
          <div className="mt-6">
            <LoadError title="The hours could not be loaded." onRetry={load} />
          </div>
        ) : !agents ? (
          <div className="mt-6 space-y-2" aria-busy="true">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-16" />)}
          </div>
        ) : agents.length === 0 ? (
          <p className="mt-6 rounded-2xl border border-dashed border-brand-border px-5 py-8 text-sm text-brand-muted">
            There are no agents yet.
          </p>
        ) : (
          <ul className="mt-6 divide-y divide-brand-border rounded-2xl border border-brand-border">
            {agents.map((agent) => (
              <li key={agent.id} className="px-4 py-4 sm:px-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-bold text-white">
                      {agent.name}
                      {agent.role === 'admin' && <span className="ml-2 font-normal text-brand-muted">admin</span>}
                    </div>
                    <div className="truncate text-xs text-brand-muted">{agent.email}</div>
                  </div>
                  <div className={`shrink-0 text-lg font-extrabold tabular-nums ${agent.totalMinutes > 0 ? 'text-white' : 'text-brand-subtle'}`}>
                    {formatDuration(agent.totalMinutes)}
                  </div>
                </div>

                {agent.sessions.length > 0 ? (
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {agent.sessions.map((session) => (
                      <li key={session.clock_in} className="rounded-lg bg-white/5 px-2.5 py-1 text-xs tabular-nums text-brand-muted">
                        <span className="font-bold text-white">{sessionTime(session.clock_in, selectedDate)}</span>
                        {' to '}
                        {session.clock_out
                          ? <span className="font-bold text-white">{sessionTime(session.clock_out, selectedDate)}</span>
                          : <span className="font-bold text-emerald-300">now</span>}
                        {` (${formatDuration(sessionMinutes(session))})`}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-1 text-xs text-brand-muted">Did not clock in</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
