import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  DollarSign,
  Fuel,
  Clock,
  Wrench,
  Percent,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';

export const CostAnalytics = () => {
  const [fuelTrends, setFuelTrends] = useState([]);
  const [maintenanceCosts, setMaintenanceCosts] = useState([]);
  const [utilizationData, setUtilizationData] = useState([]);

  useEffect(() => {
    fetch('/api/analytics/fuel-consumption')
      .then((r) => r.json())
      .then((d) => d.success && setFuelTrends(d.data));

    fetch('/api/analytics/maintenance-costs')
      .then((r) => r.json())
      .then((d) => d.success && setMaintenanceCosts(d.data));

    fetch('/api/analytics/fleet-utilization')
      .then((r) => r.json())
      .then((d) => d.success && setUtilizationData(d.data));
  }, []);

  return (
    <div className="space-y-6">
      {/* KPI Cards Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl glass-panel border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Net Fuel Cost Saved</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-emerald-400 font-mono">$8,420</span>
            <span className="text-xs text-emerald-400 font-semibold">+16.4% Efficiency</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Route optimization & idling elimination</p>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Catastrophic Breakdown Drop</span>
            <Wrench className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-cyan-400 font-mono">32.5%</span>
            <span className="text-xs text-cyan-300 font-semibold">Exceeds Target</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Roadside tow & engine overhaul reductions</p>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Fleet Utilization Rate</span>
            <Clock className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-purple-400 font-mono">72.4%</span>
            <span className="text-xs text-purple-300 font-semibold">Active Hours</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Active transit vs unproductive idle</p>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Predictive Maintenance ROI</span>
            <Percent className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-amber-400 font-mono">3.4x</span>
            <span className="text-xs text-amber-300 font-semibold">Net Payback</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Every $1 spent saves $3.40 in repairs</p>
        </div>
      </div>

      {/* Fuel Consumption Optimization Chart */}
      <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Fuel className="w-4 h-4 text-emerald-400" /> Fuel Consumption Trends: Actual vs Optimized Baseline
            </h3>
            <p className="text-xs text-slate-400">
              Demonstrates 10-20% fuel reduction achieved via AI route adherence and reduced idling.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-800/40">
            Average Daily Fuel Saved: ~118 Liters
          </span>
        </div>

        <div className="h-72 w-full pt-3">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={fuelTrends}>
              <defs>
                <linearGradient id="actualFuelGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="optFuelGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '0.75rem',
                  color: '#f8fafc',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Area
                type="monotone"
                dataKey="actualFuelLiters"
                stroke="#f59e0b"
                fillOpacity={1}
                fill="url(#actualFuelGrad)"
                name="Actual Fuel (L)"
              />
              <Area
                type="monotone"
                dataKey="optimizedFuelLiters"
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#optFuelGrad)"
                name="Optimized Route Baseline (L)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid: Maintenance Cost Trends & Fleet Utilization */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Maintenance Cost Over Time (6 Cols) */}
        <div className="lg:col-span-6 p-5 rounded-2xl glass-panel border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Wrench className="w-4 h-4 text-cyan-400" /> Maintenance Costs: Breakdown vs Predictive
          </h3>
          <p className="text-xs text-slate-400">
            Emergency breakdown repair costs collapsing as proactive servicing scales up.
          </p>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={maintenanceCosts}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#f8fafc',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="breakdownCost" fill="#f43f5e" name="Breakdown Repairs ($)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="predictiveCost" fill="#06b6d4" name="Predictive Service ($)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="scheduledCost" fill="#64748b" name="Scheduled Lube/Filter ($)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Column: Fleet Utilization Rates (6 Cols) */}
        <div className="lg:col-span-6 p-5 rounded-2xl glass-panel border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-400" /> Fleet Asset Utilization (Active vs Idle)
          </h3>
          <p className="text-xs text-slate-400">
            Daily active driving hours vs unproductive idling across the fleet.
          </p>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={utilizationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#f8fafc',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="activeHours" fill="#10b981" name="Active Transit (h)" stackId="a" radius={[0, 0, 0, 0]} />
                <Bar dataKey="idleHours" fill="#f59e0b" name="Idle Engine (h)" stackId="a" radius={[0, 0, 0, 0]} />
                <Bar dataKey="maintenanceHours" fill="#f43f5e" name="Maintenance Bay (h)" stackId="a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
