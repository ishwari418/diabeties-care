import React, { useState } from 'react';
import { Camera, Upload, Barcode, ShieldAlert, CheckCircle, Info } from 'lucide-react';
import axios from 'axios';

const FoodScanner = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleUpload = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    
    setFile(URL.createObjectURL(selectedFile));
    setLoading(true);
    
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('http://localhost:8000/scan-food', formData);
      setResult(response.data);
    } catch (error) {
      console.error("Scan failed", error);
      // Mock result for demo if backend not running
      setResult({
        labels: [{ label: "Apple", probability: 0.95 }],
        nutrition: { name: "Apple", sugar: 10, carbohydrates: 14, calories: 52, glycemic_index: 38 },
        risk_score: { risk_level: "Safe", score: 15.2, color: "green", explanations: ["Low glycemic impact helps maintain stable blood sugar."] }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom duration-500">
      <header>
        <h2 className="text-3xl font-bold">Food Scanner</h2>
        <p className="text-slate-400 mt-2">Upload a photo or enter a barcode to analyze food safety.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="glass p-8 flex flex-col items-center justify-center border-dashed border-2 border-slate-700 hover:border-blue-500/50 transition-colors cursor-pointer relative">
          <input 
            type="file" 
            className="absolute inset-0 opacity-0 cursor-pointer" 
            onChange={handleUpload}
            accept="image/*"
          />
          {file ? (
            <img src={file} alt="Preview" className="w-full h-48 object-cover rounded-xl mb-4" />
          ) : (
            <div className="text-center">
              <Camera className="w-12 h-12 text-slate-500 mx-auto mb-4" />
              <p className="text-lg font-medium">Click to upload food image</p>
              <p className="text-sm text-slate-500 mt-1">Supports JPG, PNG</p>
            </div>
          )}
        </div>

        {/* Barcode Section */}
        <div className="glass p-8 flex flex-col items-center justify-center">
          <Barcode className="w-12 h-12 text-slate-500 mb-4" />
          <p className="text-lg font-medium mb-4">Or enter Barcode</p>
          <div className="flex w-full space-x-2">
            <input 
              type="text" 
              placeholder="e.g. 0123456789" 
              className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition-colors">
              Scan
            </button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <span className="ml-4 text-lg">Analyzing food...</span>
        </div>
      )}

      {result && (
        <div className="glass p-8 space-y-6 animate-in fade-in duration-500">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-bold flex items-center">
                {result.nutrition?.name || result.labels[0].label}
                <span className={`ml-4 text-xs px-3 py-1 rounded-full ${
                  result.risk_score.risk_level === 'Safe' ? 'bg-green-500/20 text-green-500' :
                  result.risk_score.risk_level === 'Moderate' ? 'bg-amber-500/20 text-amber-500' :
                  'bg-red-500/20 text-red-500'
                }`}>
                  {result.risk_score.risk_level}
                </span>
              </h3>
              <p className="text-slate-400 mt-1">Detected with {(result.labels[0].probability * 100).toFixed(1)}% confidence</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-400">Risk Score</p>
              <p className="text-3xl font-bold">{result.risk_score.score}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Sugar', value: `${result.nutrition?.sugar || 0}g` },
              { label: 'Carbs', value: `${result.nutrition?.carbohydrates || 0}g` },
              { label: 'Calories', value: `${result.nutrition?.calories || 0}kcal` },
              { label: 'GI Index', value: result.nutrition?.glycemic_index || 50 },
            ].map((item, i) => (
              <div key={i} className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                <p className="text-xs text-slate-500 uppercase tracking-wider">{item.label}</p>
                <p className="text-lg font-semibold mt-1">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <h4 className="font-medium flex items-center">
              <Info className="w-4 h-4 mr-2 text-blue-500" />
              Why this score?
            </h4>
            <div className="space-y-2">
              {result.risk_score.explanations.map((exp, i) => (
                <div key={i} className="flex items-start space-x-3 text-slate-300 bg-slate-800/30 p-3 rounded-lg">
                  {result.risk_score.risk_level === 'Safe' ? 
                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0" /> : 
                    <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0" />
                  }
                  <p className="text-sm">{exp}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodScanner;
