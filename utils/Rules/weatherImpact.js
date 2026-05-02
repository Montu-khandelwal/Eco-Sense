module.exports = [
  // 🌡️ HEAT + UV

  {
    condition: ({ weather }) => weather.temp < 20,

    current: {
      impact: {
        lifestyle: "Cool conditions may slightly reduce outdoor comfort",
      },
      solutions: {
        lifestyle: "Wear appropriate clothing to stay comfortable",
      },
    },

    future: {
      outlook: {
        lifestyle: "Cool conditions may persist depending on weather trends",
      },
      preparations: {
        lifestyle: "Prepare for potential temperature drops",
      },
    },
  },
  {
    condition: ({ weather }) => weather.temp >= 20 && weather.temp <= 35,

    current: {
      impact: {
        lifestyle:
          "Weather conditions are generally comfortable for daily activities",
        nature: "Environmental conditions are stable with minimal stress",
      },
      solutions: {
        lifestyle: "Maintain regular activities and stay hydrated",
        nature: "No immediate environmental action required",
      },
    },

    future: {
      outlook: {
        lifestyle: "Conditions are expected to remain stable in the near term",
        nature: "Ecosystem likely to remain balanced under current conditions",
      },
      preparations: {
        lifestyle: "Continue monitoring weather changes",
        nature: "Maintain sustainable environmental practices",
      },
    },
  },
  {
    condition: ({ weather }) => weather.temp > 35 && weather.uv > 7,

    current: {
      impact: {
        lifestyle:
          "High temperature with strong UV increases risk of dehydration and skin damage",
      },
      solutions: {
        lifestyle:
          "Avoid direct sun exposure during peak hours and stay well hydrated",
      },
    },

    future: {
      outlook: {
        lifestyle:
          "Sustained heat and UV exposure may lead to long-term health stress",
      },
      preparations: {
        lifestyle:
          "Adjust daily routines to reduce prolonged heat and UV exposure",
      },
    },
  },

  // 💧 HUMIDITY + HEAT
  {
    condition: ({ weather }) => weather.humidity > 70 && weather.temp > 30,

    current: {
      impact: {
        lifestyle:
          "High humidity reduces heat dissipation, causing discomfort and fatigue",
      },
      solutions: {
        lifestyle:
          "Use ventilation or cooling methods to manage heat and humidity",
      },
    },

    future: {
      outlook: {
        lifestyle:
          "Persistent humidity may continue to impact comfort and productivity",
      },
      preparations: {
        lifestyle: "Adopt climate-adaptive living practices",
      },
    },
  },

  // 🌬️ LOW PRESSURE
  {
    condition: ({ weather }) => weather.pressure < 1000,

    current: {
      impact: {
        lifestyle:
          "Low pressure may cause headaches and reduced physical comfort",
      },
      solutions: {
        lifestyle: "Avoid excessive physical strain during low pressure",
      },
    },

    future: {
      outlook: {
        nature:
          "Unstable atmospheric conditions may impact environmental balance",
      },
      preparations: {
        nature: "Monitor atmospheric trends to anticipate instability",
      },
    },
  },

  // 🌬️ HUMIDITY + AQI
  {
    condition: ({ weather, air }) => weather.humidity > 70 && air.score > 150,

    current: {
      impact: {
        nature:
          "High humidity may trap pollutants, sustaining poor air conditions",
      },
      solutions: {
        nature: "Improve ventilation to reduce pollutant buildup",
      },
    },

    future: {
      outlook: {
        nature: "Persistent humidity may maintain high pollutant concentration",
      },
      preparations: {
        nature: "Promote urban designs that enhance airflow",
      },
    },
  },

  // 🌡️ HEAT + WATER
  {
    condition: ({ weather, water }) => weather.temp > 35 && water.tds > 500,

    current: {
      impact: {
        nature:
          "High temperature may intensify chemical concentration in water",
      },
      solutions: {
        nature: "Store water in temperature-controlled conditions",
      },
    },

    future: {
      outlook: {
        nature: "Sustained heat may disrupt water chemistry balance",
      },
      preparations: {
        nature: "Develop temperature-resilient water systems",
      },
    },
  },

  // 💧 HUMIDITY + WASTE
  {
    condition: ({ weather, waste }) =>
      weather.humidity > 70 && waste.level === "High",

    current: {
      impact: {
        nature: "Moist conditions accelerate microbial growth in waste",
      },
      solutions: {
        nature: "Keep waste dry and covered",
      },
    },

    future: {
      outlook: {
        nature: "Sustained humidity may increase ecological degradation",
      },
      preparations: {
        nature: "Design moisture-resistant waste systems",
      },
    },
  },

  // 🌍 EXTREME COMBO
  {
    condition: ({ weather, air }) =>
      weather.temp > 35 && weather.humidity > 70 && air.score > 150,

    current: {
      impact: {
        nature:
          "Combined heat, humidity, and pollution indicate high environmental stress",
      },
      solutions: {
        nature: "Reduce pollution sources during extreme weather",
      },
    },

    future: {
      outlook: {
        nature: "Persistent extreme conditions may disrupt ecological balance",
      },
      preparations: {
        nature: "Adopt integrated climate and pollution control strategies",
      },
    },
  },
];
