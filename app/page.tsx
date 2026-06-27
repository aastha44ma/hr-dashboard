"use client";
import { useState } from 'react';

export default function HRDashboard() {
  const [formData, setFormData] = useState({
    MonthlyIncome: 5000,
    Age: 30,
    YearsAtCompany: 3,
    OverTime: 'No'
  });
  const [result, setResult] = useState<{ score: number, level: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    // 1. THIS STOPS THE PAGE REFRESH (The /? issue)
    e.preventDefault(); 
    
    try {
      // 2. Replace this URL with your ACTUAL Render URL
      const response = await fetch('https://attrition-api-3rgc.onrender.com/docs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      // 3. Check if the API threw an error (like a 500 or 404)
      if (!response.ok) {
        throw new Error(`API returned status: ${response.status}`);
      }
      
      const data = await response.json();
      setResult({ score: data.flight_risk_score, level: data.risk_level });

    } catch (error) {
      // 4. If something breaks, it will log here instead of doing nothing
      console.error("Fetch Error:", error);
      alert("Something went wrong! Right-click -> Inspect -> Console to see the error.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Flight Risk Predictor</h1>
        <p className="text-gray-500 mb-8">Enter employee metrics to generate an AI-driven attrition probability score.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Monthly Income ($)</label>
              <input 
                type="number" 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                value={formData.MonthlyIncome}
                onChange={e => setFormData({...formData, MonthlyIncome: Number(e.target.value)})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Age</label>
              <input 
                type="number" 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                value={formData.Age}
                onChange={e => setFormData({...formData, Age: Number(e.target.value)})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Years at Company</label>
              <input 
                type="number" 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                value={formData.YearsAtCompany}
                onChange={e => setFormData({...formData, YearsAtCompany: Number(e.target.value)})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Frequent Overtime?</label>
              <select 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border bg-white"
                value={formData.OverTime}
                onChange={e => setFormData({...formData, OverTime: e.target.value})}
              >
                <option>No</option>
                <option>Yes</option>
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-slate-900 text-white font-bold py-3 px-4 rounded-md hover:bg-slate-800 transition duration-200"
          >
            Calculate Risk Score
          </button>
        </form>

        {result && (
          <div className={`mt-8 p-6 rounded-lg text-center ${result.level === 'High' ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Analysis Complete</h3>
            <div className="text-4xl font-black mb-1" style={{ color: result.level === 'High' ? '#dc2626' : '#16a34a'}}>
              {result.score}%
            </div>
            <p className="text-sm text-gray-600 uppercase tracking-wide font-semibold">
              {result.level} Flight Risk
            </p>
          </div>
        )}
      </div>
    </div>
  );
}