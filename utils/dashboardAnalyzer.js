const getAirScore = (air) => {
  const aqi = air?.air?.aqi || 0;

  if (aqi <= 50) return 20;
  if (aqi <= 100) return 40;
  if (aqi <= 200) return 60;
  if (aqi <= 300) return 80;
  return 100;
};

const getWaterScore = (water) => {
  const tds = water?.tds || 0;

  if (tds <= 300) return 20;
  if (tds <= 500) return 40;
  if (tds <= 900) return 60;
  if (tds <= 1200) return 80;
  return 100;
};

const getWeatherScore = (weather) => {
  const w = weather?.weather || {};
  const temp = w.temperature || 0;
  const humidity = w.humidity || 0;
  const uv = w.uvIndex || 0;

  let score = 0;

  if (temp > 35) score += 40;
  else if (temp > 30) score += 25;

  if (humidity > 70) score += 30;
  else if (humidity > 50) score += 15;

  if (uv > 7) score += 30;
  else if (uv > 5) score += 15;

  return Math.min(score, 100);
};

const getWasteScore = (waste) => {
  const levelScore = (level) => {
    if (level === "HIGH") return 90;
    if (level === "MODERATE") return 60;
    return 30;
  };

  const plastic = levelScore(waste?.plasticWasteLevel || "LOW");
  const organic = levelScore(waste?.organicWasteLevel || "LOW");
  const recycling = waste?.recyclingRate || 0;

  const base = (plastic + organic) / 2;
  const finalScore = base - (recycling / 100) * 40;

  return Math.max(0, Math.min(100, Math.round(finalScore)));
};

const analyzeDashboard = ({ today, yesterday }) => {
  return {
    air: {
      today: getAirScore(today.air),
      yesterday: getAirScore(yesterday.air),
    },
    water: {
      today: getWaterScore(today.water),
      yesterday: getWaterScore(yesterday.water),
    },
    weather: {
      today: getWeatherScore(today.weather),
      yesterday: getWeatherScore(yesterday.weather),
    },
    waste: {
      today: getWasteScore(today.waste),
      yesterday: getWasteScore(yesterday.waste),
    },
  };
};

module.exports = {
  getAirScore,
  getWaterScore,
  getWeatherScore,
  getWasteScore,
  analyzeDashboard,
};