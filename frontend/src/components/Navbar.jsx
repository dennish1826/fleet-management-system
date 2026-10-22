import React, { useState } from 'react';
import { useFleet } from '../context/FleetContext';
import {
  Activity,
  Bell,
  Radio,
  Zap,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  Flame,
  Wrench,
  TrendingDown,
  RefreshCw,
  X,
} from 'lucide-react';

export const Navbar = ({ activeTab, setActiveTab }) => {
  const {
    vehicles,
    alerts,
    overviewKPIs,
    isConnected,
    lastUpdated,
    resolveAlert,
    resolveAllAlerts,
    injectFault,
    fetchData,
  } = useFleet();

  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showSimModal, setShowSimModal] = useState(false);
  const [filterSeverity, setFilterSeverity] = useState('ALL');

  const unreadAlerts = alerts.filter((a) => !a.resolved_status);
  const criticalCount = unreadAlerts.filter((a) => a.severity === 'Critical').length;
  const filteredAlerts =
    filterSeverity === 'ALL'
      ? unreadAlerts
      : unreadAlerts.filter((a) => a.severity === filterSeverity);

  // Find vehicles for quick fault testing
  const v104 = vehicles.find((v) => v.vehicleId === 'VH-104') || vehicles[0];
  const v105 = vehicles.find((v) => v.vehicleId === 'VH-105') || vehicles[1];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Telematics Indicator */}
          <div className="flex items-center space-x-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 text-white shadow-lg shadow-cyan-500/20">
              <Activity className="w-5 h-5 animate-pulse" />
              {isConnected && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-base tracking-wider text-white uppercase">
                  Apex <span className="text-cyan-400">Telematics</span>
                </span>
                <span className="text-[10px] font-semibold tracking-widest px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 uppercase">
                  v2.6 Real-Time
                </span>
              </div>
              <p className="text-[11px] text-slate-400 flex items-center space-x-1.5">
                <Radio className={`w-3 h-3 ${isConnected ? 'text-emerald-400' : 'text-rose-500 animate-spin'}`} />
                <span>{isConnected ? 'Telemetry Gateway: 3000ms Live Stream' : 'Reconnecting gateway...'}</span>
              </p>
            </div>
          </div>

          {/* Navigation Pills */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('tracking')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'tracking'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Live Fleet Map
            </button>
            <button
              onClick={() => setActiveTab('drivers')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'drivers'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Driver Behavior
            </button>
            <button
              onClick={() => setActiveTab('predictive')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                activeTab === 'predictive'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span>Predictive Health</span>
              {criticalCount > 0 && (
                <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {criticalCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'analytics'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Cost & Asset ROI
            </button>
          </nav>

          {/* Quick Actions & Notification Bell */}
          <div className="flex items-center space-x-2.5">
            {/* Quick Fault Simulation Button */}
            <div className="relative">
              <button
                onClick={() => setShowSimModal(!showSimModal)}
                className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-medium transition"
                title="Inject Simulated Telematics Fault"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Simulate Fault</span>
                <ChevronDown className="w-3 h-3 text-amber-400/80" />
              </button>

              {showSimModal && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-3 z-50">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                    <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-400" /> Fault Injector
                    </span>
                    <button onClick={() => setShowSimModal(false)} className="text-slate-400 hover:text-white">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400 mb-2.5">
                    Inject instant anomalies into real-time telematics stream to test the predictive rule engine:
                  </p>
                  <div className="space-y-1.5">
                    <button
                      onClick={() => {
                        if (v104) injectFault(v104._id, 'OVERHEAT');
                        setShowSimModal(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded bg-slate-800 hover:bg-rose-950/40 hover:border-rose-700/50 border border-slate-700/60 text-xs text-rose-300 flex items-center justify-between transition"
                    >
                      <span className="flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-rose-400" /> Temp Spike (&gt;105°C)
                      </span>
                      <span className="text-[10px] text-slate-400">VH-104</span>
                    </button>
                    <button
                      onClick={() => {
                        if (v105) injectFault(v105._id, 'LOW_BATTERY');
                        setShowSimModal(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded bg-slate-800 hover:bg-amber-950/40 hover:border-amber-700/50 border border-slate-700/60 text-xs text-amber-300 flex items-center justify-between transition"
                    >
                      <span className="flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-amber-400" /> Voltage Drop (11.2V)
                      </span>
                      <span className="text-[10px] text-slate-400">VH-105</span>
                    </button>
                    <button
                      onClick={() => {
                        if (v104) injectFault(v104._id, 'DTC_MISFIRE');
                        setShowSimModal(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded bg-slate-800 hover:bg-purple-950/40 hover:border-purple-700/50 border border-slate-700/60 text-xs text-purple-300 flex items-center justify-between transition"
                    >
                      <span className="flex items-center gap-1.5">
                        <Wrench className="w-3.5 h-3.5 text-purple-400" /> Inject DTC P0300
                      </span>
                      <span className="text-[10px] text-slate-400">VH-104</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Notification Bell Button */}
            <div className="relative">
              <button
                onClick={() => setShowAlertModal(!showAlertModal)}
                className="relative p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition"
                title="Alert Panel"
              >
                <Bell className="w-4 h-4" />
                {unreadAlerts.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4">
                    <span
                      className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                        criticalCount > 0 ? 'bg-rose-400' : 'bg-amber-400'
                      } opacity-75`}
                    ></span>
                    <span
                      className={`relative inline-flex items-center justify-center rounded-full h-4 w-4 text-[9px] font-bold text-white ${
                        criticalCount > 0 ? 'bg-rose-600' : 'bg-amber-500'
                      }`}
                    >
                      {unreadAlerts.length}
                    </span>
                  </span>
                )}
              </button>

              {/* Notification Modal Drawer */}
              {showAlertModal && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-slate-700 shadow-2xl p-4 z-50">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center space-x-2">
                      <ShieldAlert className="w-4 h-4 text-cyan-400" />
                      <span className="font-bold text-white text-sm">Real-Time Alert Feed</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        {unreadAlerts.length} active
                      </span>
                    </div>
                    {unreadAlerts.length > 0 && (
                      <button
                        onClick={resolveAllAlerts}
                        className="text-[11px] text-cyan-400 hover:text-cyan-300 font-medium"
                      >
                        Resolve All
                      </button>
                    )}
                  </div>

                  {/* Filter Pills */}
                  <div className="flex space-x-1.5 my-3">
                    {['ALL', 'Critical', 'Warning'].map((sev) => (
                      <button
                        key={sev}
                        onClick={() => setFilterSeverity(sev)}
                        className={`text-[11px] px-2.5 py-1 rounded-md font-medium transition ${
                          filterSeverity === sev
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                            : 'text-slate-400 hover:bg-slate-800'
                        }`}
                      >
                        {sev}
                      </button>
                    ))}
                  </div>

                  {/* Alert List */}
                  <div className="max-h-80 overflow-y-auto space-y-2.5 pr-1">
                    {filteredAlerts.length === 0 ? (
                      <div className="py-8 text-center text-slate-500 text-xs">
                        <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500/50 mb-2" />
                        No active alerts in this category
                      </div>
                    ) : (
                      filteredAlerts.map((alert) => (
                        <div
                          key={alert._id}
                          className={`p-3 rounded-xl border text-xs transition ${
                            alert.severity === 'Critical'
                              ? 'bg-rose-950/20 border-rose-900/40 text-rose-200'
                              : 'bg-amber-950/20 border-amber-900/40 text-amber-200'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                                alert.severity === 'Critical'
                                  ? 'bg-rose-500/30 text-rose-300 border border-rose-500/40'
                                  : 'bg-amber-500/30 text-amber-300 border border-amber-500/40'
                              }`}
                            >
                              {alert.type} • {alert.severity}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {new Date(alert.timestamp).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                              })}
                            </span>
                          </div>
                          <p className="font-medium text-slate-200 mt-1 leading-snug">{alert.message}</p>
                          {alert.recommendation && (
                            <p className="text-[11px] text-slate-400 mt-1.5 italic bg-slate-900/60 p-1.5 rounded border border-slate-800">
                              💡 Action: {alert.recommendation}
                            </p>
                          )}
                          <div className="mt-2.5 flex items-center justify-between pt-1 border-t border-slate-800/60">
                            <span className="text-[10px] text-slate-400">
                              Vehicle: {alert.vehicleId?.vehicleId || 'VH-UNK'}
                            </span>
                            <button
                              onClick={() => resolveAlert(alert._id)}
                              className="text-[11px] text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3 h-3" /> Mark Resolved
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Manual Refresh button */}
            <button
              onClick={fetchData}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition"
              title="Refresh Telematics Snapshot"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Ticker Bar */}
      <div className="bg-slate-900/60 border-t border-slate-800/80 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs overflow-x-auto gap-4">
          <div className="flex items-center space-x-5 text-slate-300 whitespace-nowrap">
            <span className="flex items-center gap-1.5">
              <span className="text-slate-400">Total Fleet:</span>
              <strong className="text-white font-bold">{vehicles.length} Units</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-slate-400">In Transit:</span>
              <strong className="text-emerald-400 font-bold">
                {vehicles.filter((v) => v.status === 'In Transit').length} Active
              </strong>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-slate-400">Fleet Safety Score:</span>
              <strong className="text-cyan-400 font-bold">
                {overviewKPIs?.averageSafetyScore || 88}/100
              </strong>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-slate-400">Fuel Waste Cut:</span>
              <strong className="text-emerald-400 font-bold flex items-center gap-0.5">
                <TrendingDown className="w-3 h-3" /> {overviewKPIs?.fuelSavingsPercent || 16.4}%
              </strong>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-slate-400">Breakdowns Prevented:</span>
              <strong className="text-cyan-300 font-bold">
                ${overviewKPIs?.totalPreventedBreakdownSavings?.toLocaleString() || '14,850'} ROI
              </strong>
            </span>
          </div>

          <div className="hidden sm:flex items-center text-[11px] text-slate-400 whitespace-nowrap">
            Updated: {lastUpdated.toLocaleTimeString()}
          </div>
        </div>
      </div>
    </header>
  );
};
