const express = require("express");
const router = express.Router();

const weatherEngine = require("../engines/weatherEngine");
const airEngine = require("../engines/airEngine");
const waterEngine = require("../engines/waterEngine");
const wasteEngine = require("../engines/wasteEngine");

const dashboardAnalyzer = require("../utils/dashboardAnalyzer");
const impactGenerator = require("../utils/impactGenerator");
const { getWeatherScore } = require("../utils/dashboardAnalyzer");

router.get("/", async (req, res) => {
  try {
    const { lat = 26.78, lng = 75.91, location = "Goner" } = req.query;

    // 🔹 raw data
    const weatherRaw = await weatherEngine.getByCoordinates(lat, lng);
    const airRaw = await airEngine.getByCoordinates(lat, lng);
    const waterRaw = waterEngine.getByLocation(location);
    const wasteRaw = wasteEngine.getByLocation(location);

    // 🔥 🔥 IMPORTANT: map to RULE ENGINE format

    const w = weatherRaw.weather;

    const ruleInput = {
      weather: {
        temp: w.temperature,
        humidity: w.humidity,
        uv: w.uvIndex,
        pressure: w.pressure,
      },
      air: {
        score: airRaw.air.aqi,
      },
      water: {
        tds: waterRaw.tds,
      },
      waste: {
        level: wasteRaw.plasticWasteLevel, // simple mapping
      },
    };

    

    // 🔹 generate FULL insights (impact + solutions together)
    const insights = impactGenerator(ruleInput, "weather");
   const score = getWeatherScore(weatherRaw);

    // 🔹 FINAL RESPONSE
    res.json({
      displayName: location,
      city: location,

      weather: {
        ...weatherRaw.weather,
score,
        condition:
          weatherRaw.weather.temperature > 35
            ? "Hot"
            : weatherRaw.weather.temperature < 15
              ? "Cold"
              : "Normal",

        // 🔥 IMPACT (CURRENT + FUTURE)
        impact: {
          lifestyle: insights.current.impact.lifestyle,
          nature: insights.current.impact.nature,
          futureTitle: "Future Outlook",
          futureText:
            insights.future.outlook.lifestyle[0] ||
            "Conditions may remain stable",
        },

        // 🔥 SOLUTIONS (NOW PROPERLY MAPPED)
        solutions: {
          present: insights.current.solutions.lifestyle,
          future: insights.future.preparations.lifestyle,
        },

        stats: [
          ["Temperature", `${weatherRaw.weather.temperature}°C`, "thermostat"],
          ["Humidity", `${weatherRaw.weather.humidity}%`, "water_drop"],
          ["Wind", `${weatherRaw.weather.windSpeed} km/h`, "air"],
          ["UV Index", weatherRaw.weather.uvIndex, "wb_sunny"],
        ],

        // 🔥 ACTION (from current solutions)
        action:
          insights.current.solutions.lifestyle[0] ||
          "Stay prepared for current conditions",
      },
    });
  } catch (err) {
    console.error("Weather Route Error:", err);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

module.exports = router;
