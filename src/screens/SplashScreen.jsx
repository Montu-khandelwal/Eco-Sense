import { useEffect } from 'react';
import Icon from '../components/Icon.jsx';

export default function SplashScreen({ onStart }) {
  useEffect(() => {
    const timer = window.setTimeout(onStart, 3000);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <main className="splash-screen">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="leaf-pattern" />

      <section className="splash-card reveal-up">
        <div className="logo-tile">
          <Icon name="eco" filled className="logo-icon" />
        </div>
        <div>
          <h1>EcoSense</h1>
          <p>Understand your environmental impact with weather, water and AI-powered lifestyle guidance.</p>
        </div>
        <p className="splash-auto-text">Opening your dashboard...</p>
      </section>

      <div className="loader-ring" aria-label="Loading indicator" />
    </main>
  );
}
