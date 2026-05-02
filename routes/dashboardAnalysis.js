const express = require("express");
const router = express.Router();

const { analyzeDashboard } = require("../utils/dashboardAnalyzer");

// engines (FIXED IMPORTS)
const airEngine = require("../engines/airEngine");
const waterEngine = require("../engines/waterEngine");
const weatherEngine = require("../engines/weatherEngine");
const wasteEngine = require("../engines/wasteEngine");

const seededRandom = (seed) => {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const stableShift = (value, seed, percent = 0.15) => {
  if (typeof value !== "number") return value;

  const rand = seededRandom(seed);
  const change = (rand * 2 - 1) * percent * value;

  return value + change;
};


router.get("/", async (req, res) => {
  try {
    const { lat = 26.78, lng = 75.91, location = "Goner" } = req.query;

    const seed = Number(lat) * 1000 + Number(lng) * 100;

    const today = {
      air: await airEngine.getByCoordinates(lat, lng),
      water: waterEngine.getByLocation(location),
      weather: await weatherEngine.getByCoordinates(lat, lng),
      waste: wasteEngine.getByLocation(location),
    };

    const yesterday = {
      air: {
        ...today.air,
        air: {
          ...today.air.air,
          aqi: stableShift(today.air.air.aqi, seed),
        },
      },
      water: {
        ...today.water,
        tds: stableShift(today.water.tds, seed + 1),
      },
      weather: {
        ...today.weather,
        weather: {
          ...today.weather.weather,
          temperature: stableShift(today.weather.weather.temperature, seed + 2),
          humidity: stableShift(today.weather.weather.humidity, seed + 3),
          uvIndex: stableShift(today.weather.weather.uvIndex, seed + 4),
        },
      },
      waste: {
        ...today.waste,
        recyclingRate: stableShift(today.waste.recyclingRate, seed + 5),
      },
    };

    const result = analyzeDashboard({ today, yesterday });

    res.status(200).json(result);
  } catch (err) {
    console.error("Dashboard Analysis Error:", err);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
});

module.exports = router;
