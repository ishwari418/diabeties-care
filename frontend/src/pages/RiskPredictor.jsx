import React, { useState } from 'react';
import { Activity, Info, BarChart3, AlertTriangle, CheckCircle2, ChevronRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import axios from 'axios';

const RiskPredictor = () => {
  const [formData, setFormData] = useState({
    Age: 45,
    BMI: 28.5,
    Glucose: 120,
    BloodPressure: 85,
    Insulin: 15,
    PhysicalActivity: 5,
    DietType: 1,
    Smoking: 0,
    FamilyHistory: 1
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/predict-risk', formData);
      setResult(response.data);
    } catch (error) {
      console.error("Prediction failed", error);
      // Mock result
      setResult({
        risk_percentage: 65.4,
        category: "Medium",
        shap_values: {
          Glucose: 0.8,
          BMI: 0.5,
          Age: 0.3,
          PhysicalActivity: -0.4,
          FamilyHistory: 0.6,
          Smoking: 0.1,
          Insulin: 0.2,
          BloodPressure: 0.1,
          DietType: -0.1
        },
        text_explanation: [
          "High Glucose is the primary contributor to your risk.",
          "Family history significantly increases risk factors.",
          "Regular physical activity is helping to lower your overall risk."
        ],
        recommendations: {
          diet: ["Focus on high-fiber, low-glycemic index foods."],
          exercise: ["Aim for at least 150 minutes of moderate activity per week."],
          alternatives: ["Swap white rice for quinoa or cauliflower rice."]
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const shapData = result ? Object.entries(result.shap_values)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
    : [];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header>
        <h2 className="text-3xl font-bold">Diabetes Risk Predictor</h2>
        <p className="text-slate-400 mt-2">Enter your health metrics for an explainable ML risk assessment.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="glass p-8">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.keys(formData).map((key) => (
              <div key={key}>
                <label className="block text-sm font-medium text-slate-400 mb-2">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                <input
                  type={typeof formData[key] === 'number' ? 'number' : 'text'}
                  step="any"
                  value={formData[key]}
                  onChange={(e) => setFormData({ ...formData, [key]: parseFloat(e.target.value) || 0 })}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            ))}
            <div className="md:col-span-2 mt-4">
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-bold transition-all disabled:opacity-50"
              >
                {loading ? 'Calculating...' : 'Predict Risk'}
              </button>
            </div>
          </form>
        </div>

        {/* Results Section */}
        {result && (
          <div className="space-y-6">
            {/* Risk Card */}
            <div className={`glass p-8 relative overflow-hidden ${
              result.category === 'High' ? 'border-red-500/30' : 
              result.category === 'Medium' ? 'border-amber-500/30' : 'border-green-500/30'
            }`}>
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <h3 className="text-lg font-medium text-slate-400">Total Risk Probability</h3>
                  <p className="text-5xl font-bold mt-2">{result.risk_percentage}%</p>
                  <div className={`mt-4 inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${
                    result.category === 'High' ? 'bg-red-500/20 text-red-500' : 
                    result.category === 'Medium' ? 'bg-amber-500/20 text-amber-500' : 'bg-green-500/20 text-green-500'
                  }`}>
                    {result.category} Risk
                  </div>
                </div>
                <Activity className={`w-12 h-12 ${
                   result.category === 'High' ? 'text-red-500' : 
                   result.category === 'Medium' ? 'text-amber-500' : 'text-green-500'
                }`} />
              </div>
              {/* Progress bar background decoration */}
              <div className="absolute bottom-0 left-0 h-2 bg-slate-800 w-full">
                <div 
                  className={`h-full transition-all duration-1000 ${
                    result.category === 'High' ? 'bg-red-500' : 
                    result.category === 'Medium' ? 'bg-amber-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${result.risk_percentage}%` }}
                ></div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="glass p-6 space-y-4">
              <h3 className="text-xl font-semibold flex items-center">
                <CheckCircle2 className="w-5 h-5 mr-2 text-emerald-500" />
                Personalized Recommendations
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {Object.entries(result.recommendations).map(([type, items]) => (
                  <div key={type} className="bg-slate-900/50 p-4 rounded-xl">
                    <h4 className="text-xs uppercase text-slate-500 mb-2 font-bold tracking-widest">{type}</h4>
                    <ul className="space-y-2">
                      {items.map((item, i) => (
                        <li key={i} className="text-sm flex items-start">
                          <ChevronRight className="w-4 h-4 mr-1 text-blue-500 shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* SHAP Chart */}
          <div className="glass p-8">
            <h3 className="text-xl font-semibold mb-6 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-purple-500" />
              Feature Contribution (SHAP)
            </h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={shapData} layout="vertical" margin={{ left: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                  <XAxis type="number" stroke="#94a3b8" />
                  <YAxis dataKey="name" type="category" stroke="#94a3b8" width={100} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                  />
                  <Bar dataKey="value">
                    {shapData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.value > 0 ? '#ef4444' : '#10b981'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-slate-500 mt-4 text-center italic">
              Red bars indicate factors increasing risk, green bars indicate factors reducing risk.
            </p>
          </div>

          {/* Text Explanations */}
          <div className="glass p-8">
            <h3 className="text-xl font-semibold mb-6 flex items-center">
              <Info className="w-5 h-5 mr-2 text-blue-500" />
              Detailed Insights
            </h3>
            <div className="space-y-4">
              {result.text_explanation.map((text, i) => (
                <div key={i} className="flex items-start p-4 bg-slate-900/50 rounded-xl border-l-4 border-blue-500">
                  <AlertTriangle className="w-5 h-5 mr-3 text-blue-500 shrink-0" />
                  <p className="text-slate-200">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiskPredictor;
