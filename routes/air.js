const express = require("express");
const router = express.Router();


const weatherEngine = require("../engines/weatherEngine");
const airEngine = require("../engines/airEngine");
const waterEngine = require("../engines/waterEngine");
const wasteEngine = require("../engines/wasteEngine");
const { getAirScore } = require("../utils/dashboardAnalyzer");

const impactGenerator = require("../utils/impactGenerator");

router.get("/", async (req, res) => {
  try {
    const { lat = 26.78, lng = 75.91, location = "Goner" } = req.query;

    // 🔹 FETCH AIR DATA
    const airRaw = await airEngine.getByCoordinates(lat, lng);
    const weatherRaw = await weatherEngine.getByCoordinates(lat, lng);
    const waterRaw = waterEngine.getByLocation(location);
  const wasteRaw = wasteEngine.getByLocation(location);

    const w = weatherRaw.weather;

    // 🔹 NORMALIZE DATA (VERY IMPORTANT)
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
        level: wasteRaw.plasticWasteLevel, // simple mapping
      },
    };

    // 🔹 GENERATE INSIGHTS
    const insights = impactGenerator(ruleInput, "air");

    

    const aqi = ruleInput.air.score;

const score = getAirScore(airRaw);

    // 🔹 FINAL RESPONSE
    res.json({
      displayName: location,
      city: location,

      air: {
        aqi,

        score,
        risk: scoreData.risk,
        riskBadge: scoreData.badge,

        // 🔥 IMPACT
        impact: {
          lifestyle: insights.current.impact.lifestyle,
          nature: insights.current.impact.nature,
          futureTitle: "Future Outlook",
          futureText:
            insights.future.outlook.lifestyle[0] ||
            "Air conditions may remain stable",
        },

        // 🔥 SOLUTIONS
        solutions: {
          present: insights.current.solutions.lifestyle,
          future: insights.future.preparations.lifestyle,
        },

        // 🔥 STATS
        stats: [
          ["AQI", aqi, "air"],
          ["PM2.5", airRaw.air?.pm25 || "--", "blur_on"],
          ["PM10", airRaw.air?.pm10 || "--", "grain"],
          ["NO2", airRaw.air?.no2 || "--", "science"],
        ],

        // 🔥 ACTION
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
