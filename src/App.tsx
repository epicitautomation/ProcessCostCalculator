import { useState, useEffect } from 'react';
import './calculator.css';

const TIME_UNITS = ['seconds', 'minutes', 'hours'] as const;
type TimeUnit = typeof TIME_UNITS[number];

const PERIODS = [
  'work day', 'day', 'work week', 'week', 'month', 'quarter', 'year'
] as const;
type Period = typeof PERIODS[number];

export default function ProcessCostCalculator() {
  const [mode, setMode] = useState<'public' | 'ghl'>('ghl');
  const [timeUnit, setTimeUnit] = useState<TimeUnit>('seconds');
  const [period, setPeriod] = useState<Period>('day');
  const [processTime, setProcessTime] = useState(30);
  const [processCount, setProcessCount] = useState(10);
  const [wage, setWage] = useState(20);
  const [totalCost, setTotalCost] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const ref = document.referrer;
    const query = new URLSearchParams(window.location.search);
    const isFromOurSite = ref.includes('epicitautomations') || query.get('source') === 'public';
    if (isFromOurSite) setMode('public');
  }, []);

  useEffect(() => {
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

    if (mode === 'public' || submitted) {
      const secondsPerPeriod = processTime * processCount * unitInSeconds * periodInDays;
      const hours = secondsPerPeriod / 3600;
      const cost = hours * wage;
      setTotalCost(cost);
    }
  }, [timeUnit, period, processTime, processCount, wage, mode, submitted]);

  const SOURCE_LABELS: Record<'public' | 'ghl', string> = {
    public: 'Website cost calculator',
    ghl: 'GHL Funnel'
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/send-lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        name, 
        email,
        source: SOURCE_LABELS[mode] })
    });
    setSubmitted(true);
  };

  const shouldShowCost = mode === 'public' || submitted;

  return (
    <div className="calculator">
      <h2>Process Cost Calculator</h2>

      <div className="form-group">
        <label>My process is measured in</label>
        <select value={timeUnit} onChange={(e) => setTimeUnit(e.target.value as TimeUnit)}>
          <option value="seconds">Seconds</option>
          <option value="minutes">Minutes</option>
          <option value="hours">Hours</option>
        </select>
      </div>

      <div className="form-group">
        <label>Per</label>
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
        <label>Process time</label>
        <div className="slider-wrapper">
          <input
            type="range"
            min="0"
            max="100"
            value={processTime}
            style={{ '--percent': `${processTime}%` } as React.CSSProperties}
            onChange={(e) => setProcessTime(Number(e.target.value))}
          />
          <span>{processTime}</span>
        </div>
      </div>

      <div className="form-group slider-group">
        <label>Process count per {period}</label>
        <div className="slider-wrapper">
          <input
            type="range"
            min="0"
            max="100"
            value={processCount}
            style={{ '--percent': `${processCount}%` } as React.CSSProperties}
            onChange={(e) => setProcessCount(Number(e.target.value))}
          />
          <span>{processCount}</span>
        </div>
      </div>

      <div className="form-group">
        <label>Employee Wage per hour</label>
        <input
          type="number"
          value={wage}
          onChange={(e) => setWage(Number(e.target.value))}
        />
      </div>

      {shouldShowCost && (
        <div className="result-inline">
          <label>Estimated Cost:</label>
          <span className="cost">
            $ {totalCost !== null ? totalCost.toFixed(2) : '0.00'}
          </span>
        </div>
      )}

      {mode === 'public' && (
        <>
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
        </>
      )}

      {mode === 'ghl' && !submitted && (
        <>
          <hr className="divider" />
          <div className="lead-form">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Enter your Name and Email to see your results!</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
              </div>
              <button type="submit">View my Result</button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
