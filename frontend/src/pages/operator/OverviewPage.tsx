import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import Avatar from '@components/common/Avatar'
import ButtonLink from '@components/common/ButtonLink'
import LoadError from '@components/common/LoadError'
import Stat from '@components/common/Stat'
import OperatorPage from '@components/operator/OperatorPage'
import { getPersonaById } from '@config/personas'
import { operatorApi } from '@services/api'
import { formatDate, formatTime, timeAgo } from '@utils/formatTime'
import { plural } from '@utils/text'
import type { Overview } from '@/types'

// A shift left open from an earlier day shows its date too
const since = (iso: string) =>
  new Date(iso).toDateString() === new Date().toDateString() ? formatTime(iso) : `${formatDate(iso)}, ${formatTime(iso)}`

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
    <OperatorPage title="Overview" subtitle={today}>
      {failed ? (
        <div>
          <LoadError
            title="The numbers could not be loaded."
            description="Check that the server is running, then try again."
            onRetry={load}
          />
        </div>
      ) : !data ? (
        <div className="space-y-8" aria-busy="true">
          <div className="skeleton h-28" />
          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div className="skeleton h-64" />
            <div className="skeleton h-64" />
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
            <Stat label="Members" value={data.members} />
            <Stat label="Paying members" value={data.paying} />
            <Stat label="Active chats" value={data.activeChats} />
            <Stat label="Messages today" value={data.messagesToday} />
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
            {/* Chats nobody is handling yet */}
            <section>
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="heading text-2xl">Waiting for an agent</h2>
                <Link to="/operator/chats" className="link link--accent text-[15px]">
                  All conversations
                </Link>
              </div>

              {data.waiting.length === 0 ? (
                <p className="surface mt-4 px-5 py-8 text-base text-brand-muted">
                  Every active chat has an agent. Nothing is waiting.
                </p>
              ) : (
                <ul className="mt-4 space-y-2">
                  {data.waiting.map((c) => (
                    <li key={c.id} className="surface flex items-center gap-3 px-4 py-3.5">
                      <Avatar persona={getPersonaById(c.personaId) ?? { name: c.personaName }} />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-base font-extrabold text-brand-text">
                          {c.userName} <span className="font-semibold text-brand-muted">with {c.personaName}</span>
                        </div>
                        <div className="text-sm text-brand-muted">
                          {plural(c.messageCount, 'message')}, started {timeAgo(c.createdAt)}
                        </div>
                      </div>
                      <ButtonLink to={`/operator/chats?c=${c.id}`} variant="secondary" size="xs">Open</ButtonLink>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <div className="space-y-10">
              <section>
                <h2 className="heading text-2xl">On shift now</h2>
                {data.onShift.length === 0 ? (
                  <p className="mt-4 text-base text-brand-muted">No one is clocked in right now.</p>
                ) : (
                  <ul className="mt-4 space-y-3">
                    {data.onShift.map((agent) => (
                      <li key={agent.id} className="flex items-center gap-3">
                        <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-400" aria-hidden="true" />
                        <span className="min-w-0 flex-1 truncate text-base font-bold text-brand-text">{agent.name}</span>
                        <span className="text-sm tabular-nums text-brand-muted">since {since(agent.since)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <section>
                <h2 className="heading text-2xl">Models</h2>
                <p className="mt-4 text-base text-brand-muted">
                  <span className="font-bold text-brand-text">{data.modelsLive}</span> shown to members
                  {data.modelsHidden > 0 && <>, <span className="font-bold text-brand-text">{data.modelsHidden}</span> hidden</>}
                </p>
                <ButtonLink to="/operator/models?new=1" variant="secondary" size="sm" className="mt-4">
                  <Plus size={16} aria-hidden="true" /> Add model
                </ButtonLink>
              </section>
            </div>
          </div>
        </>
      )}
    </OperatorPage>
  )
}
