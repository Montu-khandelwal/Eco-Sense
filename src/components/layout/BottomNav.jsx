import Icon from '../Icon.jsx';
import { navItems } from '../../data/appData.js';

export default function BottomNav({ active, go }) {
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {navItems.map((item) => (
        <button key={item.id} className={active === item.id ? 'active' : ''} onClick={() => go(item.id)}>
          <Icon name={item.icon} filled={active === item.id} />
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
