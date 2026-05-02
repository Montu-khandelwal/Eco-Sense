module.exports = [

  // 🟢 GOOD WATER (BASE RULE)
  {
    condition: ({ water }) =>
      water.tds <= 300 &&
      water.fluoride <= 1 &&
      water.nitrate <= 45,

    current: {
      impact: {
        lifestyle: "Water quality is safe for regular consumption",
        nature: "Water system is stable with minimal contamination"
      },
      solutions: {
        lifestyle: "Continue normal usage with basic filtration if needed",
        nature: "Maintain water conservation practices"
      }
    },

    future: {
      outlook: {
        lifestyle: "Water conditions are likely to remain stable"
      },
      preparations: {
        lifestyle: "Monitor water quality periodically"
      }
    }
  },

  // 🟡 MODERATE TDS
  {
    condition: ({ water }) =>
      water.tds > 300 && water.tds <= 600,

    current: {
      impact: {
        lifestyle:
          "Moderate dissolved solids may affect taste and long-term comfort"
      },
      solutions: {
        lifestyle:
          "Use basic filtration systems to improve water quality"
      }
    },

    future: {
      outlook: {
        lifestyle:
          "Water quality may degrade if dissolved solids increase further"
      },
      preparations: {
        lifestyle:
          "Consider installing purification systems"
      }
    }
  },

  // 🔴 HIGH TDS
  {
    condition: ({ water }) =>
      water.tds > 600,

    current: {
      impact: {
        lifestyle:
          "High dissolved solids may make water unsuitable for direct consumption",
        nature:
          "Indicates potential contamination or mineral imbalance"
      },
      solutions: {
        lifestyle:
          "Avoid direct consumption without purification",
        nature:
          "Identify and control contamination sources"
      }
    },

    future: {
      outlook: {
        lifestyle:
          "Long-term use may lead to health risks"
      },
      preparations: {
        lifestyle:
          "Adopt RO or advanced filtration systems"
      }
    }
  },

  // 🔴 HIGH FLUORIDE
  {
    condition: ({ water }) =>
      water.fluoride > 1.5,

    current: {
      impact: {
        lifestyle:
          "High fluoride may pose dental and bone health risks"
      },
      solutions: {
        lifestyle:
          "Use fluoride-removal filtration or alternative sources"
      }
    },

    future: {
      outlook: {
        lifestyle:
          "Prolonged exposure may lead to fluorosis"
      },
      preparations: {
        lifestyle:
          "Adopt long-term fluoride monitoring"
      }
    }
  },

  // 🔴 HIGH NITRATE
  {
    condition: ({ water }) =>
      water.nitrate > 45,

    current: {
      impact: {
        lifestyle:
          "High nitrate levels may pose risks, especially for infants"
      },
      solutions: {
        lifestyle:
          "Avoid untreated water for drinking purposes"
      }
    },

    future: {
      outlook: {
        nature:
          "Nitrate contamination may indicate agricultural runoff"
      },
      preparations: {
        nature:
          "Control fertilizer usage near water sources"
      }
    }
  },

  // 🌡️ TDS + HEAT
  {
    condition: ({ water, weather }) =>
      water.tds > 500 && weather.temp > 35,

    current: {
      impact: {
        lifestyle:
          "High temperature may intensify effects of dissolved solids"
      },
      solutions: {
        lifestyle:
          "Store water in cool conditions and use filtration"
      }
    },

    future: {
      outlook: {
        nature:
          "Heat may increase chemical imbalance in water systems"
      },
      preparations: {
        nature:
          "Adopt temperature-aware water storage strategies"
      }
    }
  },

  // 🗑️ WASTE + WATER
  {
    condition: ({ water, waste }) =>
      water.tds > 500 && waste.plastic !== "LOW",

    current: {
      impact: {
        nature:
          "Waste may be contributing to water contamination"
      },
      solutions: {
        nature:
          "Prevent waste disposal near water sources"
      }
    },

    future: {
      outlook: {
        nature:
          "Water quality may degrade due to continued contamination"
      },
      preparations: {
        nature:
          "Develop waste-water separation systems"
      }
    }
  },

  // 🌍 MULTI-DOMAIN STRESS
  {
    condition: ({ water, waste, air }) =>
      water.tds > 500 &&
      waste.plastic !== "LOW" &&
      air.score > 150,

    current: {
      impact: {
        nature:
          "Combined air, water, and waste stress indicates environmental degradation"
      },
      solutions: {
        nature:
          "Monitor and manage all environmental factors together"
      }
    },

    future: {
      outlook: {
        nature:
          "Ecosystem imbalance may develop over time"
      },
      preparations: {
        nature:
          "Adopt integrated environmental management strategies"
      }
    }
  }

];