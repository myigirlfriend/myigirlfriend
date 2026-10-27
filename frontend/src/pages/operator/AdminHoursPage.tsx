import { useCallback, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Users } from 'lucide-react'
import Badge from '@components/common/Badge'
import EmptyState from '@components/common/EmptyState'
import Field from '@components/common/Field'
import LoadError from '@components/common/LoadError'
import Stat from '@components/common/Stat'
import OperatorPage from '@components/operator/OperatorPage'
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
    <OperatorPage narrow title="Agent hours" subtitle="Time each agent was clocked in on the day you choose.">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <Field id="hours-date" label="Day">
            <input
              id="hours-date"
              type="date"
              value={selectedDate}
              max={localDateISO()}
              onChange={(e) => e.target.value && setSelectedDate(e.target.value)}
              className="input input--compact w-auto"
            />
          </Field>
          <Stat label="All agents" value={formatDuration(totalMinutes)} className="min-w-[12rem]" />
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
          <div className="mt-6">
            <EmptyState icon={Users} title="No agents yet" description="Hours appear here once agents clock in from their dashboard." />
          </div>
        ) : (
          <ul className="mt-6 space-y-2">
            {agents.map((agent) => (
              <li key={agent.id} className="surface px-5 py-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 truncate text-base font-extrabold text-brand-text">
                      {agent.name}
                      {agent.role === 'admin' && <Badge>Admin</Badge>}
                    </div>
                    <div className="truncate text-sm text-brand-muted">{agent.email}</div>
                  </div>
                  <div className={`shrink-0 text-xl font-black tabular-nums ${agent.totalMinutes > 0 ? 'text-brand-text' : 'text-brand-subtle'}`}>
                    {formatDuration(agent.totalMinutes)}
                  </div>
                </div>

                {agent.sessions.length > 0 ? (
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {agent.sessions.map((session) => (
                      <li key={session.clock_in} className="rounded-full bg-brand-card px-3 py-1 text-sm tabular-nums text-brand-muted">
                        <span className="font-bold text-brand-text">{sessionTime(session.clock_in, selectedDate)}</span>
                        {' to '}
                        {session.clock_out
                          ? <span className="font-bold text-brand-text">{sessionTime(session.clock_out, selectedDate)}</span>
                          : <span className="font-bold text-emerald-300">now</span>}
                        {` (${formatDuration(sessionMinutes(session))})`}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-1 text-sm text-brand-muted">Did not clock in</p>
                )}
              </li>
            ))}
          </ul>
        )}
    </OperatorPage>
  )
}
