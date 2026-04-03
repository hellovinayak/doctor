import './StatsCard.css';

export default function StatsCard({ title, value, icon, color = 'primary', trend, trendValue }) {
  return (
    <div className={`stats-card stats-card-${color}`} id={`stats-${title?.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="stats-card-top">
        <div className="stats-card-info">
          <span className="stats-card-label">{title}</span>
          <h3 className="stats-card-value">{value}</h3>
          {trend && (
            <span className={`stats-card-trend ${trend}`}>
              {trend === 'up' ? '↑' : '↓'} {trendValue}
            </span>
          )}
        </div>
        <div className={`stats-card-icon stats-icon-${color}`}>
          {icon}
        </div>
      </div>
      <div className="stats-card-glow"></div>
    </div>
  );
}
