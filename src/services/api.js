const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:2000/api';

const AREA_COORDINATES = {
  mansarovar: { lat: 26.8548, lng: 75.7667 },
  'malviya nagar': { lat: 26.8530, lng: 75.8060 },
  'vaishali nagar': { lat: 26.9124, lng: 75.7430 },
  'c-scheme': { lat: 26.9120, lng: 75.7970 },
  'civil lines': { lat: 26.9067, lng: 75.7873 },
  'bani park': { lat: 26.9295, lng: 75.7910 },
  'raja park': { lat: 26.8959, lng: 75.8270 },
  jagatpura: { lat: 26.8420, lng: 75.8636 },
  'pratap nagar': { lat: 26.8070, lng: 75.8080 },
  sanganer: { lat: 26.8210, lng: 75.7860 },
  'tonk road': { lat: 26.8577, lng: 75.8052 },
  'ajmer road': { lat: 26.8936, lng: 75.7482 },
  jhotwara: { lat: 26.9530, lng: 75.7480 },
  'vidhyadhar nagar': { lat: 26.9730, lng: 75.7800 },
  durgapura: { lat: 26.8430, lng: 75.7900 },
  gopalpura: { lat: 26.8650, lng: 75.7770 },
  sodala: { lat: 26.9000, lng: 75.7750 },
  amer: { lat: 26.9855, lng: 75.8513 },
  sitapura: { lat: 26.7620, lng: 75.8360 },
  'vki area': { lat: 27.0100, lng: 75.7800 },
  bagru: { lat: 26.8095, lng: 75.5457 },
  chomu: { lat: 27.1700, lng: 75.7200 },
  kanota: { lat: 26.8660, lng: 75.9500 },
  jamdoli: { lat: 26.8920, lng: 75.8790 },
  'narayan vihar': { lat: 26.8400, lng: 75.7400 }
};

function normalizeArea(value = '') {
  return String(value).trim().toLowerCase().replace(/[_-]+/g, ' ').replace(/\s+/g, ' ');
}

function getLocationPayload(location) {
  const key = normalizeArea(location?.city || location?.area || location?.displayName);
  const coordinates = AREA_COORDINATES[key] || {};

  return {
    area: location?.city || location?.area || 'Mansarovar',
    city: location?.city || location?.area || 'Mansarovar',
    lat: location?.lat ?? coordinates.lat,
    lng: location?.lng ?? coordinates.lng
  };
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with ${response.status}`);
  }

  return response.json();
}

export async function getEnvironmentSummary(location) {
  const params = new URLSearchParams();
  const payload = getLocationPayload(location);
  params.set('area', payload.area);
  if (payload.lat) params.set('lat', payload.lat);
  if (payload.lng) params.set('lng', payload.lng);

  return request(`/summary?${params.toString()}`);
}

export async function getBackendLocations() {
  const data = await request('/locations');
  return data.locations || [];
}

export async function sendGaiaMessage(message, location, history = []) {
  const data = await request('/gaia', {
    method: 'POST',
    body: JSON.stringify({
      message,
      location: getLocationPayload(location),
      history: history.map((item) => ({ role: item.role, text: item.text })).slice(-10)
    })
  });

  return data.answer;
}

export { API_BASE_URL };
