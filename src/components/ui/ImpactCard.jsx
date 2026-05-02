import Icon from '../Icon.jsx';

export default function ImpactCard({ icon, title, points }) {
  return (
    <article className="impact-card">
      <div className="impact-title">
        <Icon name={icon} filled />
        <h2>{title}</h2>
      </div>
      <ul>
        {points.map((point) => (
          <li key={point}>
            <Icon name="check_circle" filled />
            {point}
          </li>
        ))}
      </ul>
    </article>
  );
}
