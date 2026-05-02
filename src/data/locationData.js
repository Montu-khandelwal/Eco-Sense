const getRiskMeta = (score) => {
  if (score < 50) return { risk: 'High Risk', tone: 'risk-red', badge: 'danger' };
  if (score < 72) return { risk: 'Medium Risk', tone: 'risk-yellow', badge: 'warning' };
  return { risk: 'Low Risk', tone: 'risk-green', badge: 'safe' };
};

const getWaterMeta = (availability) => {
  if (availability < 58) return { risk: 'High Risk', tone: 'risk-red', badge: 'danger', helper: 'Low availability' };
  if (availability < 76) return { risk: 'Medium Risk', tone: 'risk-yellow', badge: 'warning', helper: 'Moderate availability' };
  return { risk: 'Low Risk', tone: 'risk-green', badge: 'safe', helper: 'Stable supply' };
};

const getAqiMeta = (aqi) => {
  if (aqi > 125) return {
    risk: 'High Risk',
    tone: 'risk-red',
    helper: 'Poor air quality',
    text: 'Poor — reduce long outdoor exposure near traffic-heavy roads.'
  };
  if (aqi > 80) return {
    risk: 'Medium Risk',
    tone: 'risk-yellow',
    helper: 'Moderate air',
    text: 'Moderate — limit long outdoor activity during peak traffic hours.'
  };
  return {
    risk: 'Low Risk',
    tone: 'risk-green',
    helper: 'Acceptable air',
    text: 'Good to moderate — suitable for normal outdoor activity.'
  };
};

const buildWasteProfile = ({ area, todayScore, aqi, waterAvailability }) => {
  const baseScore = Math.round(todayScore + 14 - Math.max(0, aqi - 85) * 0.12 + (waterAvailability > 72 ? 4 : -2));
  const score = Math.max(42, Math.min(94, baseScore));
  const meta = getRiskMeta(score);
  const collection = Math.max(48, Math.min(96, Math.round(score + 6)));
  const segregation = Math.max(38, Math.min(92, Math.round(score - 4)));
  const recycle = Math.max(35, Math.min(90, Math.round(score - 8)));

  return {
    score,
    value: String(score),
    helper: score < 50 ? 'Waste pressure high' : score < 72 ? 'Collection watch' : 'Clean routine',
    risk: meta.risk,
    tone: meta.tone,
    riskBadge: meta.badge,
    collection,
    segregation,
    recycle,
    summary: score < 50
      ? `Waste risk is high around ${area}. Focus on daily segregation and avoid open dumping.`
      : score < 72
        ? `Waste condition is manageable around ${area}, but segregation and timely disposal need attention.`
        : `Waste condition is stable around ${area}. Keep dry and wet waste separated.`,
    stats: [
      { label: 'Collection', value: String(collection), icon: 'delete_sweep', tone: getRiskMeta(collection).tone, risk: getRiskMeta(collection).risk },
      { label: 'Segregation', value: String(segregation), icon: 'recycling', tone: getRiskMeta(segregation).tone, risk: getRiskMeta(segregation).risk },
      { label: 'Recycle', value: String(recycle), icon: 'compost', tone: getRiskMeta(recycle).tone, risk: getRiskMeta(recycle).risk }
    ],
    impact: {
      household: [
        'Separate wet, dry and reject waste at source.',
        'Rinse recyclable containers before storing them.'
      ],
      locality: [
        'Avoid roadside dumping and report overflowing bins.',
        'Use covered bins to reduce smell, insects and stray animal spread.'
      ],
      futureTitle: score < 60 ? 'Waste load may rise if segregation drops' : 'Cleanliness can improve with routine segregation',
      futureText: 'A simple 3-bin habit reduces landfill pressure and keeps the local area cleaner.'
    }
  };
};

const profile = ({
  id,
  area,
  zone,
  todayScore,
  yesterdayScore,
  actionTitle,
  actionText,
  tempC,
  highC,
  lowC,
  condition,
  weatherScore,
  humidity,
  wind,
  uv,
  pressure,
  aqi,
  waterAvailability,
  waterQuality = 'Safe',
  reservoir = '13.8m',
  waterSummary,
  icon = 'wb_sunny'
}) => {
  const weatherMeta = getRiskMeta(weatherScore);
  const waterMeta = getWaterMeta(waterAvailability);
  const aqiMeta = getAqiMeta(aqi);

  const weather = {
    score: weatherScore,
    tempC,
    highC,
    lowC,
    condition,
    helper: weatherScore < 50 ? 'Heat + UV risk' : weatherScore < 72 ? 'Heat watch' : 'Comfortable day',
    risk: weatherMeta.risk,
    tone: weatherMeta.tone,
    icon,
    riskBadge: weatherMeta.badge,
    aqi,
    aqiText: aqiMeta.text,
    aqiHelper: aqiMeta.helper,
    aqiRisk: aqiMeta.risk,
    aqiTone: aqiMeta.tone,
    stats: [
      ['Humidity', `${humidity}%`, 'water_drop'],
      ['Wind', `${wind} km/h`, 'air'],
      ['UV Index', uv, 'sunny'],
      ['Pressure', `${pressure} hPa`, 'speed']
    ],
    impact: {
      lifestyle: [
        weatherScore < 50 ? 'Avoid heavy outdoor movement from 12 PM to 4 PM.' : 'Use shaded routes during afternoon movement.',
        aqi > 100 ? 'Avoid traffic-heavy routes when possible.' : 'Outdoor activity is better before peak traffic.'
      ],
      nature: [
        'Water plants after sunset to reduce evaporation.',
        'Keep balcony plants shaded during peak heat.'
      ],
      futureTitle: weatherScore < 50 ? 'Heat may stay high tomorrow' : 'Conditions may vary by locality',
      futureText: 'Plan commute, hydration and plant care according to the local risk cards.'
    },
    action: weatherScore < 50
      ? 'Use solar hours between 1 PM and 4 PM, but avoid direct outdoor heat.'
      : 'Use daylight and natural ventilation before switching on high-energy appliances.',
    warningTitle: weatherScore < 50 ? 'High Risk Weather' : weatherScore < 72 ? 'Medium Weather Watch' : 'Low Weather Risk',
    warningSafety: weatherScore < 50
      ? 'Drink water, avoid peak outdoor activity and eat light food.'
      : 'Stay hydrated and keep outdoor tasks short during afternoon heat.',
    warningEffect: weatherScore < 50
      ? 'Heat stress may reduce efficiency and increase health risk.'
      : 'Weather impact is manageable if hydration and shade are maintained.'
  };

  const purityScore = Math.max(58, Math.min(96, Math.round(waterAvailability + (waterQuality === 'Treated' ? 14 : 8))));
  const purityMeta = getRiskMeta(purityScore);
  const phValue = Number((7.1 + ((100 - waterAvailability) / 100) * 0.7).toFixed(1));
  const tdsValue = Math.round(190 + (100 - waterAvailability) * 5.2);
  const turbValue = Number((1.2 + ((100 - waterAvailability) / 100) * 3.8).toFixed(1));

  const getTdsTone = (tds) => {
    if (tds > 500) return { tone: 'risk-red', risk: 'High', helper: 'Needs filtration' };
    if (tds > 300) return { tone: 'risk-yellow', risk: 'Moderate', helper: 'Filter advised' };
    return { tone: 'risk-green', risk: 'Good', helper: 'Acceptable range' };
  };

  const getTurbTone = (turb) => {
    if (turb > 4) return { tone: 'risk-red', risk: 'High', helper: 'Cloudy water risk' };
    if (turb > 2.5) return { tone: 'risk-yellow', risk: 'Moderate', helper: 'Slightly cloudy' };
    return { tone: 'risk-green', risk: 'Clear', helper: 'Low turbidity' };
  };

  const phMeta = phValue < 6.8 || phValue > 8.2
    ? { tone: 'risk-yellow', risk: 'Watch', helper: 'Slight variation' }
    : { tone: 'risk-green', risk: 'Normal', helper: 'Balanced level' };
  const tdsMeta = getTdsTone(tdsValue);
  const turbMeta = getTurbTone(turbValue);

  const water = {
    availability: waterAvailability,
    helper: waterMeta.helper,
    risk: waterMeta.risk,
    tone: waterMeta.tone,
    riskBadge: waterMeta.badge,
    reservoir,
    summary: waterSummary ?? `${waterMeta.helper}. Smart household usage is recommended in ${area}.`,
    quality: waterQuality,
    purity: {
      score: purityScore,
      value: `${purityScore}%`,
      risk: purityMeta.risk,
      tone: purityMeta.tone,
      riskBadge: purityMeta.badge,
      helper: purityScore < 70 ? 'Needs careful filtering' : purityScore < 85 ? 'Usable with filtration' : 'Good purity level',
      summary: purityScore < 70
        ? 'Use proper filtration and avoid direct drinking without treatment.'
        : purityScore < 85
          ? 'Suitable for regular household use after normal filtration.'
          : 'Purity is stable for household use with routine filtration.'
    },
    labStats: [
      { label: 'PH LEVEL', value: String(phValue), icon: 'science', tone: phMeta.tone, risk: phMeta.risk, helper: phMeta.helper },
      { label: 'TDS', value: `${tdsValue} ppm`, icon: 'opacity', tone: tdsMeta.tone, risk: tdsMeta.risk, helper: tdsMeta.helper },
      { label: 'TURB.', value: `${turbValue} NTU`, icon: 'blur_on', tone: turbMeta.tone, risk: turbMeta.risk, helper: turbMeta.helper }
    ],
    impact: {
      household: [
        'Run washing machine only with full loads.',
        'Avoid running taps while washing utensils.'
      ],
      garden: [
        'Use greywater for hardy plants where safe.',
        'Mulch plant bases to preserve soil moisture.'
      ],
      futureTitle: waterAvailability < 60 ? 'Water demand pressure may rise' : 'Supply likely manageable',
      futureText: 'Prepare a weekly water budget for cleaning, plants and drinking.'
    }
  };

  const waste = buildWasteProfile({ area, todayScore, aqi, waterAvailability });

  return {
    id,
    city: area,
    region: `Jaipur District • ${zone}`,
    displayName: `${area}, Jaipur District`,
    todayScore,
    yesterdayScore,
    actionTitle,
    actionText,
    weather,
    water,
    waste,
    metrics: [
      {
        key: 'weather',
        label: 'Weather',
        value: String(weather.score),
        helper: weather.helper,
        risk: weather.risk,
        icon: weather.icon,
        tone: weather.tone,
        screen: 'weather'
      },
      {
        key: 'water',
        label: 'Water',
        value: String(water.purity.score),
        helper: water.purity.helper,
        risk: water.purity.risk,
        icon: 'water_drop',
        tone: water.purity.tone,
        screen: 'water'
      },
      {
        key: 'waste',
        label: 'Waste',
        value: waste.value,
        helper: waste.helper,
        risk: waste.risk,
        icon: 'delete',
        tone: waste.tone,
        screen: 'waste'
      },
      {
        key: 'assistant',
        label: 'Ask Gaia',
        value: 'AI',
        helper: 'Eco guidance',
        risk: 'Active',
        icon: 'eco',
        tone: 'dark',
        screen: 'assistant'
      }
    ]
  };
};

export const locationProfiles = [
  profile({
    id: 'mansarovar',
    area: 'Mansarovar',
    zone: 'South-West Jaipur',
    todayScore: 58,
    yesterdayScore: 66,
    actionTitle: 'Control afternoon energy load',
    actionText: 'Use washing, charging and high-energy appliances before peak evening demand.',
    tempC: 36,
    highC: 40,
    lowC: 27,
    condition: 'Hot • Dry',
    weatherScore: 46,
    humidity: 38,
    wind: 16,
    uv: '8 Very High',
    pressure: 1006,
    aqi: 92,
    waterAvailability: 68,
    reservoir: '13.4m',
    icon: 'wb_sunny'
  }),
  profile({
    id: 'malviya-nagar',
    area: 'Malviya Nagar',
    zone: 'East Jaipur',
    todayScore: 61,
    yesterdayScore: 70,
    actionTitle: 'Avoid traffic-hour exposure',
    actionText: 'Prefer shaded inner roads and avoid long outdoor activity near main traffic corridors.',
    tempC: 35,
    highC: 39,
    lowC: 27,
    condition: 'Hot • Hazy',
    weatherScore: 52,
    humidity: 41,
    wind: 14,
    uv: '8 Very High',
    pressure: 1007,
    aqi: 118,
    waterAvailability: 72,
    reservoir: '14.1m',
    icon: 'partly_cloudy_day'
  }),
  profile({
    id: 'vaishali-nagar',
    area: 'Vaishali Nagar',
    zone: 'West Jaipur',
    todayScore: 64,
    yesterdayScore: 71,
    actionTitle: 'Save water during cleaning',
    actionText: 'Use bucket cleaning for vehicles and reuse RO reject water for floor cleaning.',
    tempC: 35,
    highC: 39,
    lowC: 26,
    condition: 'Warm • Clear',
    weatherScore: 58,
    humidity: 42,
    wind: 15,
    uv: '7 High',
    pressure: 1009,
    aqi: 82,
    waterAvailability: 74,
    reservoir: '14.8m',
    icon: 'wb_sunny'
  }),
  profile({
    id: 'c-scheme',
    area: 'C-Scheme',
    zone: 'Central Jaipur',
    todayScore: 55,
    yesterdayScore: 63,
    actionTitle: 'Reduce peak traffic exposure',
    actionText: 'Keep outdoor tasks shorter during office rush hours and use cleaner commute choices.',
    tempC: 36,
    highC: 40,
    lowC: 28,
    condition: 'Hot • Urban heat',
    weatherScore: 44,
    humidity: 36,
    wind: 12,
    uv: '8 Very High',
    pressure: 1005,
    aqi: 132,
    waterAvailability: 66,
    waterQuality: 'Treated',
    reservoir: '12.9m',
    icon: 'thunderstorm'
  }),
  profile({
    id: 'civil-lines',
    area: 'Civil Lines',
    zone: 'Central Jaipur',
    todayScore: 69,
    yesterdayScore: 74,
    actionTitle: 'Use green-cover advantage',
    actionText: 'Plan walking and ventilation during cooler hours; avoid unnecessary AC load.',
    tempC: 34,
    highC: 38,
    lowC: 26,
    condition: 'Warm • Breezy',
    weatherScore: 64,
    humidity: 44,
    wind: 17,
    uv: '7 High',
    pressure: 1010,
    aqi: 72,
    waterAvailability: 76,
    reservoir: '15.2m',
    icon: 'partly_cloudy_day'
  }),
  profile({
    id: 'bani-park',
    area: 'Bani Park',
    zone: 'North-Central Jaipur',
    todayScore: 63,
    yesterdayScore: 67,
    actionTitle: 'Keep heat exposure short',
    actionText: 'Finish outdoor chores before noon and use evening hours for movement.',
    tempC: 35,
    highC: 39,
    lowC: 27,
    condition: 'Hot • Clear',
    weatherScore: 55,
    humidity: 39,
    wind: 13,
    uv: '8 Very High',
    pressure: 1008,
    aqi: 88,
    waterAvailability: 73,
    reservoir: '14.5m',
    icon: 'wb_sunny'
  }),
  profile({
    id: 'raja-park',
    area: 'Raja Park',
    zone: 'East-Central Jaipur',
    todayScore: 57,
    yesterdayScore: 65,
    actionTitle: 'Watch AQI near market roads',
    actionText: 'Choose low-traffic lanes for walking and reduce idling vehicle time.',
    tempC: 36,
    highC: 40,
    lowC: 28,
    condition: 'Hot • Traffic haze',
    weatherScore: 48,
    humidity: 37,
    wind: 11,
    uv: '8 Very High',
    pressure: 1006,
    aqi: 126,
    waterAvailability: 70,
    reservoir: '13.7m',
    icon: 'partly_cloudy_day'
  }),
  profile({
    id: 'jagatpura',
    area: 'Jagatpura',
    zone: 'South-East Jaipur',
    todayScore: 66,
    yesterdayScore: 69,
    actionTitle: 'Manage dust and heat',
    actionText: 'Keep windows closed near dusty roads and ventilate after traffic reduces.',
    tempC: 35,
    highC: 39,
    lowC: 26,
    condition: 'Warm • Dusty breeze',
    weatherScore: 60,
    humidity: 40,
    wind: 18,
    uv: '7 High',
    pressure: 1009,
    aqi: 95,
    waterAvailability: 69,
    reservoir: '13.3m',
    icon: 'air'
  }),
  profile({
    id: 'pratap-nagar',
    area: 'Pratap Nagar',
    zone: 'South Jaipur',
    todayScore: 62,
    yesterdayScore: 68,
    actionTitle: 'Plan cooler commute windows',
    actionText: 'Prefer early travel, carry water and avoid long waits in direct sunlight.',
    tempC: 36,
    highC: 40,
    lowC: 27,
    condition: 'Hot • Partly cloudy',
    weatherScore: 53,
    humidity: 39,
    wind: 16,
    uv: '8 Very High',
    pressure: 1007,
    aqi: 86,
    waterAvailability: 71,
    reservoir: '14.0m',
    icon: 'partly_cloudy_day'
  }),
  profile({
    id: 'sanganer',
    area: 'Sanganer',
    zone: 'South Jaipur',
    todayScore: 54,
    yesterdayScore: 61,
    actionTitle: 'Use water carefully today',
    actionText: 'Prioritize drinking and cooking water; postpone non-essential washing loads.',
    tempC: 37,
    highC: 41,
    lowC: 28,
    condition: 'Very hot • Dry',
    weatherScore: 42,
    humidity: 35,
    wind: 15,
    uv: '9 Very High',
    pressure: 1004,
    aqi: 110,
    waterAvailability: 58,
    reservoir: '11.6m',
    icon: 'wb_sunny'
  }),
  profile({
    id: 'tonk-road',
    area: 'Tonk Road',
    zone: 'South-Central Jaipur',
    todayScore: 52,
    yesterdayScore: 60,
    actionTitle: 'Reduce roadside exposure',
    actionText: 'Avoid long walking near heavy traffic and keep hydration ready.',
    tempC: 37,
    highC: 41,
    lowC: 28,
    condition: 'Hot • Hazy corridor',
    weatherScore: 41,
    humidity: 34,
    wind: 13,
    uv: '9 Very High',
    pressure: 1005,
    aqi: 138,
    waterAvailability: 65,
    waterQuality: 'Treated',
    reservoir: '12.4m',
    icon: 'thunderstorm'
  }),
  profile({
    id: 'ajmer-road',
    area: 'Ajmer Road',
    zone: 'West Jaipur',
    todayScore: 59,
    yesterdayScore: 64,
    actionTitle: 'Protect against dust and heat',
    actionText: 'Use shaded routes, keep indoor dust low and water plants after sunset.',
    tempC: 36,
    highC: 40,
    lowC: 27,
    condition: 'Hot • Dusty',
    weatherScore: 49,
    humidity: 37,
    wind: 19,
    uv: '8 Very High',
    pressure: 1006,
    aqi: 102,
    waterAvailability: 67,
    reservoir: '13.1m',
    icon: 'air'
  }),
  profile({
    id: 'jhotwara',
    area: 'Jhotwara',
    zone: 'North-West Jaipur',
    todayScore: 60,
    yesterdayScore: 66,
    actionTitle: 'Keep cooling efficient',
    actionText: 'Use fan-first cooling and close curtains during harsh afternoon sunlight.',
    tempC: 36,
    highC: 40,
    lowC: 27,
    condition: 'Hot • Dry breeze',
    weatherScore: 51,
    humidity: 36,
    wind: 18,
    uv: '8 Very High',
    pressure: 1007,
    aqi: 90,
    waterAvailability: 70,
    reservoir: '13.9m',
    icon: 'wb_sunny'
  }),
  profile({
    id: 'vidhyadhar-nagar',
    area: 'Vidhyadhar Nagar',
    zone: 'North Jaipur',
    todayScore: 65,
    yesterdayScore: 69,
    actionTitle: 'Maintain balanced usage',
    actionText: 'Conditions are manageable; keep water-saving habits active.',
    tempC: 35,
    highC: 39,
    lowC: 26,
    condition: 'Warm • Clear',
    weatherScore: 59,
    humidity: 41,
    wind: 14,
    uv: '7 High',
    pressure: 1009,
    aqi: 78,
    waterAvailability: 75,
    reservoir: '15.0m',
    icon: 'partly_cloudy_day'
  }),
  profile({
    id: 'durgapura',
    area: 'Durgapura',
    zone: 'South-Central Jaipur',
    todayScore: 67,
    yesterdayScore: 72,
    actionTitle: 'Use daylight smartly',
    actionText: 'Good day for daylight-first routines; avoid unnecessary indoor lighting.',
    tempC: 34,
    highC: 38,
    lowC: 26,
    condition: 'Warm • Partly cloudy',
    weatherScore: 63,
    humidity: 43,
    wind: 16,
    uv: '7 High',
    pressure: 1010,
    aqi: 74,
    waterAvailability: 77,
    reservoir: '15.6m',
    icon: 'partly_cloudy_day'
  }),
  profile({
    id: 'gopalpura',
    area: 'Gopalpura',
    zone: 'South Jaipur',
    todayScore: 61,
    yesterdayScore: 67,
    actionTitle: 'Keep commute eco-friendly',
    actionText: 'Prefer shared mobility or shorter routes during peak heat and traffic.',
    tempC: 35,
    highC: 39,
    lowC: 27,
    condition: 'Hot • Urban haze',
    weatherScore: 54,
    humidity: 40,
    wind: 15,
    uv: '8 Very High',
    pressure: 1008,
    aqi: 104,
    waterAvailability: 72,
    reservoir: '14.2m',
    icon: 'partly_cloudy_day'
  }),
  profile({
    id: 'sodala',
    area: 'Sodala',
    zone: 'Central-West Jaipur',
    todayScore: 56,
    yesterdayScore: 62,
    actionTitle: 'Limit peak-road exposure',
    actionText: 'Avoid long outdoor waiting near dense traffic and stay hydrated.',
    tempC: 36,
    highC: 40,
    lowC: 28,
    condition: 'Hot • Traffic haze',
    weatherScore: 47,
    humidity: 37,
    wind: 12,
    uv: '8 Very High',
    pressure: 1006,
    aqi: 128,
    waterAvailability: 68,
    waterQuality: 'Treated',
    reservoir: '13.0m',
    icon: 'air'
  }),
  profile({
    id: 'amer',
    area: 'Amer',
    zone: 'North Jaipur',
    todayScore: 70,
    yesterdayScore: 73,
    actionTitle: 'Protect hillside greenery',
    actionText: 'Avoid littering, carry reusable water bottles and water plants after sunset.',
    tempC: 34,
    highC: 38,
    lowC: 25,
    condition: 'Warm • Breezy',
    weatherScore: 66,
    humidity: 45,
    wind: 20,
    uv: '7 High',
    pressure: 1011,
    aqi: 68,
    waterAvailability: 73,
    reservoir: '14.9m',
    icon: 'partly_cloudy_day'
  }),
  profile({
    id: 'sitapura',
    area: 'Sitapura',
    zone: 'Industrial South Jaipur',
    todayScore: 50,
    yesterdayScore: 58,
    actionTitle: 'Watch industrial corridor AQI',
    actionText: 'Keep outdoor exposure controlled and use water carefully for non-essential tasks.',
    tempC: 37,
    highC: 41,
    lowC: 28,
    condition: 'Very hot • Industrial haze',
    weatherScore: 39,
    humidity: 33,
    wind: 14,
    uv: '9 Very High',
    pressure: 1004,
    aqi: 146,
    waterAvailability: 56,
    waterQuality: 'Treated',
    reservoir: '11.2m',
    icon: 'thunderstorm'
  }),
  profile({
    id: 'vki-area',
    area: 'VKI Area',
    zone: 'Industrial North Jaipur',
    todayScore: 49,
    yesterdayScore: 55,
    actionTitle: 'Reduce heat and air exposure',
    actionText: 'Avoid long roadside exposure and keep indoor ventilation timed carefully.',
    tempC: 37,
    highC: 41,
    lowC: 28,
    condition: 'Hot • Industrial haze',
    weatherScore: 38,
    humidity: 34,
    wind: 13,
    uv: '9 Very High',
    pressure: 1004,
    aqi: 152,
    waterAvailability: 57,
    waterQuality: 'Treated',
    reservoir: '11.5m',
    icon: 'thunderstorm'
  }),
  profile({
    id: 'bagru',
    area: 'Bagru',
    zone: 'Jaipur District Outskirts',
    todayScore: 57,
    yesterdayScore: 61,
    actionTitle: 'Use water with extra care',
    actionText: 'Postpone non-essential washing and prioritize plant watering after sunset only.',
    tempC: 37,
    highC: 41,
    lowC: 27,
    condition: 'Very hot • Dry',
    weatherScore: 43,
    humidity: 32,
    wind: 18,
    uv: '9 Very High',
    pressure: 1005,
    aqi: 84,
    waterAvailability: 54,
    reservoir: '10.8m',
    icon: 'wb_sunny'
  }),
  profile({
    id: 'chomu',
    area: 'Chomu',
    zone: 'Jaipur District Outskirts',
    todayScore: 60,
    yesterdayScore: 63,
    actionTitle: 'Protect water reserves',
    actionText: 'Use bucket cleaning and reduce garden watering during afternoon heat.',
    tempC: 36,
    highC: 40,
    lowC: 26,
    condition: 'Hot • Dry breeze',
    weatherScore: 50,
    humidity: 35,
    wind: 17,
    uv: '8 Very High',
    pressure: 1007,
    aqi: 76,
    waterAvailability: 60,
    reservoir: '12.0m',
    icon: 'wb_sunny'
  }),
  profile({
    id: 'kanota',
    area: 'Kanota',
    zone: 'East Jaipur District',
    todayScore: 64,
    yesterdayScore: 68,
    actionTitle: 'Balance outdoor and water habits',
    actionText: 'Use morning hours for outdoor work and keep water use measured.',
    tempC: 35,
    highC: 39,
    lowC: 26,
    condition: 'Warm • Clear',
    weatherScore: 58,
    humidity: 40,
    wind: 16,
    uv: '7 High',
    pressure: 1009,
    aqi: 70,
    waterAvailability: 66,
    reservoir: '13.2m',
    icon: 'partly_cloudy_day'
  }),
  profile({
    id: 'jamdoli',
    area: 'Jamdoli',
    zone: 'East Jaipur',
    todayScore: 68,
    yesterdayScore: 72,
    actionTitle: 'Keep nature-friendly routines',
    actionText: 'Good conditions for low-waste routines, plant care and daylight-first habits.',
    tempC: 34,
    highC: 38,
    lowC: 25,
    condition: 'Warm • Breezy',
    weatherScore: 65,
    humidity: 44,
    wind: 18,
    uv: '7 High',
    pressure: 1010,
    aqi: 64,
    waterAvailability: 74,
    reservoir: '14.7m',
    icon: 'partly_cloudy_day'
  }),
  profile({
    id: 'narayan-vihar',
    area: 'Narayan Vihar',
    zone: 'South-West Jaipur',
    todayScore: 62,
    yesterdayScore: 66,
    actionTitle: 'Use smart household timing',
    actionText: 'Run appliances before evening peak and reduce unnecessary water use.',
    tempC: 35,
    highC: 39,
    lowC: 26,
    condition: 'Hot • Clear',
    weatherScore: 55,
    humidity: 39,
    wind: 15,
    uv: '8 Very High',
    pressure: 1008,
    aqi: 80,
    waterAvailability: 70,
    reservoir: '13.9m',
    icon: 'wb_sunny'
  })
];

export const defaultLocation = locationProfiles[0];

export function getProfileById(id) {
  return locationProfiles.find((item) => item.id === id) ?? defaultLocation;
}

export function buildCustomLocation(areaName) {
  const cleanName = areaName.trim().replace(/\s+/g, ' ');
  const slug = cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  return {
    ...defaultLocation,
    id: slug ? `custom-jaipur-${slug}` : 'custom-jaipur-area',
    city: cleanName || 'Custom Jaipur Area',
    region: 'Jaipur District • Custom Area',
    displayName: cleanName ? `${cleanName}, Jaipur District` : 'Custom Jaipur Area',
    isCustom: true
  };
}

export function normalizeSavedLocation(savedLocation) {
  if (typeof savedLocation === 'string') return getProfileById(savedLocation);
  if (savedLocation?.isCustom && savedLocation?.id?.startsWith('custom-jaipur-')) return savedLocation;
  if (savedLocation?.id) return getProfileById(savedLocation.id);
  return defaultLocation;
}

export function toFahrenheit(celsius) {
  return Math.round((celsius * 9) / 5 + 32);
}

export function formatTemp(celsius, unit) {
  return unit === 'C' ? `${celsius}°` : `${toFahrenheit(celsius)}°`;
}

export function formatHighLow(weather, unit) {
  const high = unit === 'C' ? weather.highC : toFahrenheit(weather.highC);
  const low = unit === 'C' ? weather.lowC : toFahrenheit(weather.lowC);
  return `High ${high}° Low ${low}°`;
}
