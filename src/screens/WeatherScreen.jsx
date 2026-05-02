import { useEffect, useState } from "react";
import Icon from "../components/Icon.jsx";
import CircularRiskBar from "../components/ui/CircularRiskBar.jsx";
import ImpactCard from "../components/ui/ImpactCard.jsx";
import ImpactTabs from "../components/ui/ImpactTabs.jsx";

export default function WeatherScreen({ unit, setUnit, notify }) {
  const [tab, setTab] = useState("present");
  const [data, setData] = useState(null);

  // 🔥 API CALL DIRECTLY HERE
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          "http://localhost:2000/api/weather?lat=26.78&lng=75.91&location=Goner",
        );
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Weather fetch error:", err);
      }
    };

    fetchWeather();
  }, []);

  if (!data) return <div>Loading weather...</div>;

  const location = data;
  const weather = data.weather || {};

  // 🔥 SAFE FALLBACKS (VERY IMPORTANT)
  const score = weather.today ?? weather.score ?? 50;
  const risk = weather.risk ?? "Moderate";
  const tone = weather.tone ?? "warn";
  const riskBadge = weather.riskBadge ?? "moderate";

  const weatherScoreItem = {
    key: "weather-score",
    label: "Weather Score",
    value: String(score),
    risk,
    tone,
  };

  return (
    <div className="page stack-large reveal-up">
      {/* HEADER */}
      <section className="weather-hero compact-page-hero">
        <div>
          <p className="eyebrow light">Environmental overview</p>
          <h1>Weather</h1>
          <div className="mini-location">
            <Icon name="location_on" filled /> {location.displayName}
          </div>
        </div>

        <button
          className="unit-switch"
          onClick={() => setUnit(unit === "C" ? "F" : "C")}
        >
          °{unit}
        </button>
      </section>

      {/* SCORE */}
      <section className="temperature-card weather-risk-card weather-score-card">
        <CircularRiskBar item={weatherScoreItem} size="large" />

        <div>
          <span className={`risk-badge ${riskBadge}`}>{risk}</span>

          <span className="weather-score-value">{score}</span>
          <span className="weather-score-label">Score</span>

          <p>
            <p>
              {weather.condition || "Normal"} • {weather.temperature ?? "--"}°C
            </p>
          </p>
        </div>
      </section>

      {/* TABS */}
      <ImpactTabs tab={tab} setTab={setTab} />

      {/* IMPACT */}
      {tab === "present" ? (
        <section className="impact-list compact-impact">
          <ImpactCard
            icon="self_improvement"
            title="Lifestyle Impact"
            points={
              weather.impact?.lifestyle || [
                "No major lifestyle impact detected",
              ]
            }
          />

          <ImpactCard
            icon="eco"
            title="Nature Impact"
            points={
              weather.impact?.nature || [
                "No major environmental impact detected",
              ]
            }
          />
        </section>
      ) : (
        <section className="future-card compact-future">
          <Icon name="auto_awesome" filled />
          <h2>{weather.impact?.futureTitle || "Future Outlook"}</h2>
          <p>{weather.impact?.futureText || "Conditions may remain stable"}</p>
        </section>
      )}

      {/* SOLUTIONS */}
      <section className="solutions-card weather-solutions-card">
        <div className="solutions-head">
          <Icon name="tips_and_updates" filled />
          <div>
            <p className="eyebrow accent">Solutions</p>
            <h2>
              {tab === "present" ? "Recommended actions" : "Future preparation"}
            </h2>
          </div>
        </div>

        <ul>
          {(tab === "present"
            ? weather.solutions?.present
            : weather.solutions?.future
          )?.length ? (
            (tab === "present"
              ? weather.solutions.present
              : weather.solutions.future
            ).map((item, i) => (
              <li key={i}>
                <Icon name="check_circle" filled /> {item}
              </li>
            ))
          ) : (
            <li>No suggestions available</li>
          )}
        </ul>
      </section>

      {/* STATS */}
      <section className="stat-grid compact-stats">
        {weather.stats?.length ? (
          weather.stats.map(([label, value, icon]) => (
            <article className="small-stat" key={label}>
              <Icon name={icon} />
              <span>{label}</span>
              <strong>{value}</strong>
            </article>
          ))
        ) : (
          <p>No stats available</p>
        )}
      </section>

      {/* ACTION */}
      <section className="action-panel compact-action">
        <Icon name="lightbulb" filled />
        <h2>{weather.action || "Stay prepared for current conditions"}</h2>

        <div className="button-row">
          <button
            className="primary-btn"
            onClick={() =>
              notify(`Weather strategy applied for ${location.city}`)
            }
          >
            Apply
          </button>

          <button
            className="secondary-btn"
            onClick={() => notify("Tip dismissed")}
          >
            Dismiss
          </button>
        </div>
      </section>
    </div>
  );
}
