import Icon from '../components/Icon.jsx';
import { extraInsightTips, quickTips } from '../data/appData.js';

export default function InsightsScreen({ notify }) {
  const allTips = [...quickTips, ...extraInsightTips];

  return (
    <div className="page stack-large reveal-up">
      <section className="hero-panel simple">
        <div>
          <p className="eyebrow accent">Articles • News • Tips</p>
          <h1>Eco Insights</h1>
          <p>Quick learning cards for better habits and smarter environmental decisions.</p>
        </div>
      </section>

      <section className="insight-list-full">
        {allTips.map((tip) => (
          <article className="wide-insight" key={tip.title}>
            <div className="round-icon"><Icon name={tip.icon} filled /></div>
            <div>
              <h2>{tip.title}</h2>
              <p>{tip.text}</p>
            </div>
            <button className="icon-btn" onClick={() => notify(`${tip.title} saved.`)}>
              <Icon name="bookmark" />
            </button>
          </article>
        ))}
      </section>
    </div>
  );
}
