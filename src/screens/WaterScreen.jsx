import { useEffect, useState } from "react";
import Icon from "../components/Icon.jsx";
import CircularRiskBar from "../components/ui/CircularRiskBar.jsx";
import ImpactCard from "../components/ui/ImpactCard.jsx";
import ImpactTabs from "../components/ui/ImpactTabs.jsx";

export default function WaterScreen({ notify }) {
  const [tab, setTab] = useState("present");
  const [data, setData] = useState(null);
  const [saved, setSaved] = useState(false);

  // 🔥 API CALL
  useEffect(() => {
    const fetchWater = async () => {
      try {
        const res = await fetch(
          "http://localhost:2000/api/water?lat=26.78&lng=75.91&location=Goner"
        );
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Water fetch error:", err);
      }
    };

    fetchWater();
  }, []);

  if (!data) return <div>Loading water data...</div>;

  const location = data;
  const water = data.water;

  const waterItem = {
    key: "water-score",
    label: "Water Score",
    value: String(water.score),
    risk: water.risk,
    tone: water.tone
  };

  const apply = () => {
    setSaved(true);
    notify(`Water strategy applied for ${location.city}`);
  };

  return (
    <div className="page stack-large reveal-up">

      {/* HEADER */}
      <section className="water-hero compact-page-hero">
        <div>
          <p className="eyebrow light">Water quality overview</p>
          <h1>Water</h1>
          <div className="mini-location">
            <Icon name="location_on" filled /> {location.displayName}
          </div>
        </div>
      </section>

      {/* SCORE */}
      <section className={`purity-card water-score-card ${water.tone}`}>
        <CircularRiskBar item={waterItem} size="large" />

        <div>
          <span className={`risk-badge ${water.riskBadge}`}>
            {water.risk}
          </span>

          <span className="water-score-value">{water.score}</span>
          <span className="water-score-label">Score</span>

          <p>{water.summary}</p>
        </div>
      </section>

      {/* STATS */}
      <section className="stat-grid compact-stats">
        {water.stats?.map(([label, value, icon]) => (
          <article className="small-stat" key={label}>
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
            points={water.impact?.lifestyle || []}
          />

          <ImpactCard
            icon="eco"
            title="Nature Impact"
            points={water.impact?.nature || []}
          />
        </section>
      ) : (
        <section className="future-card compact-future">
          <Icon name="auto_awesome" filled />
          <h2>{water.impact?.futureTitle}</h2>
          <p>{water.impact?.futureText}</p>
        </section>
      )}

      {/* SOLUTIONS */}
      <section className="solutions-card water-solutions-card">
        <div className="solutions-head">
          <Icon name="tips_and_updates" filled />
          <div>
            <p className="eyebrow accent">Solutions</p>
            <h2>
              {tab === "present"
                ? "Recommended actions"
                : "Future preparation"}
            </h2>
          </div>
        </div>

        <ul>
          {(tab === "present"
            ? water.solutions?.present
            : water.solutions?.future
          )?.map((item, i) => (
            <li key={i}>
              <Icon name="check_circle" filled /> {item}
            </li>
          ))}
        </ul>
      </section>

      {/* ACTION */}
      <section
        className={
          saved
            ? "action-panel saved compact-action"
            : "action-panel compact-action"
        }
      >
        <Icon name={saved ? "check_circle" : "water_drop"} filled />
        <h2>
          {saved
            ? "Water strategy added to your routine."
            : water.action}
        </h2>

        <div className="button-row">
          <button className="primary-btn" onClick={apply}>
            Apply
          </button>

          <button
            className="secondary-btn"
            onClick={() => notify("Water tip dismissed")}
          >
            Dismiss
          </button>
        </div>
      </section>

    </div>
  );
}