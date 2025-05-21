import React, { useEffect, useState } from 'react';
import riverService from '../services/riverService';
import riverConfig from '../config/riverConfig';

const RiverDataview = () => {
  const [allData, setAllData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const results = {};

      for (const river of riverConfig) {
        try {
          const data = await riverService.getMonthlyAverages(river.averageUrl);
          results[river.id] = data;
        } catch (error) {
          console.error(`Failed to fetch from ${river.name}`, error);
          results[river.id] = [];
        }
      }

      setAllData(results);
    };

    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Monthly Water Quality Averages</h1>
      {riverConfig.map((river) => (
        <div key={river.id} className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{river.name}</h2>
          <div className="overflow-x-auto">
            <table className="table-auto border-collapse border border-gray-400 w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2">Month</th>
                  <th className="border p-2">Year</th>
                  <th className="border p-2">pH</th>
                  <th className="border p-2">Alkalinity</th>
                  <th className="border p-2">Conductivity</th>
                  <th className="border p-2">BOD</th>
                  <th className="border p-2">Nitrite</th>
                  <th className="border p-2">Copper (mg/L)</th>
                  <th className="border p-2">Copper (µg/L)</th>
                  <th className="border p-2">Iron (µg/L)</th>
                  <th className="border p-2">Zinc (µg/L)</th>
                </tr>
              </thead>
              <tbody>
                {(allData[river.id]?.length > 0 ? allData[river.id].map((entry, index) => (
                  <tr key={index}>
                    <td className="border p-2">{entry.month}</td>
                    <td className="border p-2">{entry.year}</td>
                    <td className="border p-2">{entry.avgPh?.toFixed(2)}</td>
                    <td className="border p-2">{entry.avgAlkalinity?.toFixed(2)}</td>
                    <td className="border p-2">{entry.avgConductivity?.toFixed(2)}</td>
                    <td className="border p-2">{entry.avgBod?.toFixed(2)}</td>
                    <td className="border p-2">{entry.avgNitrite?.toFixed(2)}</td>
                    <td className="border p-2">{entry.avgCopperDissolvedMg?.toFixed(2)}</td>
                    <td className="border p-2">{entry.avgCopperDissolvedUg?.toFixed(2)}</td>
                    <td className="border p-2">{entry.avgIronDissolvedUg?.toFixed(2)}</td>
                    <td className="border p-2">{entry.avgZincDissolvedUg?.toFixed(2)}</td>
                  </tr>
                )) : (
                  <tr><td className="p-2 text-center" colSpan="11">No data available</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RiverDataview;
