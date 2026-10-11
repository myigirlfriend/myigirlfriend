import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import api from '@services/api'
import { useAuthStore } from '@store/index'
import { formatDuration, formatTime } from '@utils/formatTime'

const todayISO = () => new Date().toISOString().split('T')[0]

const sessionMinutes = (s) =>
  Math.floor(((s.clock_out ? new Date(s.clock_out) : new Date()) - new Date(s.clock_in)) / 60000)

export default function AdminHoursPage() {
  const operator = useAuthStore(s => s.operator)
  const [agents, setAgents] = useState(null)
  const [failed, setFailed] = useState(false)
  const [selectedDate, setSelectedDate] = useState(todayISO())

  const load = () => {
    setAgents(null)
    setFailed(false)
    api.get(`/api/operator/admin/hours?date=${selectedDate}`)
      .then(data => setAgents(data.agents))
      .catch(() => setFailed(true))
  }
  useEffect(load, [selectedDate])

  if (operator?.role !== 'admin') return <Navigate to="/operator/chats" replace />

  const totalMinutes = (agents || []).reduce((sum, a) => sum + (a.totalMinutes || 0), 0)

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-8 sm:py-10">
      <div className="max-w-3xl">
      <h1 className="text-2xl font-extrabold text-white">Agent hours</h1>
      <p className="mt-1 text-sm text-zinc-400">Time each agent was clocked in on the day you choose.</p>

      <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <label htmlFor="hours-date" className="admin-label">Day</label>
          <input
            id="hours-date"
            type="date"
            value={selectedDate}
            max={todayISO()}
            onChange={e => e.target.value && setSelectedDate(e.target.value)}
            className="admin-input w-auto [color-scheme:dark]"
          />
        </div>
        <div className="text-right">
          <div className="text-sm text-zinc-400">All agents</div>
          <div className="text-2xl font-extrabold text-white tabular-nums">{formatDuration(totalMinutes)}</div>
        </div>
      </div>

      {failed ? (
        <div className="mt-6 rounded-2xl border border-brand-border p-6">
          <p className="font-bold text-white">The hours could not be loaded.</p>
          <button onClick={load} className="admin-btn mt-4">Try again</button>
        </div>
      ) : !agents ? (
        <div className="mt-6 space-y-2" aria-busy="true">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="admin-skeleton h-16" />)}
        </div>
      ) : agents.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-dashed border-brand-border px-5 py-8 text-sm text-zinc-400">
          There are no agents yet.
        </p>
      ) : (
        <ul className="mt-6 divide-y divide-brand-border rounded-2xl border border-brand-border">
          {agents.map(agent => (
            <li key={agent.id} className="px-4 py-4 sm:px-5">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="truncate text-sm font-bold text-white">
                    {agent.name}
                    {agent.role === 'admin' && <span className="ml-2 font-normal text-zinc-400">admin</span>}
                  </div>
                  <div className="truncate text-xs text-zinc-400">{agent.email}</div>
                </div>
                <div className={`shrink-0 text-lg font-extrabold tabular-nums ${agent.totalMinutes > 0 ? 'text-white' : 'text-zinc-500'}`}>
                  {formatDuration(agent.totalMinutes)}
                </div>
              </div>

              {agent.sessions?.length > 0 ? (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {agent.sessions.map((s, i) => (
                    <li key={i} className="rounded-lg bg-white/5 px-2.5 py-1 text-xs text-zinc-400 tabular-nums">
                      <span className="font-bold text-white">{formatTime(s.clock_in)}</span>
                      {' to '}
                      {s.clock_out
                        ? <span className="font-bold text-white">{formatTime(s.clock_out)}</span>
                        : <span className="font-bold text-emerald-300">now</span>}
                      {` (${formatDuration(sessionMinutes(s))})`}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-1 text-xs text-zinc-500">Did not clock in</p>
              )}
            </li>
          ))}
        </ul>
      )}
      </div>
    </div>
  )
}
