const { getWeather } = require("../services/weatherService");

class weatherEngine {
  constructor() {}

  // Direct pass-through from service
  async getByCoordinates(lat, lng) {
    const data = await getWeather(lat, lng);

    return {
      source: "open-meteo",
      location: { lat, lng },
      weather: data
    };
  }
}

module.exports = new weatherEngine();