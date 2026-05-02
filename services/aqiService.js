async function getAQI(lat, lng) {
  const url = `https://api.waqi.info/feed/geo:${lat};${lng}/?token=3359c42459e0e6a5d35318908ae2132f7398ba1d`;

  const res = await fetch(url);
  const data = await res.json();

  const iaqi = data.data.iaqi;

  return {
    aqi: data.data.aqi,
    pm25: iaqi.pm25?.v,
    pm10: iaqi.pm10?.v,
    no2: iaqi.no2?.v,
    o3: iaqi.o3?.v,
    so2: iaqi.so2?.v
  };
}

module.exports = { getAQI };