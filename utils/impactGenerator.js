const waterRules = require("./rules/waterImpact");
const airRules = require("./rules/airImpact");
const wasteRules = require("./rules/wasteImpact");
const weatherRules = require("./rules/weatherImpact");

module.exports = (data, domain = "all") => {

  let rules;

  if (domain === "weather") rules = weatherRules;
  else if (domain === "air") rules = airRules;
  else if (domain === "water") rules = waterRules;
  else if (domain === "waste") rules = wasteRules;
  else {
    rules = [
      ...waterRules,
      ...airRules,
      ...wasteRules,
      ...weatherRules
    ];
  }

const result = {
  current: {
    impact: { lifestyle: [], nature: [] },
    solutions: { lifestyle: [], nature: [] }
  },
  future: {
    outlook: { lifestyle: [], nature: [] },
    preparations: { lifestyle: [], nature: [] }
  }
};

rules.forEach(rule => {
  if (rule.condition(data)) {

    // CURRENT IMPACT
    if (rule.current?.impact?.lifestyle)
      result.current.impact.lifestyle.push(rule.current.impact.lifestyle);

    if (rule.current?.impact?.nature)
      result.current.impact.nature.push(rule.current.impact.nature);

    // CURRENT SOLUTIONS
    if (rule.current?.solutions?.lifestyle)
      result.current.solutions.lifestyle.push(rule.current.solutions.lifestyle);

    if (rule.current?.solutions?.nature)
      result.current.solutions.nature.push(rule.current.solutions.nature);

    // FUTURE OUTLOOK
    if (rule.future?.outlook?.lifestyle)
      result.future.outlook.lifestyle.push(rule.future.outlook.lifestyle);

    if (rule.future?.outlook?.nature)
      result.future.outlook.nature.push(rule.future.outlook.nature);

    // FUTURE PREPARATIONS
    if (rule.future?.preparations?.lifestyle)
      result.future.preparations.lifestyle.push(rule.future.preparations.lifestyle);

    if (rule.future?.preparations?.nature)
      result.future.preparations.nature.push(rule.future.preparations.nature);
  }
});

  const clean = (arr) => [...new Set(arr)].slice(0, 3);

 return {
  current: {
    impact: {
      lifestyle: clean(result.current.impact.lifestyle),
      nature: clean(result.current.impact.nature)
    },
    solutions: {
      lifestyle: clean(result.current.solutions.lifestyle),
      nature: clean(result.current.solutions.nature)
    }
  },
  future: {
    outlook: {
      lifestyle: clean(result.future.outlook.lifestyle),
      nature: clean(result.future.outlook.nature)
    },
    preparations: {
      lifestyle: clean(result.future.preparations.lifestyle),
      nature: clean(result.future.preparations.nature)
    }
  }
};
};