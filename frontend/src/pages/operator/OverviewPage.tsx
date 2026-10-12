import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import Avatar from '@components/common/Avatar'
import LoadError from '@components/common/LoadError'
import { getPersonaById } from '@config/personas'
import { operatorApi } from '@services/api'
import { formatDate, formatTime, timeAgo } from '@utils/formatTime'
import { plural } from '@utils/text'
import type { Overview } from '@/types'

// A shift left open from an earlier day shows its date too
const since = (iso: string) =>
  new Date(iso).toDateString() === new Date().toDateString() ? formatTime(iso) : `${formatDate(iso)}, ${formatTime(iso)}`

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-brand-surface px-5 py-4">
      <div className="text-sm text-brand-muted">{label}</div>
      <div className="mt-1 text-3xl font-extrabold tabular-nums text-white">{value}</div>
    </div>
  )
}

export default function OverviewPage() {
  const [data, setData] = useState<Overview | null>(null)
  const [failed, setFailed] = useState(false)

  const load = useCallback(() => {
    setFailed(false)
    operatorApi.overview().then(setData).catch(() => setFailed(true))
  }, [])
  useEffect(load, [load])

  const today = new Date().toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-8 sm:py-10">
      <h1 className="text-2xl font-extrabold text-white">Overview</h1>
      <p className="mt-1 text-sm text-brand-muted">{today}</p>

      {failed ? (
        <div className="mt-8">
          <LoadError
            title="The numbers could not be loaded."
            description="Check that the server is running, then try again."
            onRetry={load}
          />
        </div>
      ) : !data ? (
        <div className="mt-8 space-y-8" aria-busy="true">
          <div className="skeleton h-24" />
          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div className="skeleton h-64" />
            <div className="skeleton h-64" />
          </div>
        </div>
      ) : (
        <>
          <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-brand-border bg-brand-border lg:grid-cols-4">
            <Stat label="Members" value={data.members} />
            <Stat label="Paying members" value={data.paying} />
            <Stat label="Active chats" value={data.activeChats} />
            <Stat label="Messages today" value={data.messagesToday} />
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
            {/* Chats nobody is handling yet */}
            <section>
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-lg font-extrabold text-white">Waiting for an agent</h2>
                <Link to="/operator/chats" className="rounded text-sm font-bold text-brand-pink hover:underline">
                  All conversations
                </Link>
              </div>

              {data.waiting.length === 0 ? (
                <p className="mt-4 rounded-2xl border border-dashed border-brand-border px-5 py-8 text-sm text-brand-muted">
                  Every active chat has an agent. Nothing is waiting.
                </p>
              ) : (
                <ul className="mt-4 divide-y divide-brand-border rounded-2xl border border-brand-border">
                  {data.waiting.map((c) => (
                    <li key={c.id} className="flex items-center gap-3 px-4 py-3">
                      <Avatar persona={getPersonaById(c.personaId) ?? { name: c.personaName }} />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-bold text-white">
                          {c.userName} <span className="font-normal text-brand-muted">with {c.personaName}</span>
                        </div>
                        <div className="text-xs text-brand-muted">
                          {plural(c.messageCount, 'message')}, started {timeAgo(c.createdAt)}
                        </div>
                      </div>
                      <Link to={`/operator/chats?c=${c.id}`} className="btn btn--ghost btn--xs">Open</Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <div className="space-y-10">
              <section>
                <h2 className="text-lg font-extrabold text-white">On shift now</h2>
                {data.onShift.length === 0 ? (
                  <p className="mt-4 text-sm text-brand-muted">No one is clocked in right now.</p>
                ) : (
                  <ul className="mt-4 space-y-3">
                    {data.onShift.map((agent) => (
                      <li key={agent.id} className="flex items-center gap-3">
                        <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-400" aria-hidden="true" />
                        <span className="min-w-0 flex-1 truncate text-sm font-bold text-white">{agent.name}</span>
                        <span className="text-xs tabular-nums text-brand-muted">since {since(agent.since)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <section>
                <h2 className="text-lg font-extrabold text-white">Models</h2>
                <p className="mt-4 text-sm text-brand-muted">
                  <span className="font-bold text-white">{data.modelsLive}</span> shown to members
                  {data.modelsHidden > 0 && <>, <span className="font-bold text-white">{data.modelsHidden}</span> hidden</>}
                </p>
                <Link to="/operator/models?new=1" className="btn btn--ghost btn--sm mt-4">
                  <Plus size={16} aria-hidden="true" /> Add model
                </Link>
              </section>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
