const ringColors = {
  'risk-red': ['#ff8a7a', '#d9281e'],
  'risk-yellow': ['#ffe083', '#f59e0b'],
  'risk-green': ['#6dfad2', '#009b72'],
  dark: ['#6dfad2', '#006b55']
};

const getRingProgress = (item) => {
  const numericValue = Number.parseFloat(String(item.value).replace(/[^0-9.]/g, '')) || 0;

  if (item.key === 'aqi') {
    // AQI is inverse: lower is better. The ring still fills enough to show intensity.
    return Math.max(18, Math.min(100, Math.round((numericValue / 150) * 100)));
  }

  return Math.max(0, Math.min(100, Math.round(numericValue)));
};

export default function CircularRiskBar({ item, size = 'default' }) {
  const progress = getRingProgress(item);
  const [colorStart, colorEnd] = ringColors[item.tone] ?? ringColors.dark;

  return (
    <span
      className={`circular-risk-bar ${item.tone} ${size === 'large' ? 'large' : ''}`}
      style={{
        '--ring-progress': `${progress}%`,
        '--ring-color': colorStart,
        '--ring-color-2': colorEnd
      }}
      aria-label={`${item.label} ${item.value} ${item.risk}`}
    >
      <span className="circular-risk-inner">
        <strong>{item.value}</strong>
      </span>
    </span>
  );
}
