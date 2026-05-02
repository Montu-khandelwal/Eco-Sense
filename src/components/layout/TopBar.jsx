import Icon from '../Icon.jsx';

export default function TopBar({ location, onLocationClick, onSettings, onBack }) {
  return (
    <header className="top-bar">
      <div className="top-left">
        {onBack ? (
          <button className="icon-btn" onClick={onBack} aria-label="Go back">
            <Icon name="arrow_back" />
          </button>
        ) : (
          <div className="avatar">YR</div>
        )}

        <div>
          <p className="eyebrow">Welcome back</p>
          <h2>EcoSense</h2>
        </div>
      </div>

      <button className="location-pill" onClick={onLocationClick} aria-label="Change location">
        <Icon name="location_on" filled />
        <span>{location.city}</span>
      </button>

      <button className="icon-btn" onClick={onSettings} aria-label="Open settings">
        <Icon name="settings" />
      </button>
    </header>
  );
}
