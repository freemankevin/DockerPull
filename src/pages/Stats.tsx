import { useEffect, useState } from 'react'
import { statsApi } from '../api'
import { Package, CheckCircle, XCircle, Clock } from 'lucide-react'

export default function Stats() {
  const [stats, setStats] = useState({ total: 0, success: 0, failed: 0, pending: 0 })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await statsApi.get()
        setStats(res.data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchStats()
    const interval = setInterval(fetchStats, 5000)
    return () => clearInterval(interval)
  }, [])

  const cards = [
    { title: 'Total Images', value: stats.total, icon: Package, color: 'purple' },
    { title: 'Success', value: stats.success, icon: CheckCircle, color: 'green' },
    { title: 'Failed', value: stats.failed, icon: XCircle, color: 'red' },
    { title: 'Pending', value: stats.pending, icon: Clock, color: 'yellow' },
  ]

  return (
    <div>
      <div className="page-header">
        <h1>Overview</h1>
      </div>

      <div className="content-box">
        <div className="stats-grid">
          {cards.map((card) => (
            <div key={card.title} className={`stat-card stat-card-${card.color}`}>
              <div className="stat-card-content">
                <div className="stat-info">
                  <p className="stat-title">{card.title}</p>
                  <p className="stat-value">{card.value}</p>
                </div>
                <div className={`stat-icon-wrapper stat-icon-${card.color}`}>
                  <card.icon size={24} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
