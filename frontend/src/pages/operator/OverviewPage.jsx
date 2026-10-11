import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import api from '@services/api'
import Avatar from '@components/common/Avatar'
import { getPersonaById } from '@config/personas'
import { formatDate, formatTime, timeAgo } from '@utils/formatTime'

// A shift left open from an earlier day shows its date too
const since = (iso) =>
  new Date(iso).toDateString() === new Date().toDateString() ? formatTime(iso) : `${formatDate(iso)}, ${formatTime(iso)}`

function Stat({ label, value }) {
  return (
    <div className="bg-brand-surface px-5 py-4">
      <div className="text-sm text-zinc-400">{label}</div>
      <div className="mt-1 text-3xl font-extrabold text-white tabular-nums">{value}</div>
    </div>
  )
}

export default function OverviewPage() {
  const [data, setData] = useState(null)
  const [failed, setFailed] = useState(false)

  const load = () => {
    setFailed(false)
    api.get('/api/operator/admin/overview').then(setData).catch(() => setFailed(true))
  }
  useEffect(load, [])

  const today = new Date().toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-8 sm:py-10">
      <h1 className="text-2xl font-extrabold text-white">Overview</h1>
      <p className="mt-1 text-sm text-zinc-400">{today}</p>

      {failed ? (
        <div className="mt-8 rounded-2xl border border-brand-border p-6">
          <p className="text-white font-bold">The numbers could not be loaded.</p>
          <p className="mt-1 text-sm text-zinc-400">Check that the server is running, then try again.</p>
          <button onClick={load} className="admin-btn mt-4">Try again</button>
        </div>
      ) : !data ? (
        <div className="mt-8 space-y-8" aria-busy="true">
          <div className="admin-skeleton h-24" />
          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div className="admin-skeleton h-64" />
            <div className="admin-skeleton h-64" />
          </div>
        </div>
      ) : (
        <>
          <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-px overflow-hidden rounded-2xl border border-brand-border bg-brand-border">
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
                <Link to="/operator/chats" className="text-sm font-bold text-brand-pink hover:underline">
                  All conversations
                </Link>
              </div>

              {data.waiting.length === 0 ? (
                <p className="mt-4 rounded-2xl border border-dashed border-brand-border px-5 py-8 text-sm text-zinc-400">
                  Every active chat has an agent. Nothing is waiting.
                </p>
              ) : (
                <ul className="mt-4 divide-y divide-brand-border rounded-2xl border border-brand-border">
                  {data.waiting.map(c => (
                    <li key={c.id} className="flex items-center gap-3 px-4 py-3">
                      <Avatar persona={getPersonaById(c.personaId) || { name: c.personaName }} size="md" />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-bold text-white">
                          {c.userName} <span className="font-normal text-zinc-400">with {c.personaName}</span>
                        </div>
                        <div className="text-xs text-zinc-400">
                          {c.messageCount} {c.messageCount === 1 ? 'message' : 'messages'}, started {timeAgo(c.createdAt)}
                        </div>
                      </div>
                      <Link to={`/operator/chats?c=${c.id}`} className="admin-btn py-1.5 px-3">Open</Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <div className="space-y-10">
              <section>
                <h2 className="text-lg font-extrabold text-white">On shift now</h2>
                {data.onShift.length === 0 ? (
                  <p className="mt-4 text-sm text-zinc-400">No one is clocked in right now.</p>
                ) : (
                  <ul className="mt-4 space-y-3">
                    {data.onShift.map(a => (
                      <li key={a.id} className="flex items-center gap-3">
                        <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-400" aria-hidden="true" />
                        <span className="min-w-0 flex-1 truncate text-sm font-bold text-white">{a.name}</span>
                        <span className="text-xs text-zinc-400 tabular-nums">since {since(a.since)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <section>
                <h2 className="text-lg font-extrabold text-white">Models</h2>
                <p className="mt-4 text-sm text-zinc-400">
                  <span className="font-bold text-white">{data.modelsLive}</span> shown to members
                  {data.modelsHidden > 0 && <>, <span className="font-bold text-white">{data.modelsHidden}</span> hidden</>}
                </p>
                <Link to="/operator/models?new=1" className="admin-btn mt-4">
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
