import { useEffect, useState } from "react";
import Icon from "../components/Icon.jsx";
import CircularRiskBar from "../components/ui/CircularRiskBar.jsx";
import ImpactCard from "../components/ui/ImpactCard.jsx";
import ImpactTabs from "../components/ui/ImpactTabs.jsx";

export default function WasteScreen({ notify }) {
  const [tab, setTab] = useState("present");
  const [data, setData] = useState(null);
  const [saved, setSaved] = useState(false);

  // 🔥 FETCH REAL DATA
  useEffect(() => {
    const fetchWaste = async () => {
      try {
        const res = await fetch(
          "http://localhost:2000/api/waste?lat=26.78&lng=75.91&location=Goner"
        );
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Waste fetch error:", err);
      }
    };

    fetchWaste();
  }, []);

  if (!data) return <div>Loading waste data...</div>;

  const location = data;
  const waste = data.waste || {};

  const wasteItem = {
    key: "waste",
    label: "Waste",
    value: String(waste.today ?? waste.score ?? "--"),
    risk: waste.risk || "Moderate",
    tone: waste.riskBadge || "warn"
  };

  const apply = () => {
    setSaved(true);
    notify(`Waste routine saved for ${location.city}`);
  };

  return (
    <div className="page stack-large reveal-up">

      {/* HEADER */}
      <section className="water-hero waste-hero compact-page-hero">
        <div>
          <p className="eyebrow light">Waste management overview</p>
          <h1>Waste</h1>
          <div className="mini-location">
            <Icon name="location_on" filled /> {location.displayName}
          </div>
        </div>
        <Icon name="recycling" filled className="hero-spark" />
      </section>

      {/* SCORE */}
      <section className={`purity-card waste-score-card ${waste.riskBadge}`}>
        <CircularRiskBar item={wasteItem} size="large" />

        <div>
          <span className={`risk-badge ${waste.riskBadge}`}>
            {waste.risk}
          </span>

          <p className="eyebrow accent">Waste Score</p>
          <h2>{waste.today ?? waste.score}</h2><h2>{waste.score}</h2>

          <p>
            {waste.level === "HIGH"
              ? "High waste levels detected. Immediate management required."
              : waste.level === "MODERATE"
              ? "Moderate waste levels. Improve disposal practices."
              : "Waste levels are under control."}
          </p>
        </div>
      </section>

      {/* STATS */}
      <section className="stat-grid compact-stats">
        {waste.stats?.map(([label, value, icon]) => (
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
            points={waste.impact?.lifestyle || ["No major impact detected"]}
          />

          <ImpactCard
            icon="eco"
            title="Environmental Impact"
            points={waste.impact?.nature || ["Conditions are stable"]}
          />
        </section>
      ) : (
        <section className="future-card compact-future">
          <Icon name="compost" filled />
          <h2>{waste.impact?.futureTitle || "Future Outlook"}</h2>
          <p>
            {waste.impact?.futureText ||
              "Waste conditions may remain stable with proper handling"}
          </p>
        </section>
      )}

      {/* SOLUTIONS */}
      <section className="solutions-card waste-solutions-card">
        <div className="solutions-head">
          <Icon
            name={tab === "present" ? "delete_sweep" : "compost"}
            filled
          />
          <div>
            <p className="eyebrow accent">Solutions</p>
            <h2>
              {tab === "present"
                ? "Recommended actions"
                : "Future waste strategy"}
            </h2>
          </div>
        </div>

        <ul>
          {(tab === "present"
            ? waste.solutions?.present
            : waste.solutions?.future
          )?.map((item, i) => (
            <li key={i}>
              <Icon name="check_circle" filled /> {item}
            </li>
          )) || <li>No suggestions available</li>}
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
        <Icon name={saved ? "check_circle" : "delete_sweep"} filled />

        <h2>
          {saved
            ? "Waste routine added to your day."
            : waste.action || "Maintain proper waste management"}
        </h2>

        <div className="button-row">
          <button className="primary-btn" onClick={apply}>
            Apply
          </button>

          <button
            className="secondary-btn"
            onClick={() => notify("Waste tip dismissed")}
          >
            Dismiss
          </button>
        </div>
      </section>

    </div>
  );
}