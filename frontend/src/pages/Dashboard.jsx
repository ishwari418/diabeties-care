import React from 'react';
import { TrendingUp, Activity, PieChart, ShieldCheck } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', risk: 45 },
  { name: 'Tue', risk: 52 },
  { name: 'Wed', risk: 48 },
  { name: 'Thu', risk: 61 },
  { name: 'Fri', risk: 55 },
  { name: 'Sat', risk: 42 },
  { name: 'Sun', risk: 38 },
];

const Dashboard = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header>
        <h2 className="text-3xl font-bold text-white">Welcome back, Health Warrior</h2>
        <p className="text-slate-400 mt-2">Here's your diabetic health summary for today.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Avg Risk Score', value: '48%', icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Foods Scanned', value: '12', icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Safety Level', value: 'Moderate', icon: ShieldCheck, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { label: 'Daily Goal', value: '85%', icon: PieChart, color: 'text-purple-500', bg: 'bg-purple-500/10' },
        ].map((stat, i) => (
          <div key={i} className="glass p-6 card-hover">
            <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center mb-4`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass p-6">
          <h3 className="text-xl font-semibold mb-6">Risk Trend (Last 7 Days)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                  itemStyle={{ color: '#3b82f6' }}
                />
                <Line type="monotone" dataKey="risk" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', strokeWidth: 2 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Tip</h3>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
              <p className="text-blue-400 text-sm leading-relaxed">
                "Adding a small amount of vinegar to high-carb meals can help lower the post-meal glucose spike. Try it with your salad!"
              </p>
            </div>
          </div>
          
          <div className="mt-8">
            <h4 className="text-sm font-medium text-slate-400 mb-3">Recent Scan Activity</h4>
            <div className="space-y-4">
              {['Apple', 'White Bread', 'Quinoa'].map((food, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm">{food}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${i === 1 ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                    {i === 1 ? 'High Risk' : 'Safe'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
