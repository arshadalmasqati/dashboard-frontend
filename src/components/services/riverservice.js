// src/services/riverService.js

const riverService = {
  async getMonthlyAverages(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json(); // expected to return an array of { month, year, avgPh, ... }
    } catch (error) {
      console.error("Failed to fetch monthly averages:", error);
      return [];
    }
  },

  async getLatestFlag(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json(); // expected to return a single flag object
    } catch (error) {
      console.error("Failed to fetch latest flag:", error);
      return null;
    }
  }
};

export default riverService;
