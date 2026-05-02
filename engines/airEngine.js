const { getAQI } = require("../services/aqiService");

class airEngine {
  constructor() {}

  async getByCoordinates(lat, lng) {
    const data = await getAQI(lat, lng);

    return {
      source: "waqi",
      location: { lat, lng },
      air: {
        aqi: data.aqi,
        pm25: data.pm25,
        pm10: data.pm10,
        no2: data.no2,
        o3: data.o3,
        so2: data.so2
      }
    };
  }
}

module.exports = new airEngine();