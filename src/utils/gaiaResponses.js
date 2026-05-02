export function getGaiaAnswer(text, location) {
  const lower = text.toLowerCase();
  const city = location?.city ?? 'your Jaipur area';
  const weather = location?.weather;
  const water = location?.water;

  if (lower.includes('water')) {
    return `For ${city}, Jaipur, water availability is around ${water?.availability ?? 72}%. Start with bucket washing, full-load laundry and plant watering after sunset.`;
  }

  if (lower.includes('weather') || lower.includes('heat')) {
    return `In ${city}, Jaipur, today’s weather risk is ${weather?.risk ?? 'moderate'}. ${weather?.action ?? 'Use natural ventilation and avoid peak outdoor activity.'}`;
  }

  if (lower.includes('aqi') || lower.includes('air')) {
    return `AQI for ${city}, Jaipur is shown as ${weather?.aqi ?? 'moderate'} in this demo. Avoid traffic-heavy routes if the AQI card shows medium or high risk.`;
  }

  if (lower.includes('waste') || lower.includes('plastic') || lower.includes('garbage') || lower.includes('recycle')) {
    return `For ${city}, Jaipur, waste score is ${location?.waste?.value ?? '72/100'}. Start with a 3-bin habit: wet waste, dry recyclable waste and reject waste.`;
  }

  if (lower.includes('plant') || lower.includes('garden') || lower.includes('nature')) {
    return `For ${city}, Jaipur, ${weather?.impact?.nature?.[0] ?? 'water plants after sunset and group plants by water need.'}`;
  }

  return `A smart eco step for ${city}, Jaipur today: choose one repeatable action from the dashboard and save it to your routine.`;
}
