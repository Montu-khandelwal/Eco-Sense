const express = require("express");
const router = express.Router();

const weatherEngine = require("../engines/weatherEngine");
const airEngine = require("../engines/airEngine");
const waterEngine = require("../engines/waterEngine");
const wasteEngine = require("../engines/wasteEngine");
const impactGenerator = require("../utils/impactGenerator");
const { getWasteScore } = require("../utils/dashboardAnalyzer");  

router.get("/", async (req, res) => {
  try {
    const { lat = 26.78, lng = 75.91, location = "Goner" } = req.query;

    // 🔹 FETCH WASTE DATA
    // 🔹 FETCH AIR DATA
    const airRaw = await airEngine.getByCoordinates(lat, lng);
    const weatherRaw = await weatherEngine.getByCoordinates(lat, lng);
    const waterRaw = waterEngine.getByLocation(location);
    const wasteRaw = wasteEngine.getByLocation(location);
     
    const score = getWasteScore(wasteRaw);
const riskData = getRisk(score);
    const w = weatherRaw.weather;

    // 🔹 NORMALIZE FOR RULE ENGINE
    const ruleInput = {
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
      water: {
        tds: waterRaw.tds,
      },
    };

    // 🔹 GENERATE INSIGHTS
    const insights = impactGenerator(ruleInput, "waste");

    // 🔹 SCORE LOGIC (based on your existing system)
    const getWasteScore = (level, recycling = 0) => {
      const base = level === "HIGH" ? 90 : level === "MODERATE" ? 60 : 30;

      // higher recycling = better → reduce score
      const adjusted = base - (recycling / 100) * 40;

      return Math.max(0, Math.min(100, Math.round(adjusted)));
    };

    const level = wasteRaw.plasticWasteLevel || "LOW";
    const recycling = wasteRaw.recyclingRate || 0;

    // 🔹 RISK LABEL
    const getRisk = (score) => {
      if (score >= 80) return { risk: "High", badge: "high" };
      if (score >= 50) return { risk: "Moderate", badge: "warn" };
      return { risk: "Low", badge: "safe" };
    };

   

    // 🔹 FINAL RESPONSE
    res.json({
      displayName: location,
      city: location,

      waste: {
        level,
        recyclingRate: recycling,
        score,
        risk: riskData.risk,
        riskBadge: riskData.badge,

        // 🔥 IMPACT
        impact: {
          lifestyle: insights.current.impact.lifestyle,
          nature: insights.current.impact.nature,
          futureTitle: "Future Outlook",
          futureText:
            insights.future.outlook.lifestyle[0] ||
            insights.future.outlook.nature[0] ||
            "Waste conditions may remain stable",
        },

        // 🔥 SOLUTIONS
        solutions: {
          present: insights.current.solutions.lifestyle,
          future: insights.future.preparations.lifestyle,
        },

        // 🔥 STATS
        stats: [
          ["Waste Level", level, "delete"],
          ["Recycling Rate", `${recycling}%`, "recycling"],
          ["Organic Waste", wasteRaw.organicWasteLevel || "--", "compost"],
        ],

        // 🔥 ACTION
        action:
          insights.current.solutions.lifestyle[0] ||
          "Maintain proper waste management practices",
      },
    });
  } catch (err) {
    console.error("Waste Route Error:", err);
    res.status(500).json({ error: "Failed to fetch waste data" });
  }
});

module.exports = router;
