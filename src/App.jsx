import { useRef, useState } from 'react';
import BottomNav from './components/layout/BottomNav.jsx';
import SettingsModal from './components/layout/SettingsModal.jsx';
import TopBar from './components/layout/TopBar.jsx';
import { defaultLocation, normalizeSavedLocation } from './data/locationData.js';
import { useLocalStorageState } from './hooks/useLocalStorageState.js';
import { useEcoSenseApi } from './hooks/useEcoSenseApi.js';
import AssistantScreen from './screens/AssistantScreen.jsx';
import Dashboard from './screens/Dashboard.jsx';
import InsightsScreen from './screens/InsightsScreen.jsx';
import SplashScreen from './screens/SplashScreen.jsx';
import WaterScreen from './screens/WaterScreen.jsx';
import WeatherScreen from './screens/WeatherScreen.jsx';
import WeatherWarning from './screens/WeatherWarning.jsx';
import WasteScreen from './screens/WasteScreen.jsx';
import AqiScreen from './screens/AqiScreen.jsx';

function App() {
  const [screen, setScreen] = useState('splash');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [theme, setTheme] = useLocalStorageState('ecosense-theme', 'light');
  const [unit, setUnit] = useLocalStorageState('ecosense-unit', 'C');
  const [savedLocation, setSavedLocation] = useLocalStorageState('ecosense-jaipur-area', defaultLocation);
  const toastTimer = useRef(null);

  const location = normalizeSavedLocation(savedLocation);
  const { liveLocation, apiStatus, apiError } = useEcoSenseApi(location);
  const darkMode = theme === 'dark';

  const setDarkMode = (enabled) => {
    setTheme(enabled ? 'dark' : 'light');
  };

  const go = (nextScreen) => {
    setScreen(nextScreen);
    document.querySelector('.app-surface')?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const notify = (message) => {
    setToast(message);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(''), 2400);
  };

  const updateLocation = (nextLocation) => {
    setSavedLocation(nextLocation);
    notify(`Area changed to ${nextLocation.city}.`);
  };

  const activeScreen = screen === 'splash' || screen === 'alert' ? 'home' : screen;

  return (
    <div className={darkMode ? 'theme dark' : 'theme'}>
      <div className="stage">
        <div className="phone-shell">
          <div className="app-surface">
            {screen === 'splash' ? (
              <SplashScreen onStart={() => go('home')} />
            ) : (
              <>
                <TopBar
                  location={liveLocation}
                  onLocationClick={() => setSettingsOpen(true)}
                  onSettings={() => setSettingsOpen(true)}
                  onBack={screen !== 'home' ? () => go('home') : null}
                />
                <main className="screen-content">
                  {screen === 'home' && <Dashboard go={go} notify={notify} location={liveLocation} apiStatus={apiStatus} apiError={apiError} />}
                  {screen === 'weather' && <WeatherScreen location={liveLocation} unit={unit} setUnit={setUnit} notify={notify} />}
                  {screen === 'water' && <WaterScreen location={liveLocation} notify={notify} />}
                  {screen === 'waste' && <WasteScreen location={liveLocation} notify={notify} />}
                  {screen === 'aqi' && <AqiScreen location={liveLocation} notify={notify} />}
                  {screen === 'assistant' && <AssistantScreen location={liveLocation} notify={notify} go={go} />}
                  {screen === 'alert' && <WeatherWarning location={liveLocation} notify={notify} go={go} />}
                  {screen === 'insights' && <InsightsScreen notify={notify} />}
                </main>
                <BottomNav active={activeScreen} go={go} />
              </>
            )}

            {settingsOpen && (
              <SettingsModal
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                unit={unit}
                setUnit={setUnit}
                location={location}
                setLocation={updateLocation}
                close={() => setSettingsOpen(false)}
              />
            )}

            {toast && <div className="toast">{toast}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
