import { useEffect, useState } from "react";
import Icon from '../components/Icon.jsx';
import CircularRiskBar from '../components/ui/CircularRiskBar.jsx';
import { quickTips } from '../data/appData.js';

const scoreOnly = (value) => {
  const raw = String(value ?? '');
  const match = raw.match(/^\s*(\d+(?:\.\d+)?)\s*(?:\/\s*100|%)?\s*$/);
  return match ? match[1] : raw;
};

const getShortRisk = (risk) => {
  const value = String(risk || '').toLowerCase();
  if (value.includes('high')) return 'High';
  if (value.includes('medium')) return 'Medium';
  if (value.includes('low')) return 'Low';
  return risk || 'Open';
};

const buildDashboardCards = (location, apiData) => {
  const baseCards = location.metrics
    .filter((item) => ['weather', 'water', 'waste'].includes(item.key))
    .map((item) => {
      let newValue = item.value;

      if (apiData && apiData.weather && apiData.water && apiData.waste && apiData.air) {
        if (item.key === "weather") newValue = apiData.weather.today;
        if (item.key === "water") newValue = apiData.water.today;
        if (item.key === "waste") newValue = apiData.waste.today;
      }

      return { ...item, value: newValue };
    });

 const aqiValue = apiData?.air?.today ?? location.weather.aqi;

  const aqiCard = {
    key: 'aqi',
    label: 'AQI',
    value: String(aqiValue),
    helper: location.weather.aqiHelper,
    risk: location.weather.aqiRisk,
    icon: 'air',
    tone: location.weather.aqiTone,
    screen: 'aqi'
  };

  return [...baseCards, aqiCard];
};

const buildActionPages = (location) => [
  {
    label: 'Today’s best action',
    title: location.actionTitle,
    text: location.actionText,
    icon: 'tips_and_updates'
  },
  {
    label: 'Weather action',
    title: 'Plan outdoor work smartly',
    text: location.weather.action,
    icon: 'partly_cloudy_day'
  },
  {
    label: 'Water action',
    title: 'Protect daily water quality',
    text: location.water.purity.summary,
    icon: 'water_drop'
  },
  {
    label: 'Waste action',
    title: 'Keep segregation consistent',
    text: location.waste.summary,
    icon: 'recycling'
  }
];

export default function Dashboard({ go, notify, location }) {
  const [apiData, setApiData] = useState(null);

  // 🔥 Fetch backend
  useEffect(() => {
    fetch("http://localhost:2000/api/dashboard-analysis")
      .then(res => res.json())
      .then(data => setApiData(data))
      .catch(err => console.error(err));
  }, []);

  const dashboardCards = buildDashboardCards(location, apiData);
  const actionPages = buildActionPages(location);

  // 🔥 Overall score
  const getOverall = (type) => {
    if (!apiData) return type === "today" ? location.todayScore : location.yesterdayScore;

    const vals = [
      apiData.air[type],
      apiData.water[type],
      apiData.weather[type],
      apiData.waste[type]
    ];

    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  };

  return (
    <div className="page stack-large reveal-up">
      <section className="hero-panel compact-hero eco-summary-card eco-welcome-card">
        <div className="eco-score-copy">
          <strong className="eco-welcome-title">Welcome to Eco Sense</strong>
          <p className="eco-welcome-subtitle">Track weather, water, waste and air quality for {location.city}.</p>
        </div>
      </section>

      {/* 🔥 UPDATED SCORES */}
      <section className="status-strip score-status-grid secondary-status-grid status-line-three">
        <div><span>Yesterday</span><strong>{getOverall("yesterday")}</strong></div>
        <div><span>Today</span><strong>{getOverall("today")}</strong></div>
        <div><span>Area</span><strong>{location.city}</strong></div>
      </section>

      <section className="bento-grid risk-bento dashboard-risk-grid">
        {dashboardCards.map((item) => {
          const displayItem = { ...item, value: scoreOnly(item.value) };

          return (
            <button key={item.key} className={`metric-card animated-risk-card ${item.tone}`} onClick={() => go(item.screen)}>
              <span className="card-circle-wrap">
                <CircularRiskBar item={displayItem} />
              </span>
              <span className="metric-text card-label-only">
                <span>{item.label}</span>
              </span>
              <em>{getShortRisk(item.risk)}</em>
            </button>
          );
        })}
      </section>

      <section className="action-carousel-section">
        <div className="section-title-row compact-carousel-title">
          <h2>Today’s Best Action</h2>
          <span>Swipe</span>
        </div>
        <div className="action-carousel" aria-label="Slidable eco action cards">
          {actionPages.map((page) => (
            <article className="daily-card gradient-card compact-tip action-slide" key={page.label}>
              <div>
                <p className="eyebrow light">{page.label}</p>
                <h2><Icon name={page.icon} filled /> {page.title}</h2>
                <p>{page.text}</p>
              </div>
              <button className="glass-btn" onClick={() => notify(`${page.label} saved for ${location.city}.`)}>Save tip</button>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block">
        <div className="section-title-row">
          <h2>Daily Insights</h2>
          <button className="text-btn" onClick={() => go('insights')}>View all</button>
        </div>
        <div className="insight-strip">
          {quickTips.map((tip) => (
            <article className="insight-card" key={tip.title}>
              <Icon name={tip.icon} filled />
              <h3>{tip.title}</h3>
              <p>{tip.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="discover-grid">
        <button className="media-card podcast" onClick={() => notify('Podcast module opened.')}>
          <Icon name="mic" /><span>Eco Voices Podcast</span>
        </button>
        <button className="media-card video" onClick={() => notify('Documentary list opened.')}>
          <Icon name="play_circle" filled /><span>Latest Documentaries</span>
        </button>
      </section>
    </div>
  );
}