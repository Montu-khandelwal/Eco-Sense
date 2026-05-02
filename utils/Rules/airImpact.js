module.exports = [

  // 🟢 NORMAL AQI
  {
    condition: ({ air }) => air.score <= 100,

    current: {
      impact: {
        lifestyle: "Air quality is good and safe for regular outdoor activities",
        nature: "Environmental air conditions are stable"
      },
      solutions: {
        lifestyle: "Continue normal outdoor activities",
        nature: "Maintain current environmental practices"
      }
    },

    future: {
      outlook: {
        lifestyle: "Air quality is likely to remain comfortable in the near term"
      },
      preparations: {
        lifestyle: "Stay aware of AQI changes during seasonal shifts"
      }
    }
  },

  // 🟡 MODERATE AQI
  {
    condition: ({ air }) => air.score > 100 && air.score <= 200,

    current: {
      impact: {
        lifestyle:
          "Moderate air quality may cause breathing discomfort for sensitive individuals"
      },
      solutions: {
        lifestyle:
          "Limit prolonged outdoor activity if sensitive to air pollution"
      }
    },

    future: {
      outlook: {
        lifestyle:
          "Continued exposure may gradually impact respiratory health"
      },
      preparations: {
        lifestyle:
          "Monitor AQI regularly and reduce exposure during peak pollution hours"
      }
    }
  },

  // 🔴 POOR AQI
  {
    condition: ({ air }) => air.score > 200 && air.score <= 300,

    current: {
      impact: {
        lifestyle:
          "Poor air quality may lead to noticeable breathing discomfort"
      },
      solutions: {
        lifestyle:
          "Reduce outdoor exposure and consider protective masks"
      }
    },

    future: {
      outlook: {
        lifestyle:
          "Prolonged exposure may increase respiratory complications"
      },
      preparations: {
        lifestyle:
          "Adopt indoor air purification and cleaner commuting habits"
      }
    }
  },

  // 🔴 SEVERE AQI
  {
    condition: ({ air }) => air.score > 300,

    current: {
      impact: {
        lifestyle:
          "Severely polluted air may pose serious health risks even for healthy individuals"
      },
      solutions: {
        lifestyle:
          "Avoid outdoor exposure and use high-efficiency masks or purifiers"
      }
    },

    future: {
      outlook: {
        lifestyle:
          "Sustained exposure may lead to long-term health damage"
      },
      preparations: {
        lifestyle:
          "Adopt strict exposure control and long-term protection strategies"
      }
    }
  },

  // 🌡️ AQI + HEAT
  {
    condition: ({ air, weather }) =>
      air.score > 150 && weather.temp > 35,

    current: {
      impact: {
        lifestyle:
          "High temperature may intensify harmful air pollutants"
      },
      solutions: {
        lifestyle:
          "Avoid outdoor activity during peak heat and pollution hours"
      }
    },

    future: {
      outlook: {
        nature:
          "Sustained heat may worsen air quality through chemical reactions"
      },
      preparations: {
        nature:
          "Promote heat-resilient urban planning to reduce pollution buildup"
      }
    }
  },

  // 💧 AQI + HUMIDITY
  {
    condition: ({ air, weather }) =>
      air.score > 100 && weather.humidity > 70,

    current: {
      impact: {
        lifestyle:
          "High humidity may trap pollutants and worsen breathing discomfort"
      },
      solutions: {
        lifestyle:
          "Stay in well-ventilated indoor environments"
      }
    },

    future: {
      outlook: {
        nature:
          "Persistent humidity may sustain higher pollutant concentration"
      },
      preparations: {
        nature:
          "Improve urban airflow and ventilation systems"
      }
    }
  },

  // 🗑️ AQI + WASTE
  {
    condition: ({ air, waste }) =>
      air.score > 150 && waste.plasticWasteLevel === "HIGH",

    current: {
      impact: {
        nature:
          "Waste accumulation may be contributing to elevated air pollution"
      },
      solutions: {
        nature:
          "Improve waste disposal and avoid open burning"
      }
    },

    future: {
      outlook: {
        nature:
          "Continued waste exposure may worsen air quality over time"
      },
      preparations: {
        nature:
          "Adopt sustainable waste management practices"
      }
    }
  },

  // 🌍 AQI + WATER STRESS
  {
    condition: ({ air, water }) =>
      air.score > 150 && water.tds > 500,

    current: {
      impact: {
        nature:
          "Air and water stress together indicate broader environmental degradation"
      },
      solutions: {
        nature:
          "Monitor both air and water systems closely"
      }
    },

    future: {
      outlook: {
        nature:
          "Combined stress may lead to ecosystem imbalance"
      },
      preparations: {
        nature:
          "Adopt integrated environmental management strategies"
      }
    }
  }

];