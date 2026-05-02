async function getWeather(lat, lng) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,uv_index,precipitation,surface_pressure`;

  const res = await fetch(url);
  const data = await res.json();

  const current = data.current;

  return {
    temperature: current.temperature_2m,
    humidity: current.relative_humidity_2m,
    feelsLike: current.apparent_temperature,
    windSpeed: current.wind_speed_10m,
    uvIndex: current.uv_index,
    precipitation: current.precipitation,
    pressure: current.surface_pressure
  };
}

module.exports = { getWeather };