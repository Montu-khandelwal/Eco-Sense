const waterData = require("../data/waterQuality.json");

class waterEngine {
  constructor() {
    this.data = waterData;
  }

  // Return full dataset
  getAll() {
    return this.data;
  }

  // Return single location data (exact match)
  getByLocation(location) {
    return this.data.find(
      (item) => item.location.toLowerCase() === location.toLowerCase()
    ) || null;
  }

  // Optional: filter by partial match (useful for search/autocomplete)
  searchByLocation(query) {
    return this.data.filter((item) =>
      item.location.toLowerCase().includes(query.toLowerCase())
    );
  }
}

module.exports = new waterEngine();