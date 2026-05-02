import { useEffect, useState } from 'react';
import { getEnvironmentSummary } from '../services/api.js';

function mergeLiveLocation(fallbackLocation, liveData) {
  return {
    ...fallbackLocation,
    ...liveData,
    id: fallbackLocation.id,
    city: liveData.city || fallbackLocation.city,
    region: liveData.region || fallbackLocation.region,
    displayName: liveData.displayName || fallbackLocation.displayName,
    isCustom: fallbackLocation.isCustom,
    isLive: true
  };
}

export function useEcoSenseApi(selectedLocation) {
  const [liveLocation, setLiveLocation] = useState(selectedLocation);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLiveLocation(selectedLocation);
    setStatus('loading');
    setError('');

    getEnvironmentSummary(selectedLocation)
      .then((data) => {
        if (cancelled) return;
        setLiveLocation(mergeLiveLocation(selectedLocation, data));
        setStatus('connected');
      })
      .catch((apiError) => {
        if (cancelled) return;
        setLiveLocation(selectedLocation);
        setStatus('fallback');
        setError(apiError.message || 'Backend unavailable');
      });

    return () => {
      cancelled = true;
    };
  }, [selectedLocation.id, selectedLocation.city]);

  return { liveLocation, apiStatus: status, apiError: error };
}
