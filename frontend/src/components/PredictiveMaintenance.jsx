import React, { useState } from 'react';
import { useFleet } from '../context/FleetContext';
import {
  Wrench,
  AlertOctagon,
  Flame,
  BatteryCharging,
  Droplets,
  Disc,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  TrendingDown,
  DollarSign,
  ShieldAlert,
  Zap,
} from 'lucide-react';

export const PredictiveMaintenance = () => {
  const { vehicles, predictiveForecast, injectFault } = useFleet();
  const [selectedVehicleId, setSelectedVehicleId] = useState('VH-104');
  const [serviceBookedToast, setServiceBookedToast] = useState(false);

  const forecast = predictiveForecast || {
    totalPredictedRiskCount: 3,
    potentialBreakdownSavings: 14850,
    costBreakdown: {
      predictiveCost: 3500,
      breakdownCost: 800,
      scheduledCost: 3600,
    },
    forecastItems: [],
  };

  const selectedVehicle =
    vehicles.find((v) => v.vehicleId === selectedVehicleId) || vehicles[0];

  const handleBookService = (vCode) => {
    setServiceBookedToast(`Work Order generated for #${vCode}. Priority dispatch sent to FleetCare Bay.`);
    setTimeout(() => setServiceBookedToast(false), 4500);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification for Work Order booking */}
      {serviceBookedToast && (
        <div className="p-4 rounded-xl bg-cyan-950/80 border border-cyan-500 text-cyan-200 text-xs flex items-center justify-between shadow-2xl animate-bounce">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span>{serviceBookedToast}</span>
          </div>
          <button onClick={() => setServiceBookedToast(false)} className="text-cyan-400 hover:text-white font-bold">
            Dismiss
          </button>
        </div>
      )}

      {/* Top Value Banner: Predictive ROI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl glass-panel border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Potential Breakdown Savings</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-3xl font-black text-emerald-400 font-mono">
              ${forecast.potentialBreakdownSavings?.toLocaleString() || '14,850'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Towing & catastrophic repair costs avoided this quarter
          </p>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Breakdown Reduction Rate</span>
            <TrendingDown className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-3xl font-black text-cyan-400 font-mono">32.5%</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Exceeds the 30% operational benchmark target
          </p>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Forecasted Component Risks</span>
            <AlertOctagon className="w-4 h-4 text-rose-400" />
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-3xl font-black text-rose-400 font-mono">
              {forecast.totalPredictedRiskCount || 2}
            </span>
            <span className="text-xs text-rose-400 font-semibold">Active Warnings</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Detected via telemetry rule engine</p>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Emergency Repair Ratio</span>
            <Wrench className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-3xl font-black text-amber-400 font-mono">11%</span>
            <span className="text-xs text-emerald-400">vs 48% industry avg</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Transitioned from reactive to proactive servicing</p>
        </div>
      </div>

      {/* Main Grid: Forecast Spotlight (VH-104) & Fleet Health Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Spotlight Vehicle Health & Diagnostic Radar (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl glass-panel-glow border border-slate-700/80 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest block">
                  Telematics Health Deep Scan
                </span>
                <h3 className="text-xl font-black text-white">{selectedVehicle?.vehicleId} • {selectedVehicle?.model}</h3>
              </div>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase ${
                  selectedVehicle?.diagnostics.engineTemperature >= 105
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}
              >
                {selectedVehicle?.diagnostics.engineTemperature >= 105 ? 'CRITICAL RISK' : 'HEALTH NORMAL'}
              </span>
            </div>

            {/* Critical Case Callout if VH-104 */}
            {selectedVehicle?.diagnostics.engineTemperature >= 102 && (
              <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-900/60 text-xs space-y-2 text-rose-200">
                <div className="flex items-center space-x-2 font-bold text-rose-300">
                  <Flame className="w-4 h-4 text-rose-400 animate-bounce" />
                  <span>PREDICTIVE FAILURE FORECAST: COOLING SYSTEM</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  <strong>Sensor Alert:</strong> Coolant temperature spiked to{' '}
                  <span className="text-rose-400 font-bold">{selectedVehicle?.diagnostics.engineTemperature}°C</span> (Threshold: 105°C). 
                  Thermostat valve stuck open (DTC P0128). Total engine head gasket failure predicted within <strong>48 hours</strong> if unaddressed.
                </p>
                <button
                  onClick={() => handleBookService(selectedVehicle?.vehicleId)}
                  className="w-full mt-2 py-2 px-3 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition flex items-center justify-center gap-1.5"
                >
                  <Wrench className="w-3.5 h-3.5" /> Dispatch Emergency Proactive Service ($450 vs $3,250 Breakdown)
                </button>
              </div>
            )}

            {/* Diagnostic Trouble Code Scanner */}
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
              <span className="text-slate-400 text-[10px] block mb-1">OBD-II DIAGNOSTIC TROUBLE CODES (DTC)</span>
              {selectedVehicle?.diagnostics.dtcCodes?.length > 0 ? (
                <div className="space-y-1.5 mt-2">
                  {selectedVehicle.diagnostics.dtcCodes.map((code) => (
                    <div
                      key={code}
                      className="flex items-center justify-between p-2 rounded bg-rose-950/30 border border-rose-900/40"
                    >
                      <span className="font-mono font-bold text-rose-400">{code}</span>
                      <span className="text-[11px] text-slate-300">
                        {code === 'P0128'
                          ? 'Thermostat valve regulation failure'
                          : code === 'P0300'
                          ? 'Random Cylinder Misfire'
                          : code === 'P0420'
                          ? 'Catalytic efficiency degraded'
                          : 'General Powertrain Fault'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-emerald-400 pt-1 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>No active DTC trouble codes logged in ECM</span>
                </div>
              )}
            </div>

            {/* Live Sensor Gauges */}
            <div className="space-y-3 pt-1">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-rose-400" /> Engine Temperature
                  </span>
                  <strong
                    className={`font-mono ${
                      selectedVehicle?.diagnostics.engineTemperature >= 105
                        ? 'text-rose-400 font-bold'
                        : 'text-white'
                    }`}
                  >
                    {selectedVehicle?.diagnostics.engineTemperature}°C / Max 105°C
                  </strong>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      selectedVehicle?.diagnostics.engineTemperature >= 105
                        ? 'bg-rose-500'
                        : selectedVehicle?.diagnostics.engineTemperature > 95
                        ? 'bg-amber-400'
                        : 'bg-emerald-400'
                    }`}
                    style={{
                      width: `${Math.min(
                        100,
                        (selectedVehicle?.diagnostics.engineTemperature / 120) * 100
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Droplets className="w-3.5 h-3.5 text-cyan-400" /> Oil Life Remaining
                  </span>
                  <strong className="text-white font-mono">
                    {selectedVehicle?.diagnostics.oilLifePercentage}%
                  </strong>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      selectedVehicle?.diagnostics.oilLifePercentage < 20
                        ? 'bg-rose-500'
                        : 'bg-cyan-400'
                    }`}
                    style={{ width: `${selectedVehicle?.diagnostics.oilLifePercentage}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400 flex items-center gap-1">
                    <BatteryCharging className="w-3.5 h-3.5 text-amber-400" /> System Voltage
                  </span>
                  <strong className="text-white font-mono">
                    {selectedVehicle?.diagnostics.batteryVoltage} V
                  </strong>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      selectedVehicle?.diagnostics.batteryVoltage < 11.8
                        ? 'bg-rose-500'
                        : 'bg-amber-400'
                    }`}
                    style={{
                      width: `${Math.min(
                        100,
                        (selectedVehicle?.diagnostics.batteryVoltage / 14) * 100
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Disc className="w-3.5 h-3.5 text-purple-400" /> Brake Pad Lining
                  </span>
                  <strong className="text-white font-mono">
                    {selectedVehicle?.diagnostics.brakePadLifePercentage}%
                  </strong>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      selectedVehicle?.diagnostics.brakePadLifePercentage < 20
                        ? 'bg-rose-500'
                        : 'bg-purple-400'
                    }`}
                    style={{ width: `${selectedVehicle?.diagnostics.brakePadLifePercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Fleet-Wide Vehicle Health Matrix (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-1">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-cyan-400" /> Fleet Health Matrix ({vehicles.length} Units)
            </h3>
            <span className="text-xs text-slate-400">Click to inspect diagnostic stream</span>
          </div>

          <div className="space-y-3">
            {vehicles.map((v) => {
              const isOverheat = v.diagnostics.engineTemperature >= 105;
              const isSelected = selectedVehicle?.vehicleId === v.vehicleId;
              const hasDtc = v.diagnostics.dtcCodes?.length > 0;

              return (
                <div
                  key={v._id}
                  onClick={() => setSelectedVehicleId(v.vehicleId)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-500 shadow-lg shadow-cyan-500/10'
                      : isOverheat
                      ? 'bg-rose-950/20 border-rose-800/40 hover:border-rose-700/60'
                      : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs font-mono ${
                          isOverheat
                            ? 'bg-rose-600 text-white animate-pulse'
                            : 'bg-slate-800 text-cyan-400 border border-slate-700'
                        }`}
                      >
                        {v.vehicleId}
                      </div>

                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-white text-sm">{v.model}</span>
                          <span className="text-xs text-slate-400">({v.plateNumber})</span>
                        </div>
                        <p className="text-xs text-slate-400">
                          Mileage: {v.mileage?.toLocaleString()} km • Status: {v.status}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider block mb-1 ${
                          isOverheat
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : hasDtc
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {isOverheat ? 'Critical Risk' : hasDtc ? 'Warning' : 'Healthy'}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        Temp: {v.diagnostics.engineTemperature}°C
                      </span>
                    </div>
                  </div>

                  {/* Micro Diagnostics Bar */}
                  <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-slate-800/80 text-[11px] text-center">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Coolant</span>
                      <strong
                        className={
                          v.diagnostics.engineTemperature >= 105 ? 'text-rose-400 font-bold' : 'text-slate-300'
                        }
                      >
                        {v.diagnostics.engineTemperature}°C
                      </strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Oil Life</span>
                      <strong
                        className={
                          v.diagnostics.oilLifePercentage < 20 ? 'text-amber-400 font-bold' : 'text-slate-300'
                        }
                      >
                        {v.diagnostics.oilLifePercentage}%
                      </strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Battery</span>
                      <strong
                        className={
                          v.diagnostics.batteryVoltage < 11.8 ? 'text-rose-400 font-bold' : 'text-slate-300'
                        }
                      >
                        {v.diagnostics.batteryVoltage}V
                      </strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">DTC Codes</span>
                      <strong
                        className={
                          v.diagnostics.dtcCodes?.length > 0 ? 'text-amber-400 font-bold' : 'text-emerald-400'
                        }
                      >
                        {v.diagnostics.dtcCodes?.length > 0
                          ? v.diagnostics.dtcCodes.join(', ')
                          : 'Clear'}
                      </strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
