/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Copy, Check, Scale, Coins, Heart, Fuel, Percent, Receipt, TrendingUp, AlertCircle } from 'lucide-react';
import { API_SERVICES } from '../../services/api';

interface ToolProps {
  language: 'en' | 'fa';
}

const useCopy = () => {
  const [copied, setCopied] = useState(false);
  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return { copied, copy };
};

// ==========================================
// 1. UNIT CONVERTER
// ==========================================
export function UnitConverterTool({ language }: ToolProps) {
  const [cat, setCat] = useState<'length' | 'weight' | 'temp'>('length');
  const [inputVal, setInputVal] = useState('1');
  const [unitFrom, setUnitFrom] = useState('m');
  const [unitTo, setUnitTo] = useState('cm');
  const [outputVal, setOutputVal] = useState('');

  const conversions: Record<string, Record<string, number>> = {
    length: { m: 1, cm: 0.01, km: 1000, inch: 0.0254, feet: 0.3048, yard: 0.9144, mile: 1609.34 },
    weight: { kg: 1, g: 0.001, lbs: 0.453592, oz: 0.0283495, ton: 1000 },
  };

  const convert = () => {
    const num = parseFloat(inputVal);
    if (isNaN(num)) {
      setOutputVal('');
      return;
    }

    if (cat === 'temp') {
      let tempInC = num;
      if (unitFrom === 'f') tempInC = (num - 32) * 5/9;
      if (unitFrom === 'k') tempInC = num - 273.15;

      let result = tempInC;
      if (unitTo === 'f') result = (tempInC * 9/5) + 32;
      if (unitTo === 'k') result = tempInC + 273.15;

      setOutputVal(String(parseFloat(result.toFixed(4))));
    } else {
      const baseVal = num * conversions[cat][unitFrom];
      const result = baseVal / conversions[cat][unitTo];
      setOutputVal(String(parseFloat(result.toFixed(6))));
    }
  };

  useEffect(() => {
    convert();
  }, [inputVal, unitFrom, unitTo, cat]);

  // Adjust defaults on category change
  useEffect(() => {
    if (cat === 'length') { setUnitFrom('m'); setUnitTo('cm'); }
    if (cat === 'weight') { setUnitFrom('kg'); setUnitTo('lbs'); }
    if (cat === 'temp') { setUnitFrom('c'); setUnitTo('f'); }
  }, [cat]);

  return (
    <div className="space-y-4">
      <div className="flex bg-zinc-950 p-1 border border-zinc-800 rounded-xl max-w-sm">
        {(['length', 'weight', 'temp'] as const).map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`flex-1 text-xs py-1.5 rounded-lg font-semibold uppercase transition-colors ${
              cat === c ? 'bg-indigo-600 text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-zinc-950 p-6 rounded-xl border border-zinc-800">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-400">Value from</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="flex-1 bg-zinc-900 border border-zinc-750 p-2.5 rounded-xl font-mono text-sm outline-none"
            />
            <select
              value={unitFrom}
              onChange={(e) => setUnitFrom(e.target.value)}
              className="bg-zinc-900 text-zinc-100 font-mono text-xs p-2.5 rounded-xl border border-zinc-750 outline-none"
            >
              {cat === 'length' && (
                <>
                  <option value="m">Meter</option>
                  <option value="cm">Cm</option>
                  <option value="km">Km</option>
                  <option value="inch">Inch</option>
                  <option value="feet">Feet</option>
                  <option value="yard">Yard</option>
                  <option value="mile">Mile</option>
                </>
              )}
              {cat === 'weight' && (
                <>
                  <option value="kg">Kg</option>
                  <option value="g">G</option>
                  <option value="lbs">Lbs</option>
                  <option value="oz">Oz</option>
                  <option value="ton">Ton</option>
                </>
              )}
              {cat === 'temp' && (
                <>
                  <option value="c">°Celsius</option>
                  <option value="f">°Fahrenheit</option>
                  <option value="k">Kelvin</option>
                </>
              )}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-400">Value to</label>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={outputVal}
              placeholder="Result..."
              className="flex-1 bg-zinc-900 border border-zinc-750 p-2.5 rounded-xl font-mono text-sm outline-none text-indigo-400 font-semibold"
            />
            <select
              value={unitTo}
              onChange={(e) => setUnitTo(e.target.value)}
              className="bg-zinc-900 text-zinc-100 font-mono text-xs p-2.5 rounded-xl border border-zinc-750 outline-none"
            >
              {cat === 'length' && (
                <>
                  <option value="m">Meter</option>
                  <option value="cm">Cm</option>
                  <option value="km">Km</option>
                  <option value="inch">Inch</option>
                  <option value="feet">Feet</option>
                  <option value="yard">Yard</option>
                  <option value="mile">Mile</option>
                </>
              )}
              {cat === 'weight' && (
                <>
                  <option value="kg">Kg</option>
                  <option value="g">G</option>
                  <option value="lbs">Lbs</option>
                  <option value="oz">Oz</option>
                  <option value="ton">Ton</option>
                </>
              )}
              {cat === 'temp' && (
                <>
                  <option value="c">°Celsius</option>
                  <option value="f">°Fahrenheit</option>
                  <option value="k">Kelvin</option>
                </>
              )}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. CURRENCY CONVERTER (LIVE ONLINE)
// ==========================================
export function CurrencyConverterTool({ language }: ToolProps) {
  const [rates, setRates] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [amount, setAmount] = useState('100');
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('EUR');
  const [result, setResult] = useState('');

  const fetchRates = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await API_SERVICES.getCurrencyRates();
      setRates(data.rates || {});
    } catch {
      setError('Market feeds down. Fallback rates loaded.');
      // Fallback rates to be safe
      setRates({ USD: 1, EUR: 0.92, GBP: 0.79, JPY: 154.2, IRR: 42000, CAD: 1.36, AED: 3.67 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  useEffect(() => {
    if (Object.keys(rates).length === 0) return;
    const amt = parseFloat(amount);
    if (isNaN(amt)) {
      setResult('');
      return;
    }
    const valInUsd = amt / (rates[from] || 1);
    const converted = valInUsd * (rates[to] || 1);
    setResult(converted.toLocaleString(undefined, { maximumFractionDigits: 4 }));
  }, [amount, from, to, rates]);

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-amber-950/20 border border-amber-900/50 p-3 rounded-xl flex items-center gap-2 text-xs text-amber-400">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-zinc-950 p-6 rounded-xl border border-zinc-800">
        <div>
          <label className="block text-xs font-semibold text-zinc-500 uppercase mb-2">Exchange Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-750 p-2.5 rounded-xl text-zinc-100 font-mono text-sm outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-500 uppercase mb-2">From</label>
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="w-full bg-zinc-900 text-zinc-100 font-mono text-xs p-2.5 rounded-xl border border-zinc-750 outline-none"
          >
            {Object.keys(rates).map((currency) => (
              <option key={currency} value={currency}>{currency}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-500 uppercase mb-2">To</label>
          <select
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full bg-zinc-900 text-zinc-100 font-mono text-xs p-2.5 rounded-xl border border-zinc-750 outline-none"
          >
            {Object.keys(rates).map((currency) => (
              <option key={currency} value={currency}>{currency}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-850 flex justify-between items-center text-sm">
        <span className="text-zinc-500">Live Converted Value</span>
        <span className="font-mono text-indigo-400 font-bold text-lg">
          {loading ? 'Refreshing markets...' : `${result} ${to}`}
        </span>
      </div>
    </div>
  );
}

// ==========================================
// 3. BMI HEALTH CALCULATOR
// ==========================================
export function BmiCalculatorTool({ language }: ToolProps) {
  const [height, setHeight] = useState('175');
  const [weight, setWeight] = useState('70');
  const [bmi, setBmi] = useState<number | null>(null);

  const calculateBmi = () => {
    const h = parseFloat(height) / 100;
    const w = parseFloat(weight);
    if (h > 0 && w > 0) {
      setBmi(w / (h * h));
    } else {
      setBmi(null);
    }
  };

  useEffect(() => {
    calculateBmi();
  }, [height, weight]);

  const getBmiClass = () => {
    if (!bmi) return { label: '...', color: 'text-zinc-500', advice: 'Type height and weight' };
    if (bmi < 18.5) return { label: 'Underweight', color: 'text-amber-400', advice: 'Slightly below average weight bounds.' };
    if (bmi < 25) return { label: 'Healthy Normal', color: 'text-emerald-400', advice: 'Perfect average weight classification!' };
    if (bmi < 30) return { label: 'Overweight', color: 'text-rose-400', advice: 'Above average healthy boundaries.' };
    return { label: 'Obese', color: 'text-red-500', advice: 'Exceeding standard healthy weight ranges.' };
  };

  const bmiClass = getBmiClass();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
      <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 space-y-4">
        <div>
          <div className="flex justify-between text-xs font-semibold text-zinc-400 mb-1">
            <span>Height (cm)</span>
            <span className="font-mono text-indigo-400">{height} cm</span>
          </div>
          <input type="range" min="100" max="230" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full accent-indigo-500" />
        </div>
        <div>
          <div className="flex justify-between text-xs font-semibold text-zinc-400 mb-1">
            <span>Weight (kg)</span>
            <span className="font-mono text-indigo-400">{weight} kg</span>
          </div>
          <input type="range" min="30" max="150" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full accent-indigo-500" />
        </div>
      </div>

      <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 flex flex-col justify-center text-center">
        <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Your Calculated BMI</span>
        <div className="text-4xl font-bold font-mono text-zinc-100 my-2">{bmi ? bmi.toFixed(1) : '...'}</div>
        <div className={`text-sm font-bold uppercase tracking-wide ${bmiClass.color}`}>{bmiClass.label}</div>
        <p className="text-xs text-zinc-500 mt-2">{bmiClass.advice}</p>
      </div>
    </div>
  );
}

// ==========================================
// 4. LOAN & AMORTIZATION PLANNER
// ==========================================
export function LoanCalculatorTool({ language }: ToolProps) {
  const [principal, setPrincipal] = useState('50000');
  const [interest, setInterest] = useState('5.5');
  const [years, setYears] = useState('10');
  const [monthlyPayment, setMonthlyPayment] = useState('');
  const [totalInterest, setTotalInterest] = useState('');

  const calculateLoan = () => {
    const P = parseFloat(principal);
    const r = parseFloat(interest) / 12 / 100;
    const n = parseFloat(years) * 12;

    if (P > 0 && r > 0 && n > 0) {
      const M = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const totalPay = M * n;
      setMonthlyPayment(M.toLocaleString(undefined, { maximumFractionDigits: 2 }));
      setTotalInterest((totalPay - P).toLocaleString(undefined, { maximumFractionDigits: 2 }));
    } else {
      setMonthlyPayment('');
      setTotalInterest('');
    }
  };

  useEffect(() => {
    calculateLoan();
  }, [principal, interest, years]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-1">Loan Amount ($)</label>
          <input
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-750 p-2 rounded-lg font-mono text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-1">Annual Interest Rate (%)</label>
          <input
            type="number"
            step="0.1"
            value={interest}
            onChange={(e) => setInterest(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-750 p-2 rounded-lg font-mono text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-1">Loan Term (Years)</label>
          <input
            type="number"
            value={years}
            onChange={(e) => setYears(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-750 p-2 rounded-lg font-mono text-sm"
          />
        </div>
      </div>

      <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 flex flex-col justify-center space-y-4 font-mono text-sm">
        <div className="flex justify-between border-b border-zinc-900 pb-2">
          <span className="text-zinc-500">Monthly Payment:</span>
          <span className="text-indigo-400 font-bold">${monthlyPayment || '...'}</span>
        </div>
        <div className="flex justify-between pb-2">
          <span className="text-zinc-500">Total Interest Paid:</span>
          <span className="text-zinc-300 font-semibold">${totalInterest || '...'}</span>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 5. FUEL COST ESTIMATOR
// ==========================================
export function FuelEstimatorTool({ language }: ToolProps) {
  const [distance, setDistance] = useState('250');
  const [price, setPrice] = useState('1.5');
  const [efficiency, setEfficiency] = useState('8'); // L/100km

  const [cost, setCost] = useState('0');

  useEffect(() => {
    const d = parseFloat(distance);
    const p = parseFloat(price);
    const e = parseFloat(efficiency);

    if (d > 0 && p > 0 && e > 0) {
      const fuelNeeded = (d / 100) * e;
      setCost((fuelNeeded * p).toFixed(2));
    }
  }, [distance, price, efficiency]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
      <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Trip Distance (km)</label>
          <input type="number" value={distance} onChange={(e) => setDistance(e.target.value)} className="w-full bg-zinc-900 border border-zinc-750 p-2 rounded-lg font-mono text-sm text-zinc-100" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Fuel Price (per L)</label>
          <input type="number" step="0.05" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full bg-zinc-900 border border-zinc-750 p-2 rounded-lg font-mono text-sm text-zinc-100" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Fuel Consumption (L/100km)</label>
          <input type="number" value={efficiency} onChange={(e) => setEfficiency(e.target.value)} className="w-full bg-zinc-900 border border-zinc-750 p-2 rounded-lg font-mono text-sm text-zinc-100" />
        </div>
      </div>

      <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 flex flex-col justify-center text-center">
        <span className="text-xs text-zinc-500 uppercase font-semibold">Total Estimated Expenses</span>
        <div className="text-4xl font-bold font-mono text-emerald-400 my-3">${cost}</div>
        <p className="text-xs text-zinc-500">Trip calculation based on efficiency matrices.</p>
      </div>
    </div>
  );
}

// ==========================================
// 6. BASE NUMBER ARITHMETIC
// ==========================================
export function BaseMathTool({ language }: ToolProps) {
  const [numA, setNumA] = useState('1010');
  const [numB, setNumB] = useState('0110');
  const [base, setBase] = useState<2 | 8 | 10 | 16>(2);
  const [op, setOp] = useState<'+' | '-' | '*'>('+');
  const [result, setResult] = useState('');

  const calculate = () => {
    try {
      const a = parseInt(numA, base);
      const b = parseInt(numB, base);
      if (isNaN(a) || isNaN(b)) throw new Error();

      let res = 0;
      if (op === '+') res = a + b;
      if (op === '-') res = a - b;
      if (op === '*') res = a * b;

      setResult(res.toString(base).toUpperCase());
    } catch {
      setResult('ERR');
    }
  };

  useEffect(() => {
    calculate();
  }, [numA, numB, base, op]);

  return (
    <div className="space-y-4">
      <div className="flex bg-zinc-950 p-1 border border-zinc-800 rounded-xl max-w-sm">
        {([2, 8, 10, 16] as const).map((b) => (
          <button
            key={b}
            onClick={() => setBase(b)}
            className={`flex-1 text-xs py-1.5 rounded-lg transition-colors font-semibold ${
              base === b ? 'bg-indigo-600 text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Base {b}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-zinc-950 p-6 rounded-xl border border-zinc-800">
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Operand A</label>
          <input type="text" value={numA} onChange={(e) => setNumA(e.target.value)} className="w-full bg-zinc-900 border border-zinc-750 p-2 rounded-lg font-mono text-sm text-zinc-100 text-center" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Operator</label>
          <select value={op} onChange={(e: any) => setOp(e.target.value)} className="w-full bg-zinc-900 border border-zinc-750 p-2 rounded-lg font-mono text-sm text-zinc-100 text-center outline-none">
            <option value="+">+</option>
            <option value="-">-</option>
            <option value="*">×</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Operand B</label>
          <input type="text" value={numB} onChange={(e) => setNumB(e.target.value)} className="w-full bg-zinc-900 border border-zinc-750 p-2 rounded-lg font-mono text-sm text-zinc-100 text-center" />
        </div>
      </div>

      <div className="p-4 bg-zinc-950 border border-zinc-850 rounded-xl text-center font-mono text-xl font-bold text-indigo-400">
        RESULT: {result}
      </div>
    </div>
  );
}

// ==========================================
// 7. PERCENTAGE SOLVER
// ==========================================
export function PercentageTool({ language }: ToolProps) {
  const [val1, setVal1] = useState('20');
  const [val2, setVal2] = useState('150');
  const [out1, setOut1] = useState('0');

  useEffect(() => {
    const v1 = parseFloat(val1);
    const v2 = parseFloat(val2);
    if (v1 > 0 && v2 > 0) {
      setOut1(((v1 / 100) * v2).toFixed(4));
    }
  }, [val1, val2]);

  return (
    <div className="max-w-md mx-auto bg-zinc-950 p-6 rounded-xl border border-zinc-800 space-y-4">
      <span className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">What is X% of Y?</span>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <span className="text-[10px] text-zinc-500 font-bold block mb-1">PERCENT X</span>
          <input type="number" value={val1} onChange={(e) => setVal1(e.target.value)} className="w-full bg-zinc-900 border border-zinc-750 p-2 rounded-lg text-center font-mono text-sm text-zinc-100" />
        </div>
        <div>
          <span className="text-[10px] text-zinc-500 font-bold block mb-1">TOTAL Y</span>
          <input type="number" value={val2} onChange={(e) => setVal2(e.target.value)} className="w-full bg-zinc-900 border border-zinc-750 p-2 rounded-lg text-center font-mono text-sm text-zinc-100" />
        </div>
      </div>
      <div className="p-3 bg-zinc-900 rounded-lg text-center font-mono text-sm">
        Result: <span className="text-indigo-400 font-bold">{parseFloat(out1)}</span>
      </div>
    </div>
  );
}

// ==========================================
// 8. BILL SPLITTER & TIP CALCULATOR
// ==========================================
export function TipCalculatorTool({ language }: ToolProps) {
  const [bill, setBill] = useState('120');
  const [tip, setTip] = useState('15');
  const [people, setPeople] = useState('3');

  const [totalPerPerson, setTotalPerPerson] = useState('0');

  useEffect(() => {
    const b = parseFloat(bill);
    const t = parseFloat(tip);
    const p = parseFloat(people);

    if (b > 0 && p > 0) {
      const tipAmount = b * (t / 100);
      setTotalPerPerson(((b + tipAmount) / p).toFixed(2));
    }
  }, [bill, tip, people]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
      <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Total Bill ($)</label>
          <input type="number" value={bill} onChange={(e) => setBill(e.target.value)} className="w-full bg-zinc-900 border border-zinc-750 p-2 rounded-lg font-mono text-sm text-zinc-100" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Tip Percent (%)</label>
          <input type="number" value={tip} onChange={(e) => setTip(e.target.value)} className="w-full bg-zinc-900 border border-zinc-750 p-2 rounded-lg font-mono text-sm text-zinc-100" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Split count (People)</label>
          <input type="number" value={people} onChange={(e) => setPeople(e.target.value)} className="w-full bg-zinc-900 border border-zinc-750 p-2 rounded-lg font-mono text-sm text-zinc-100" />
        </div>
      </div>

      <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 flex flex-col justify-center text-center">
        <span className="text-xs text-zinc-500 uppercase font-semibold">Expense Per Person</span>
        <div className="text-4xl font-bold font-mono text-indigo-400 my-3">${totalPerPerson}</div>
        <p className="text-xs text-zinc-500">Includes bill split with customized tip metrics.</p>
      </div>
    </div>
  );
}
