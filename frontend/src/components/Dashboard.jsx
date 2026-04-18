import { useState, useEffect, useCallback } from 'react'
import StatsCards from './StatsCards'
import AlertsTable from './AlertsTable'

export default function Dashboard({ onGoToLogin }) {
  const [alerts, setAlerts] = useState([])
  const [stats, setStats] = useState({ total: 0, critical: 0, high: 0, unique_ips: 0 })
  const [loading, setLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState(new Date())

  // Fetch alerts and stats from the Flask backend
  const fetchData = useCallback(async () => {
    try {
      const [alertsRes, statsRes] = await Promise.all([
        fetch('/api/alerts'),
        fetch('/api/alerts/stats')
      ])
      const alertsData = await alertsRes.json()
      const statsData = await statsRes.json()
      setAlerts(alertsData)
      setStats(statsData)
      setLastRefresh(new Date())
    } catch (err) {
      console.error('Failed to fetch alerts:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Auto-refresh every 5 seconds so the dashboard is live
  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 5000)
    return () => clearInterval(interval)
  }, [fetchData])

  // Clear all captured alerts
  const handleClear = async () => {
    if (!window.confirm('Clear all captured alerts? This cannot be undone.')) return
    await fetch('/api/alerts/clear', { method: 'DELETE' })
    fetchData()
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-logo">
          <div className="header-logo-icon">🕵️</div>
          <div>
            <div className="header-brand">Honey<span>Trap</span> Monitor</div>
          </div>
        </div>

        <div className="header-right">
          <div className="live-badge">
            <span className="live-dot"></span>
            LIVE
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Last refresh: {lastRefresh.toLocaleTimeString()}
          </span>
          <button id="clear-alerts-btn" className="btn-clear" onClick={handleClear}>
            🗑 Clear Alerts
          </button>
          <button className="btn-clear" onClick={onGoToLogin}>
            ← View Trap
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Stats Cards */}
        <StatsCards stats={stats} />

        {/* Alerts Table */}
        <AlertsTable alerts={alerts} loading={loading} />
      </main>
    </div>
  )
}
