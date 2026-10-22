import React, { useState } from 'react';
import { FleetProvider, useFleet } from './context/FleetContext';
import { Navbar } from './components/Navbar';
import { MapDashboard } from './components/MapDashboard';
import { DriverScoreboard } from './components/DriverScoreboard';
import { PredictiveMaintenance } from './components/PredictiveMaintenance';
import { CostAnalytics } from './components/CostAnalytics';
import { ShieldAlert, AlertTriangle, CheckCircle2, Radio, Server } from 'lucide-react';

const DashboardContent = () => {
  const [activeTab, setActiveTab] = useState('tracking');
  const { toastMessage, isConnected, lastUpdated } = useFleet();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top HUD Navigation Bar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Floating Real-Time Alert Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-[9999] max-w-md p-4 rounded-2xl glass-panel-glow border border-rose-500/40 text-xs shadow-2xl animate-telemetry-pulse">
          <div className="flex items-start space-x-3">
            <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-white text-sm">{toastMessage.title}</h4>
              <p className="text-slate-300 mt-1 leading-relaxed">{toastMessage.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Dynamic View Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'tracking' && <MapDashboard />}
        {activeTab === 'drivers' && <DriverScoreboard />}
        {activeTab === 'predictive' && <PredictiveMaintenance />}
        {activeTab === 'analytics' && <CostAnalytics />}
      </main>

      {/* Status Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-3">
            <span className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-ping' : 'bg-rose-500'}`} />
              <span className="text-slate-400">Socket.io Stream: {isConnected ? 'Active (Port 5001)' : 'Offline'}</span>
            </span>
            <span className="text-slate-700">|</span>
            <span>Simulated Telematics Engine v2.6</span>
          </div>

          <div className="flex items-center space-x-4 text-slate-400">
            <span>Predictive Fleet Optimization System</span>
            <span className="text-slate-700">|</span>
            <span>Target: 10-20% Fuel Savings • 30% Breakdown Reduction</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <FleetProvider>
      <DashboardContent />
    </FleetProvider>
  );
}
