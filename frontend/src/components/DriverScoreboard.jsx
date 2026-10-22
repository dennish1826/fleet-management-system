import React from 'react';
import { useFleet } from '../context/FleetContext';
import {
  Award,
  AlertTriangle,
  ShieldCheck,
  TrendingUp,
  Zap,
  Footprints,
  Clock,
  Gauge,
  UserCheck,
  ArrowUpRight,
  Flame,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';

export const DriverScoreboard = () => {
  const { driverData } = useFleet();

  const drivers = driverData?.rankedList || [];
  const topPerformers = driverData?.topPerformers || [];
  const highRiskDrivers = driverData?.highRisk || [];
  const averageFleetScore = driverData?.averageFleetSafetyScore || 85;

  // Chart data preparing driver scores
  const scoreComparisonData = drivers.map((d) => ({
    name: d.name.split(' ')[0],
    Score: d.safetyScore,
    HarshBraking: d.drivingStats?.harshBrakingEvents || 0,
    RapidAcceleration: d.drivingStats?.rapidAccelerationEvents || 0,
    Overspeeding: d.drivingStats?.overspeedingEvents || 0,
  }));

  return (
    <div className="space-y-6">
      {/* Overview Metric Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl glass-panel border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Fleet Safety Index</span>
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-white font-mono">{averageFleetScore}</span>
            <span className="text-xs text-emerald-400 font-semibold">+3.2 pts vs last month</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Weighted across all operational telemetry</p>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Top Performing Drivers</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-emerald-400 font-mono">
              {topPerformers.length}
            </span>
            <span className="text-xs text-slate-400">Score &ge; 85</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Eligible for monthly fuel-efficiency bonus</p>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>High-Risk Drivers</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-rose-400 font-mono">
              {highRiskDrivers.length}
            </span>
            <span className="text-xs text-rose-400 font-semibold">Requires Coaching</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Excessive harsh braking & speed anomalies</p>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Aggressive Throttle Waste</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-amber-400 font-mono">18.4%</span>
            <span className="text-xs text-slate-400">Fuel Delta</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Excess fuel burned due to rapid accelerations</p>
        </div>
      </div>

      {/* Driver Scoreboard Leaderboard & Behavioral Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Driver Leaderboard Cards (7 Cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between pb-1">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-cyan-400" /> Driver Safety & Efficiency Matrix
            </h2>
            <span className="text-xs text-slate-400">Weekly Score Range: 0-100</span>
          </div>

          <div className="space-y-3">
            {drivers.map((driver, index) => {
              const isTop = driver.safetyScore >= 85;
              const isHighRisk = driver.safetyScore < 70;
              const stats = driver.drivingStats || {};

              return (
                <div
                  key={driver._id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isTop
                      ? 'bg-emerald-950/20 border-emerald-800/40 hover:border-emerald-700/60'
                      : isHighRisk
                      ? 'bg-rose-950/20 border-rose-800/40 hover:border-rose-700/60'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <img
                          src={driver.avatar}
                          alt={driver.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-700"
                        />
                        <span
                          className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${
                            index === 0
                              ? 'bg-amber-500'
                              : isTop
                              ? 'bg-emerald-500'
                              : isHighRisk
                              ? 'bg-rose-500'
                              : 'bg-slate-600'
                          }`}
                        >
                          #{index + 1}
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-bold text-white text-sm">{driver.name}</h3>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                              isTop
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : isHighRisk
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {isTop ? 'Top Performer' : isHighRisk ? 'High Risk' : 'Consistent'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">
                          {driver.licenseNumber} • Assigned to {driver.assignedVehicle?.vehicleId || 'VH-101'}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block uppercase tracking-wider">
                        Safety Score
                      </span>
                      <span
                        className={`text-2xl font-black font-mono ${
                          isTop
                            ? 'text-emerald-400'
                            : isHighRisk
                            ? 'text-rose-400'
                            : 'text-cyan-400'
                        }`}
                      >
                        {driver.safetyScore}
                        <span className="text-xs text-slate-500">/100</span>
                      </span>
                    </div>
                  </div>

                  {/* Telematics Harsh Event Badges */}
                  <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-slate-800/80 text-center">
                    <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
                      <span className="text-[10px] text-slate-400 block">Harsh Braking</span>
                      <strong
                        className={`text-xs font-mono font-bold ${
                          stats.harshBrakingEvents > 10 ? 'text-rose-400' : 'text-slate-200'
                        }`}
                      >
                        {stats.harshBrakingEvents || 0}
                      </strong>
                    </div>

                    <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
                      <span className="text-[10px] text-slate-400 block">Rapid Accel</span>
                      <strong
                        className={`text-xs font-mono font-bold ${
                          stats.rapidAccelerationEvents > 10 ? 'text-amber-400' : 'text-slate-200'
                        }`}
                      >
                        {stats.rapidAccelerationEvents || 0}
                      </strong>
                    </div>

                    <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
                      <span className="text-[10px] text-slate-400 block">Overspeeding</span>
                      <strong
                        className={`text-xs font-mono font-bold ${
                          stats.overspeedingEvents > 5 ? 'text-rose-400' : 'text-slate-200'
                        }`}
                      >
                        {stats.overspeedingEvents || 0}
                      </strong>
                    </div>

                    <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
                      <span className="text-[10px] text-slate-400 block">Idle Hours</span>
                      <strong className="text-xs font-mono font-bold text-slate-200">
                        {stats.totalIdleHours || 0}h
                      </strong>
                    </div>
                  </div>

                  {/* Coaching Recommendation for High Risk */}
                  {isHighRisk && (
                    <div className="mt-3 p-2.5 rounded-xl bg-rose-950/40 border border-rose-900/50 text-rose-200 text-xs flex items-center justify-between">
                      <span>
                        ⚠️ <strong>Action Required:</strong> Recommend telematics eco-driving training to reduce aggressive throttle inputs.
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Comparative Behavioral Charts (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-2xl glass-panel border border-slate-800 space-y-3">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" /> Driver Safety Score Comparison
            </h3>
            <p className="text-xs text-slate-400">
              Evaluates safe deceleration, smooth throttle curve, and speed limit adherence.
            </p>

            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scoreComparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                  <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '0.75rem',
                      color: '#f8fafc',
                    }}
                  />
                  <Bar dataKey="Score" fill="#06b6d4" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Harsh Event Breakdown Chart */}
          <div className="p-4 rounded-2xl glass-panel border border-slate-800 space-y-3">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" /> Telematics Infractions
            </h3>
            <p className="text-xs text-slate-400">
              Distribution of harsh driving telemetry events across the roster.
            </p>

            <div className="h-60 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scoreComparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
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
                  <Bar dataKey="HarshBraking" fill="#f43f5e" name="Harsh Braking" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="RapidAcceleration" fill="#f59e0b" name="Rapid Accel" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Overspeeding" fill="#8b5cf6" name="Overspeeding" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
