import React, { useState } from 'react';
import Dashboard from './pages/Dashboard';
import FoodScanner from './pages/FoodScanner';
import RiskPredictor from './pages/RiskPredictor';
import { Activity, Camera, LayoutDashboard, AlertCircle } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'scanner': return <FoodScanner />;
      case 'predictor': return <RiskPredictor />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Sidebar / Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 glass m-4 md:top-0 md:left-0 md:bottom-0 md:w-64 md:m-0 md:rounded-none md:border-r">
        <div className="flex items-center justify-around p-4 md:flex-col md:justify-start md:space-y-8 md:h-full">
          <div className="hidden md:flex items-center space-x-2 mb-8">
            <Activity className="text-blue-500 w-8 h-8" />
            <h1 className="text-xl font-bold tracking-tight">Diabetic Companion</h1>
          </div>
          
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { id: 'scanner', icon: Camera, label: 'Food Scanner' },
            { id: 'predictor', icon: AlertCircle, label: 'Risk Predictor' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center space-y-1 md:flex-row md:space-y-0 md:space-x-4 md:w-full md:px-4 md:py-3 md:rounded-xl transition-all duration-300 ${
                activeTab === tab.id 
                  ? 'text-blue-500 bg-blue-500/10 md:bg-blue-500/20' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <tab.icon className="w-6 h-6" />
              <span className="text-xs md:text-base font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="pb-24 md:pb-0 md:pl-64 min-h-screen">
        <div className="max-w-6xl mx-auto p-4 md:p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;
