import { useState } from 'react';
import './calculator.css';

const TIME_UNITS = ['seconds', 'minutes', 'hours'] as const;
type TimeUnit = typeof TIME_UNITS[number];

const PERIODS = [
  'work day', 'day', 'work week', 'week', 'month', 'quarter', 'year'
] as const;
type Period = typeof PERIODS[number];

export default function ProcessCostCalculator() {
  const [timeUnit, setTimeUnit] = useState<TimeUnit>('seconds');
  const [period, setPeriod] = useState<Period>('day');
  const [processTime, setProcessTime] = useState(30);
  const [processCount, setProcessCount] = useState(10);
  const [wage, setWage] = useState(20);
  const [totalCost, setTotalCost] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleCalculate = () => {
    const unitInSeconds: number | undefined = {
      seconds: 1,
      minutes: 60,
      hours: 3600,
    }[timeUnit];

    const periodInDays: number | undefined = {
      'work day': 1,
      day: 1,
      'work week': 5,
      week: 7,
      month: 30,
      quarter: 90,
      year: 365,
    }[period];

    const secondsPerPeriod = processTime * processCount * unitInSeconds * periodInDays;
    const hours = secondsPerPeriod / 3600;
    const cost = hours * wage;
    setTotalCost(cost);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('https://austins.app.n8n.cloud/webhook/lead-capture', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email })
    });
  };

  return (
    <div className="calculator">
      <h2>Process Cost Calculator</h2>

      <div className="form-group">
        <label>My process is measured in:</label>
        <select value={timeUnit} onChange={(e) => setTimeUnit(e.target.value as TimeUnit)}>
          <option value="seconds">Seconds</option>
          <option value="minutes">Minutes</option>
          <option value="hours">Hours</option>
        </select>
      </div>

      <div className="form-group">
        <label>Per:</label>
        <select value={period} onChange={(e) => setPeriod(e.target.value as Period)}>
          <option value="work day">Work Day</option>
          <option value="day">Day</option>
          <option value="work week">Work Week</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
          <option value="quarter">Quarter</option>
          <option value="year">Year</option>
        </select>
      </div>

      <div className="form-group slider-group">
        <label>Process Time</label>
        <div className="slider-wrapper">
          <input
            type="range"
            min="0"
            max="100"
            value={processTime}
            onChange={(e) => setProcessTime(Number(e.target.value))}
          />
          <span>{processTime}</span>
        </div>
      </div>

      <div className="form-group slider-group">
        <label>Process Count per {period}</label>
        <div className="slider-wrapper">
          <input
            type="range"
            min="0"
            max="100"
            value={processCount}
            onChange={(e) => setProcessCount(Number(e.target.value))}
          />
          <span>{processCount}</span>
        </div>
      </div>

      <div className="form-group">
        <label>Employee Wage per hour:</label>
        <input
          type="number"
          value={wage}
          onChange={(e) => setWage(Number(e.target.value))}
        />
      </div>

      <div className="result-inline">
        <label>Estimated Cost:  </label>
        <span className="cost">
    $ {totalCost !== null ? totalCost.toFixed(2) : '0.00'}
  </span>
      </div>

      <button onClick={handleCalculate}>Calculate</button>

      <hr className="divider" />

      <div className="lead-form">
        <h2>Get in Touch!</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name:</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}
