import { useState } from 'react';
import './index.css';
import LeadForm from './LeadForm';

 type TimeUnit = 'Seconds' | 'Minutes' | 'Hours';
 type FrequencyUnit = 'Work Day' | 'Day' | 'Work Week' | 'Week' | 'Month' | 'Quarter' | 'Year';

const timeUnits: TimeUnit[] = ['Seconds', 'Minutes', 'Hours'];
const frequencyUnits: FrequencyUnit[] = ['Work Day', 'Day', 'Work Week', 'Week', 'Month', 'Quarter', 'Year'];

const timeUnitToHours = {
  Seconds: 1 / 3600,
  Minutes: 1 / 60,
  Hours: 1,
};

const frequencyUnitToMultiplier = {
  'Work Day': 260,
  'Day': 365,
  'Work Week': 52,
  'Week': 52,
  'Month': 12,
  'Quarter': 4,
  'Year': 1,
};

export default function App() {
  const [timeUnit, setTimeUnit] = useState<TimeUnit>('Minutes');
  const [freqUnit, setFreqUnit] = useState<FrequencyUnit>('Work Day');
  const [processTime, setProcessTime] = useState(10);
  const [processCount, setProcessCount] = useState(5);
  const [wage, setWage] = useState(25);

  const processTimeInHours = processTime * timeUnitToHours[timeUnit];
  const totalProcessesPerYear = processCount * frequencyUnitToMultiplier[freqUnit];
  const annualCost = processTimeInHours * totalProcessesPerYear * wage;

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Process Cost Calculator
        </h1>

        {/* Time Unit Selection */}
        <div className="mb-4">
          <label className="block font-medium mb-1">My process is measured in:  </label>
          <select
            className="w-full p-2 border rounded"
            value={timeUnit}
            onChange={e => setTimeUnit(e.target.value as TimeUnit)}
          >
            {timeUnits.map(unit => (
              <option key={unit}>{unit}</option>
            ))}
          </select>
        </div>

        {/* Frequency Unit Selection */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Per:  </label>
          <select
            className="w-full p-2 border rounded"
            value={freqUnit}
            onChange={e => setFreqUnit(e.target.value as FrequencyUnit)}
          >
            {frequencyUnits.map(unit => (
              <option key={unit}>{unit}</option>
            ))}
          </select>
        </div>

        {/* Process Time Slider */}
        <div className="mb-4">
          <label className="block font-medium mb-1">
            Process time in {timeUnit.toLowerCase()}: {processTime}  
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={processTime}
            onChange={e => setProcessTime(Number(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Process Count Slider */}
        <div className="mb-4">
          <label className="block font-medium mb-1">
            Process count per {freqUnit.toLowerCase()}: {processCount}
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={processCount}
            onChange={e => setProcessCount(Number(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Wage Input */}
        <div className="mb-6">
          <label className="block font-medium mb-1">
            Employee wage per hour ($):  
          </label>
          <input
            type="number"
            className="w-full p-2 border rounded"
            value={wage}
            onChange={e => setWage(Number(e.target.value))}
            min={0}
          />
        </div>

        {/* Results */}
        <div className="text-xl font-semibold text-center">
          Estimated Annual Process Cost: <span className="text-blue-600">${annualCost.toFixed(2)}</span>
        </div>
      </div>
      <LeadForm />
    </div>
  );
}
