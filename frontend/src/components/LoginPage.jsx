import { useState } from 'react'

export default function LoginPage({ onGoToDashboard }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // POST the credentials to our Flask honeypot trap — it logs everything!
      const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ username, password })
      })

      // Flask always returns 403 — we show the error to complete the deception
      const data = await response.json()
      setError(data.error || 'Authentication failed. Access denied.')
    } catch {
      setError('Authentication failed. Access denied.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Header Logo */}
        <div className="login-logo">
          <div className="login-logo-icon">🛡️</div>
          <span className="login-logo-text">SecureGateway</span>
        </div>

        <h1 className="login-title">Administrator Login</h1>
        <p className="login-subtitle">Authorized personnel only — all access is monitored</p>

        {/* The Trap: This form POSTs to our Flask backend */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Administrator ID</label>
            <input
              id="username"
              type="text"
              name="username"
              className="form-input"
              placeholder="Enter your admin ID"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="off"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Access Token / Password</label>
            <input
              id="password"
              type="password"
              name="password"
              className="form-input"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Show the error message from the backend */}
          {error && (
            <div className="login-error">
              <span>⛔</span>
              <span>{error}</span>
            </div>
          )}

          <button
            id="login-submit"
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Authenticate →'}
          </button>
        </form>

        {/* Secret link to reach the real dashboard — not visible to attackers */}
        <div className="login-footer">
          <p style={{ marginBottom: '0.5rem' }}>
            Internal monitoring access?{' '}
            <a
              href="#"
              id="dashboard-link"
              onClick={(e) => { e.preventDefault(); onGoToDashboard() }}
            >
              Open Dashboard
            </a>
          </p>
          <p>© 2024 SecureGateway Inc. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
