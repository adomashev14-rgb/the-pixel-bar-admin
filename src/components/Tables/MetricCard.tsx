import type { CSSProperties } from 'react';

type MetricCardProps = {
  label: string;
  value: string;
  icon?: string;
  accentColor?: string;
};

export const MetricCard: React.FC<MetricCardProps> = ({ label, value, icon, accentColor }) => {
  const style: CSSProperties = accentColor ? { ['--metric-accent' as const]: accentColor } : {};

  return (
    <div className="metric-card" style={style}>
      {icon && (
        <div className="metric-icon" aria-hidden>
          {icon}
        </div>
      )}
      <div className="metric-value">{value}</div>
      <div className="metric-label">{label}</div>
    </div>
  );
};
