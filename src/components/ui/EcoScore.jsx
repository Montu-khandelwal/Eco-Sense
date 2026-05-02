import { useMemo } from 'react';

export default function EcoScore({ score, label, compact = false }) {
  const style = useMemo(() => ({ '--score': `${score * 3.6}deg` }), [score]);

  return (
    <div className={compact ? 'eco-score compact' : 'eco-score'} style={style}>
      <div className="score-ring">
        <strong>{score}</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}
