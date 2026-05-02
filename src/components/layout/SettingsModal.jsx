import { useState } from 'react';
import { buildCustomLocation, locationProfiles } from '../../data/locationData.js';
import Icon from '../Icon.jsx';

export default function SettingsModal({ darkMode, setDarkMode, unit, setUnit, location, setLocation, close }) {
  const [customArea, setCustomArea] = useState(location.isCustom ? location.city : '');

  const chooseLocation = (nextLocation) => {
    setLocation(nextLocation);
    setCustomArea('');
  };

  const saveCustomArea = (event) => {
    event.preventDefault();
    const areaName = customArea.trim();
    if (!areaName) return;
    setLocation(buildCustomLocation(areaName));
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <section className="settings-modal reveal-up">
        <div className="modal-head">
          <div>
            <p className="eyebrow accent">App preferences</p>
            <h2>Settings</h2>
          </div>
          <button className="icon-btn" onClick={close} aria-label="Close settings">
            <Icon name="close" />
          </button>
        </div>

        <div className="setting-row location-setting">
          <div className="setting-copy">
            <strong>Location</strong>
            <p>Pick a Jaipur district area or type a local Jaipur area manually. The dashboard, weather and water cards update instantly.</p>
          </div>

          <div className="location-picker">
            <form className="location-input-row" onSubmit={saveCustomArea}>
              <input
                value={customArea}
                onChange={(event) => setCustomArea(event.target.value)}
                placeholder="Enter Jaipur area manually"
                aria-label="Enter Jaipur area manually"
              />
              <button type="submit" className="mini-primary-btn">Set</button>
            </form>

            <div className="city-chip-grid" aria-label="Available Jaipur district areas">
              {locationProfiles.map((item) => (
                <button
                  key={item.id}
                  className={location.id === item.id ? 'city-chip active' : 'city-chip'}
                  onClick={() => chooseLocation(item)}
                >
                  {item.city}
                </button>
              ))}
            </div>

            <div className="selected-location-note">
              <Icon name="my_location" filled />
              <span>Active: {location.displayName}</span>
            </div>
          </div>
        </div>

        <div className="setting-row">
          <div>
            <strong>Dark mode</strong>
            <p>Use a softer night theme.</p>
          </div>
          <button className={darkMode ? 'switch on' : 'switch'} onClick={() => setDarkMode(!darkMode)} aria-label="Toggle dark mode">
            <span />
          </button>
        </div>

        <div className="setting-row">
          <div>
            <strong>Temperature unit</strong>
            <p>Choose Celsius or Fahrenheit.</p>
          </div>
          <div className="unit-group">
            <button className={unit === 'C' ? 'active' : ''} onClick={() => setUnit('C')}>°C</button>
            <button className={unit === 'F' ? 'active' : ''} onClick={() => setUnit('F')}>°F</button>
          </div>
        </div>

        <button className="primary-btn wide" onClick={close}>Done</button>
      </section>
    </div>
  );
}
