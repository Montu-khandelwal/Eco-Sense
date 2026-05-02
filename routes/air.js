const express = require("express");
const router = express.Router();

const weatherEngine = require("../engines/weatherEngine");
const airEngine = require("../engines/airEngine");
const waterEngine = require("../engines/waterEngine");
const wasteEngine = require("../engines/wasteEngine");

const { getAirScore } = require("../utils/dashboardAnalyzer");
const impactGenerator = require("../utils/impactGenerator");

// Risk helper
const getRisk = (score) => {
  if (score >= 80) return { risk: "High", badge: "high" };
  if (score >= 50) return { risk: "Moderate", badge: "warn" };
  return { risk: "Low", badge: "safe" };
};

router.get("/", async (req, res) => {
  try {
    const { lat = 26.78, lng = 75.91, location = "Goner" } = req.query;

    const airRaw = await airEngine.getByCoordinates(lat, lng);
    const weatherRaw = await weatherEngine.getByCoordinates(lat, lng);
    const waterRaw = waterEngine.getByLocation(location);
    const wasteRaw = wasteEngine.getByLocation(location);

    const w = weatherRaw.weather;

    const ruleInput = {
      air: {
        score: airRaw.air?.aqi || 0,
      },
      weather: {
        temp: w.temperature,
        humidity: w.humidity,
        uv: w.uvIndex,
        pressure: w.pressure,
      },
      water: {
        tds: waterRaw.tds,
      },
      waste: {
        level: wasteRaw.plasticWasteLevel,
      },
    };

    const insights = impactGenerator(ruleInput, "air");

    const aqi = airRaw.air?.aqi || 0;

    const score = getAirScore(airRaw);
    const scoreData = getRisk(score);

    res.json({
      displayName: location,
      city: location,

      air: {
        aqi,

        score,
        today: score,   // 🔥 important
        risk: scoreData.risk,
        riskBadge: scoreData.badge,

        impact: {
          lifestyle: insights.current.impact.lifestyle,
          nature: insights.current.impact.nature,
          futureTitle: "Future Outlook",
          futureText:
            insights.future.outlook.lifestyle[0] ||
            "Air conditions may remain stable",
        },

        solutions: {
          present: insights.current.solutions.lifestyle,
          future: insights.future.preparations.lifestyle,
        },

        stats: [
          ["AQI", aqi, "air"],
          ["PM2.5", airRaw.air?.pm25 || "--", "blur_on"],
          ["PM10", airRaw.air?.pm10 || "--", "grain"],
          ["NO2", airRaw.air?.no2 || "--", "science"],
        ],

        action:
          insights.current.solutions.lifestyle[0] ||
          "Monitor air quality regularly",
      },
    });
  } catch (err) {
    console.error("Air Route Error:", err);
    res.status(500).json({ error: "Failed to fetch air data" });
  }
});

module.exports = router;