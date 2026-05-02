import Icon from '../components/Icon.jsx';

export default function WeatherWarning({ location, notify, go }) {
  const weather = location.weather;

  return (
    <div className="page stack-large reveal-up">
      <section className="warning-compact-card">
        <div className="warning-title-row">
          <span><Icon name="warning" filled /></span>
          <div>
            <p className="eyebrow accent">Reason for today’s score in {location.city}</p>
            <h1>{weather.warningTitle}</h1>
          </div>
        </div>

        <div className="warning-mini-grid">
          <div>
            <h2>Safety</h2>
            <p>{weather.warningSafety}</p>
          </div>
          <div>
            <h2>Effects</h2>
            <p>{weather.warningEffect}</p>
          </div>
        </div>
      </section>

      <section className="action-panel compact-action">
        <Icon name="shield" filled />
        <h2>Follow the suggested safety plan for {location.city} today.</h2>
        <div className="button-row">
          <button className="primary-btn" onClick={() => { notify('Safety plan saved.'); go('weather'); }}>Apply</button>
          <button className="secondary-btn" onClick={() => go('home')}>Back</button>
        </div>
      </section>
    </div>
  );
}
