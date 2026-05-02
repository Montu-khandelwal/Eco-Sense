import { useEffect, useState } from "react";
import Icon from "../components/Icon.jsx";
import CircularRiskBar from "../components/ui/CircularRiskBar.jsx";
import ImpactCard from "../components/ui/ImpactCard.jsx";
import ImpactTabs from "../components/ui/ImpactTabs.jsx";

export default function AqiScreen({ notify }) {
  const [tab, setTab] = useState("present");
  const [data, setData] = useState(null);

  // 🔥 FETCH REAL DATA
  useEffect(() => {
    const fetchAir = async () => {
      try {
        const res = await fetch(
          "http://localhost:2000/api/air?lat=26.78&lng=75.91&location=Goner"
        );
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Air fetch error:", err);
      }
    };

    fetchAir();
  }, []);

  if (!data) return <div>Loading AQI...</div>;

  const location = data;
  const air = data.air || {};

  const aqiItem = {
    key: "aqi",
    label: "AQI",
    value: String(air.aqi ?? "--"),
    risk: air.risk || "Moderate",
    tone: air.riskBadge || "warn"
  };

  return (
    <div className="page stack-large reveal-up">

      {/* HEADER */}
      <section className="air-hero compact-page-hero">
        <div>
          <p className="eyebrow light">Air quality overview</p>
          <h1>AQI</h1>
          <div className="mini-location">
            <Icon name="location_on" filled /> {location.displayName}
          </div>
        </div>
        <Icon name="air" filled className="hero-spark" />
      </section>

      {/* SCORE */}
      <section className={`purity-card aqi-score-card ${air.riskBadge}`}>
        <CircularRiskBar item={aqiItem} size="large" />

        <div>
          <span className={`risk-badge ${air.riskBadge}`}>
            {air.risk}
          </span>

          <p className="eyebrow accent">Air Quality Index</p>
          <h2>{air.aqi}</h2>

          <p>
            {air.aqi > 200
              ? "Air quality is poor. Limit outdoor exposure."
              : air.aqi > 100
              ? "Moderate air quality. Sensitive individuals should take care."
              : "Air quality is good for most activities."}
          </p>
        </div>
      </section>

      {/* STATS */}
      <section className="stat-grid gas-grid">
        {air.stats?.map(([label, value, icon]) => (
          <article className="small-stat gas-card" key={label}>
            <Icon name={icon} />
            <span>{label}</span>
            <strong>{value}</strong>
          </article>
        ))}
      </section>

      {/* TABS */}
      <ImpactTabs tab={tab} setTab={setTab} />

      {/* IMPACT */}
      {tab === "present" ? (
        <section className="impact-list compact-impact">
          <ImpactCard
            icon="self_improvement"
            title="Lifestyle Impact"
            points={air.impact?.lifestyle || ["No major impact detected"]}
          />

          <ImpactCard
            icon="eco"
            title="Environmental Impact"
            points={air.impact?.nature || ["Conditions are stable"]}
          />
        </section>
      ) : (
        <section className="future-card compact-future">
          <Icon name="airwave" filled />
          <h2>{air.impact?.futureTitle || "Future Outlook"}</h2>
          <p>{air.impact?.futureText || "Air conditions may remain stable"}</p>
        </section>
      )}

      {/* SOLUTIONS */}
      <section className="solutions-card aqi-solutions-card">
        <div className="solutions-head">
          <Icon name="health_and_safety" filled />
          <div>
            <p className="eyebrow accent">Solutions</p>
            <h2>
              {tab === "present"
                ? "Recommended actions"
                : "Future strategy"}
            </h2>
          </div>
        </div>

        <ul>
          {(tab === "present"
            ? air.solutions?.present
            : air.solutions?.future
          )?.map((item, i) => (
            <li key={i}>
              <Icon name="check_circle" filled /> {item}
            </li>
          )) || <li>No suggestions available</li>}
        </ul>

  
      </section>

      {/* ACTION */}
      <section className="action-panel compact-action">
        <Icon name="lightbulb" filled />
        <h2>{air.action || "Monitor air quality regularly"}</h2>
      </section>

    </div>
  );
}