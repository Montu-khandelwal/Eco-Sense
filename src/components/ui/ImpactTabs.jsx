export default function ImpactTabs({ tab, setTab }) {
  return (
    <div className="segmented">
      <button className={tab === 'present' ? 'active' : ''} onClick={() => setTab('present')}>Present</button>
      <button className={tab === 'future' ? 'active' : ''} onClick={() => setTab('future')}>Future</button>
    </div>
  );
}
