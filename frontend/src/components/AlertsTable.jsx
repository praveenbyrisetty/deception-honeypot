export default function AlertsTable({ alerts, loading }) {
  if (loading) {
    return (
      <div className="table-section">
        <div className="loader">
          <div className="spinner"></div>
          Loading alerts...
        </div>
      </div>
    )
  }

  return (
    <div className="table-section">
      {/* Table Header */}
      <div className="table-header">
        <span className="table-title">📋 Captured Attack Alerts</span>
        <span className="table-count">{alerts.length} events</span>
      </div>

      {alerts.length === 0 ? (
        /* Empty State */
        <div className="empty-state">
          <div className="empty-icon">🛡️</div>
          <div className="empty-title">No attacks detected yet</div>
          <div className="empty-subtitle">
            Click "← View Trap" to see the fake login page,<br />
            try submitting credentials, and watch alerts appear here!
          </div>
        </div>
      ) : (
        /* Alerts Table */
        <table className="alerts-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Severity</th>
              <th>Timestamp</th>
              <th>IP Address</th>
              <th>Method</th>
              <th>Path Targeted</th>
              <th>Payload Captured</th>
              <th>User Agent</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((alert, index) => (
              <tr key={alert.id || index}>
                <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  {alerts.length - index}
                </td>

                {/* Severity Badge */}
                <td>
                  <span className={`severity-badge ${alert.severity}`}>
                    {alert.severity === 'critical' ? '🔴' : '🟠'} {alert.severity}
                  </span>
                </td>

                {/* Timestamp */}
                <td>
                  <span className="timestamp-text">
                    {new Date(alert.timestamp).toLocaleString()}
                  </span>
                </td>

                {/* IP Address */}
                <td>
                  <span className="ip-badge">
                    {alert.ip_address || 'Unknown'}
                  </span>
                </td>

                {/* HTTP Method */}
                <td>
                  <span className={`method-badge ${alert.method?.toLowerCase()}`}>
                    {alert.method}
                  </span>
                </td>

                {/* Path Targeted */}
                <td>
                  <span className="path-text">{alert.path}</span>
                </td>

                {/* Payload */}
                <td>
                  <span className="payload-text" title={JSON.stringify(alert.payload)}>
                    {alert.payload && Object.keys(alert.payload).length > 0
                      ? JSON.stringify(alert.payload)
                      : '—'}
                  </span>
                </td>

                {/* User Agent */}
                <td>
                  <span className="timestamp-text" title={alert.user_agent}>
                    {alert.user_agent?.substring(0, 40)}
                    {alert.user_agent?.length > 40 ? '...' : ''}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
