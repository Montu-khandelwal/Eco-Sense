export const metrics = [
  {
    key: 'weather',
    label: 'Weather',
    value: '35/100',
    helper: 'Heat + UV risk',
    risk: 'High Risk',
    icon: 'thunderstorm',
    tone: 'risk-red',
    screen: 'weather'
  },
  {
    key: 'water',
    label: 'Water',
    value: '82/100',
    helper: 'Purity score',
    risk: 'Low Risk',
    icon: 'water_drop',
    tone: 'risk-green',
    screen: 'water'
  },
  {
    key: 'waste',
    label: 'Waste',
    value: '74/100',
    helper: 'Collection score',
    risk: 'Low Risk',
    icon: 'delete',
    tone: 'risk-green',
    screen: 'waste'
  },
  {
    key: 'assistant',
    label: 'Ask Gaia',
    value: 'AI',
    helper: 'Eco guidance',
    risk: 'Active',
    icon: 'eco',
    tone: 'dark',
    screen: 'assistant'
  }
];

export const quickTips = [
  {
    title: 'Use daylight first',
    text: 'Open curtains before switching lights on. Small daily habits reduce energy waste.',
    icon: 'light_mode'
  },
  {
    title: 'Water plants at dusk',
    text: 'Evening watering reduces evaporation and protects plants from harsh heat.',
    icon: 'psychiatry'
  },
  {
    title: 'Carry a bottle',
    text: 'A reusable bottle cuts plastic waste and keeps daily hydration consistent.',
    icon: 'local_drink'
  }
];

export const extraInsightTips = [
  {
    title: 'Compost wet waste',
    text: 'Kitchen peels and organic leftovers can become soil nutrition instead of landfill methane.',
    icon: 'compost'
  },
  {
    title: 'Check air before travel',
    text: 'When AQI rises, prefer mask, short routes and public transport during lower traffic hours.',
    icon: 'air'
  }
];

export const weatherStats = [
  ['Humidity', '45%', 'water_drop'],
  ['Wind', '12 mph', 'air'],
  ['UV Index', '6 High', 'sunny'],
  ['Pressure', '1012 hPa', 'speed']
];

export const waterStats = [
  ['Consumption', '342L', 'home'],
  ['Quality', 'Safe', 'health_and_safety'],
  ['Rate', '120 L/day', 'trending_down'],
  ['Storage', '1012 ML', 'database']
];

export const navItems = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'assistant', label: 'Gaia', icon: 'eco' }
];
