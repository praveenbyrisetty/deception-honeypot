export default function StatsCards({ stats }) {
  const cards = [
    {
      icon: '🚨',
      iconClass: 'red',
      value: stats.total,
      valueClass: 'red',
      label: 'Total Attacks'
    },
    {
      icon: '🔴',
      iconClass: 'red',
      value: stats.critical,
      valueClass: 'red',
      label: 'Critical Severity'
    },
    {
      icon: '🟠',
      iconClass: 'orange',
      value: stats.high,
      valueClass: 'orange',
      label: 'High Severity'
    },
    {
      icon: '🌐',
      iconClass: 'blue',
      value: stats.unique_ips,
      valueClass: 'blue',
      label: 'Unique IPs'
    }
  ]

  return (
    <div className="stats-grid">
      {cards.map((card, i) => (
        <div className="stat-card" key={i} style={{ animationDelay: `${i * 0.05}s` }}>
          <div className={`stat-icon ${card.iconClass}`}>
            {card.icon}
          </div>
          <div>
            <div className={`stat-value ${card.valueClass}`}>{card.value}</div>
            <div className="stat-label">{card.label}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
