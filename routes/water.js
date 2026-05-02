const express = require("express");
const router = express.Router();

const weatherEngine = require("../engines/weatherEngine");
const airEngine = require("../engines/airEngine");
const waterEngine = require("../engines/waterEngine");
const wasteEngine = require("../engines/wasteEngine");
const impactGenerator = require("../utils/impactGenerator");

router.get("/", async (req, res) => {
  try {
    const { location = "Goner", lat = 26.78, lng = 75.91 } = req.query;

    // 🔹 GET WATER DATA (from your static dataset)
       const airRaw = await airEngine.getByCoordinates(lat, lng);
        const weatherRaw = await weatherEngine.getByCoordinates(lat, lng);
        const waterRaw = waterEngine.getByLocation(location);
         const wasteRaw = wasteEngine.getByLocation(location);

         
    const w = weatherRaw.weather;
    
    // 🔹 RULE INPUT (VERY IMPORTANT STRUCTURE)
    const ruleInput = {
      water: {
        tds: waterRaw.tds,
        fluoride: waterRaw.fluoride,
        nitrate: waterRaw.nitrate
      },
       waste: {
        plastic: wasteRaw.plasticWasteLevel,
        organic: wasteRaw.organicWasteLevel,
        recycling: wasteRaw.recyclingRate,
      },
      air: {
        score: airRaw.air?.aqi || 0,
      },
      weather: {
        temp: w.temperature,
        humidity: w.humidity,
        uv: w.uvIndex,
        pressure: w.pressure,
      },
    };

    // 🔹 GENERATE IMPACT + SOLUTIONS (ONLY WATER RULES)
    const impacts = impactGenerator(ruleInput, "water");

    // 🔹 SIMPLE SCORE (reuse your logic style)
    const getWaterScore = (tds) => {
      if (tds <= 300) return 20;
      if (tds <= 500) return 40;
      if (tds <= 900) return 60;
      if (tds <= 1200) return 80;
      return 100;
    };

    const score = getWaterScore(waterRaw.tds);

    // 🔹 FINAL RESPONSE (FRONTEND READY)
    res.json({
      displayName: waterRaw.location,
      city: waterRaw.location,

      water: {
        ...waterRaw,

        score,
        risk:
          score >= 80 ? "High Risk" :
          score >= 60 ? "Moderate Risk" :
          "Low Risk",

        tone:
          score >= 80 ? "risk-red" :
          score >= 60 ? "risk-yellow" :
          "risk-green",

        riskBadge:
          score >= 80 ? "danger" :
          score >= 60 ? "warning" :
          "safe",

        summary:
          score >= 80
            ? "Water quality is unsafe and requires treatment"
            : score >= 60
            ? "Water quality needs attention"
            : "Water quality is acceptable",

        // 🔥 IMPACT (MATCHES YOUR UI)
        impact: {
          lifestyle: impacts.current.impact.lifestyle,
          nature: impacts.current.impact.nature,
          futureTitle: "Future Outlook",
          futureText:
            impacts.future.outlook.lifestyle[0] ||
            impacts.future.outlook.nature[0] ||
            "Water conditions may remain stable"
        },

        // 🔥 SOLUTIONS
        solutions: {
          present: impacts.current.solutions.lifestyle,
          future: impacts.future.preparations.lifestyle
        },

        // 🔥 STATS (UI READY)
        stats: [
          ["TDS", `${waterRaw.tds} ppm`, "water_drop"],
          ["Fluoride", waterRaw.fluoride, "science"],
          ["Nitrate", waterRaw.nitrate, "biotech"]
        ],

        // 🔥 ACTION
        action:
          impacts.current.solutions.lifestyle[0] ||
          "Monitor water quality regularly"
      }
    });

  } catch (err) {
    console.error("Water Route Error:", err);
    res.status(500).json({ error: "Failed to fetch water data" });
  }
});

module.exports = router;