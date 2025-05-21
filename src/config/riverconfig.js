// src/config/riverConfig.js

const riverConfig = [
  {
    id: "tyne",
    name: "River Tyne",
    flagUrl: "http://localhost:8080/water-quality/water-quality/flags/latest",
    averageUrl: "http://localhost:8080/monitoring/monitoring/monthly-averages"
  },
  {
    id: "wear",
    name: "River Wear",
    flagUrl: "http://localhost:8082/api/flag/latest",
    averageUrl: "http://localhost:8082/api/monthly-averages"
  },
  {
    id: "trent",
    name: "River Trent",
    flagUrl: "http://localhost:8083/api/flag/latest",
    averageUrl: "http://localhost:8083/api/monthly-averages"
  }
];

export default riverConfig;
