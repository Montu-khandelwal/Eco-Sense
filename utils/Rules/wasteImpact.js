module.exports = [

  // 🟢 CLEAN SYSTEM (GOOD STATE)
  {
    condition: ({ waste }) =>
      waste.plastic === "LOW" &&
      waste.organic === "LOW" &&
      waste.recycling > 60,

    current: {
      impact: {
        lifestyle:
          "Waste is well managed with minimal impact on daily living",
        nature:
          "Efficient recycling is helping maintain environmental balance"
      },
      solutions: {
        lifestyle:
          "Continue consistent waste segregation and disposal habits",
        nature:
          "Maintain strong recycling practices"
      }
    },

    future: {
      outlook: {
        lifestyle:
          "Clean conditions are likely to remain stable"
      },
      preparations: {
        lifestyle:
          "Encourage community-level recycling participation"
      }
    }
  },

  // 🟡 MODERATE ORGANIC BUILDUP
  {
    condition: ({ waste }) =>
      waste.organic === "MODERATE",

    current: {
      impact: {
        lifestyle:
          "Organic waste may begin to create odor and minor discomfort"
      },
      solutions: {
        lifestyle:
          "Increase frequency of organic waste disposal or composting"
      }
    },

    future: {
      outlook: {
        nature:
          "Organic buildup may attract pests and degrade surroundings"
      },
      preparations: {
        nature:
          "Adopt composting or structured organic waste handling"
      }
    }
  },

  // 🔴 HIGH PLASTIC WASTE
  {
    condition: ({ waste }) =>
      waste.plastic === "HIGH",

    current: {
      impact: {
        lifestyle:
          "High plastic waste may clutter surroundings and reduce cleanliness",
        nature:
          "Plastic accumulation contributes to long-term environmental damage"
      },
      solutions: {
        lifestyle:
          "Reduce plastic usage and ensure proper disposal",
        nature:
          "Promote recycling and reuse of plastic materials"
      }
    },

    future: {
      outlook: {
        nature:
          "Plastic waste may persist and accumulate over time"
      },
      preparations: {
        nature:
          "Shift toward sustainable alternatives and recycling systems"
      }
    }
  },

  // 🔥 LOW RECYCLING (CRITICAL SIGNAL)
  {
    condition: ({ waste }) =>
      waste.recycling < 40,

    current: {
      impact: {
        nature:
          "Low recycling rates may increase overall waste accumulation"
      },
      solutions: {
        nature:
          "Improve waste segregation and recycling participation"
      }
    },

    future: {
      outlook: {
        nature:
          "Poor recycling habits may lead to long-term environmental stress"
      },
      preparations: {
        nature:
          "Develop structured recycling systems and awareness"
      }
    }
  },

  // 🌡️ WASTE + HEAT
  {
    condition: ({ waste, weather }) =>
      waste.organic !== "LOW" && weather.temp > 35,

    current: {
      impact: {
        lifestyle:
          "Heat accelerates decomposition, increasing odor and discomfort"
      },
      solutions: {
        lifestyle:
          "Dispose organic waste quickly and keep it covered"
      }
    },

    future: {
      outlook: {
        nature:
          "Heat may intensify waste-related environmental stress"
      },
      preparations: {
        nature:
          "Adopt heat-resilient waste handling systems"
      }
    }
  },

  // 💧 WASTE + HUMIDITY
  {
    condition: ({ waste, weather }) =>
      waste.organic !== "LOW" && weather.humidity > 70,

    current: {
      impact: {
        lifestyle:
          "Humidity may increase microbial growth and foul smell"
      },
      solutions: {
        lifestyle:
          "Store waste in dry and ventilated areas"
      }
    },

    future: {
      outlook: {
        nature:
          "Moist conditions may accelerate environmental degradation"
      },
      preparations: {
        nature:
          "Improve drainage and moisture control in waste systems"
      }
    }
  },

  // 🌬️ WASTE → AIR LINK
  {
    condition: ({ waste, air }) =>
      waste.plastic !== "LOW" && air.score > 150,

    current: {
      impact: {
        nature:
          "Waste may be contributing to degraded air quality"
      },
      solutions: {
        nature:
          "Avoid open burning and manage waste properly"
      }
    },

    future: {
      outlook: {
        nature:
          "Air pollution may worsen if waste remains unmanaged"
      },
      preparations: {
        nature:
          "Adopt controlled waste processing systems"
      }
    }
  },

  // 💧 WASTE → WATER LINK
  {
    condition: ({ waste, water }) =>
      waste.plastic !== "LOW" && water.tds > 500,

    current: {
      impact: {
        nature:
          "Waste leakage may be affecting water quality"
      },
      solutions: {
        nature:
          "Prevent waste runoff into water sources"
      }
    },

    future: {
      outlook: {
        nature:
          "Water systems may degrade due to contamination"
      },
      preparations: {
        nature:
          "Develop waste-water separation systems"
      }
    }
  }

];