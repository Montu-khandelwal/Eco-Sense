const wasteData = [
  {
    location: "Harmara",
    lat: 27.01,
    lng: 75.77,
    plasticWasteLevel: "HIGH",
    organicWasteLevel: "MODERATE",
    recyclingRate: 32
  },
  {
    location: "Amer",
    lat: 26.99,
    lng: 75.86,
    plasticWasteLevel: "MODERATE",
    organicWasteLevel: "HIGH",
    recyclingRate: 48
  },
  {
    location: "Goner",
    lat: 26.91,
    lng: 75.79,
    plasticWasteLevel: "LOW",
    organicWasteLevel: "MODERATE",
    recyclingRate: 61
  },
  {
    location: "Sanganer",
    lat: 26.82,
    lng: 75.79,
    plasticWasteLevel: "HIGH",
    organicWasteLevel: "HIGH",
    recyclingRate: 28
  }
];

class wasteEngine {
  constructor() {
    this.data = wasteData;
  }

  // return full dataset
  getAll() {
    return this.data;
  }

  // exact match
  getByLocation(location) {
    return this.data.find(
      (item) => item.location.toLowerCase() === location.toLowerCase()
    ) || null;
  }

  // partial search (useful for UI autocomplete later)
  search(query) {
    return this.data.filter((item) =>
      item.location.toLowerCase().includes(query.toLowerCase())
    );
  }
}

module.exports = new wasteEngine();