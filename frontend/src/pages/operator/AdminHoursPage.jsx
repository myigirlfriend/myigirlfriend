import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '@services/api'
import { useAuthStore } from '@store/index'
import Spinner from '@components/common/Spinner'

export default function AdminHoursPage() {
  const operator = useAuthStore(s => s.operator)
  const navigate = useNavigate()
  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  )

  // Only admin can access this page
  useEffect(() => {
    if (operator?.role !== 'admin') navigate('/operator/dashboard')
  }, [operator])

  useEffect(() => {
    fetchHours()
  }, [selectedDate])

  const fetchHours = async () => {
    setLoading(true)
    try {
      const data = await api.get(`/api/operator/admin/hours?date=${selectedDate}`)
      setAgents(data.agents)
    } catch {} finally { setLoading(false) }
  }

  const formatMinutes = (minutes) => {
    if (!minutes) return '0h 0m'
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    return `${h}h ${m}m`
  }

  const totalMinutes = agents.reduce((sum, a) => sum + (a.totalMinutes || 0), 0)

  return (
    <div className="min-h-screen bg-brand-dark px-4 py-10">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-extrabold gradient-text">Agent Hours</h1>
            <p className="text-brand-muted text-sm mt-1">
              Track all agent login sessions
            </p>
          </div>
          <button
            onClick={() => navigate('/operator/dashboard')}
            className="text-brand-muted hover:text-white text-sm transition-colors"
          >
            ‹ Back to Dashboard
          </button>
        </div>

        {/* Date picker */}
        <div className="card mb-6 flex items-center gap-4">
          <label className="text-brand-muted text-sm font-semibold shrink-0">
            Select Date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className="input-field flex-1"
            max={new Date().toISOString().split('T')[0]}
          />
          <div className="text-right shrink-0">
            <div className="gradient-text font-extrabold text-lg">
              {formatMinutes(totalMinutes)}
            </div>
            <div className="text-brand-muted text-xs">Total all agents</div>
          </div>
        </div>

        {/* Agents table */}
        {loading ? (
          <div className="flex justify-center py-20"><Spinner size="lg" /></div>
        ) : (
          <div className="space-y-3">
            {agents.map(agent => (
              <div key={agent.id} className="card">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-bold text-white">{agent.name}</div>
                    <div className="text-brand-muted text-xs">{agent.email}</div>
                  </div>
                  <div className="text-right">
                    <div className={`font-extrabold text-lg ${
                      agent.totalMinutes > 0 ? 'gradient-text' : 'text-brand-muted'
                    }`}>
                      {formatMinutes(agent.totalMinutes)}
                    </div>
                    <div className="text-brand-muted text-xs">
                      {agent.sessions?.length || 0} session(s)
                    </div>
                  </div>
                </div>

                {/* Session breakdown */}
                {agent.sessions?.length > 0 && (
                  <div className="space-y-1.5 border-t border-brand-border pt-3">
                    {agent.sessions.map((s, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between text-xs text-brand-muted bg-brand-surface rounded-lg px-3 py-2"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-purple" />
                          <span>
                            Clock in: <span className="text-white font-semibold">
                              {new Date(s.clock_in).toLocaleTimeString([], {
                                hour: '2-digit', minute: '2-digit'
                              })}
                            </span>
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {s.clock_out ? (
                            <>
                              <span>
                                Clock out: <span className="text-white font-semibold">
                                  {new Date(s.clock_out).toLocaleTimeString([], {
                                    hour: '2-digit', minute: '2-digit'
                                  })}
                                </span>
                              </span>
                              <span className="gradient-text font-bold">
                                {formatMinutes(Math.floor(
                                  (new Date(s.clock_out) - new Date(s.clock_in)) / 60000
                                ))}
                              </span>
                            </>
                          ) : (
                            <span className="text-green-400 font-bold animate-pulse">
                              Active now
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* No sessions */}
                {(!agent.sessions || agent.sessions.length === 0) && (
                  <div className="text-brand-muted text-xs text-center py-2">
                    No sessions on this date
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}