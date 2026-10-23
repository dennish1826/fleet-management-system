import React, { useState, useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Circle,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import { useFleet } from '../context/FleetContext';
import {
  Navigation,
  Fuel,
  Gauge,
  Thermometer,
  ShieldCheck,
  AlertCircle,
  Radio,
  Layers,
  Eye,
  CheckCircle2,
  Clock,
  MapPin,
  TrendingUp,
  User,
} from 'lucide-react';

// Dynamic vehicle marker using modern HTML/SVG divIcon
const createCustomMarker = (vehicle, isSelected) => {
  const isTransit = vehicle.status === 'In Transit';
  const isIdle = vehicle.status === 'Idle';
  const isMaintenance = vehicle.status === 'Maintenance';

  const color = isTransit ? '#10b981' : isIdle ? '#f59e0b' : '#f43f5e';
  const borderRing = isSelected ? 'border-2 border-white scale-110 shadow-lg shadow-cyan-500/50' : 'border border-slate-700';

  const html = `
    <div class="relative flex flex-col items-center group cursor-pointer transition-transform duration-300">
      <div class="w-8 h-8 rounded-full flex items-center justify-center text-white ${borderRing}" style="background-color: ${color};">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="transform: rotate(${vehicle.current_location.heading || 0}deg);">
          <polygon points="12 2 19 21 12 17 5 21 12 2"></polygon>
        </svg>
      </div>
      <div class="mt-1 px-1.5 py-0.5 rounded bg-slate-900/90 border border-slate-700 text-[10px] font-bold text-white shadow whitespace-nowrap">
        ${vehicle.vehicleId}
      </div>
      ${isTransit
      ? `<span class="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>`
      : ''
    }
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-vehicle-marker',
    iconSize: [36, 48],
    iconAnchor: [18, 24],
  });
};

// Component to smoothly pan the map to selected vehicle
const MapPanController = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.flyTo(center, 13, { duration: 1.2 });
    }
  }, [center, map]);
  return null;
};

export const MapDashboard = () => {
  const { vehicles, activeTrips, selectedVehicle, setSelectedVehicle } = useFleet();
  const [showGeofences, setShowGeofences] = useState(true);
  const [showOptimizedRoute, setShowOptimizedRoute] = useState(true);
  const [showActualRoute, setShowActualRoute] = useState(true);
  const [mapCenter, setMapCenter] = useState([40.7306, -73.9352]);

  // Find active trip for currently selected vehicle
  const activeTrip = activeTrips.find(
    (t) =>
      t.vehicleId?._id === selectedVehicle?._id ||
      t.vehicleId?.vehicleId === selectedVehicle?.vehicleId
  ) || activeTrips[0];

  const handleSelectVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
    setMapCenter([
      vehicle.current_location.latitude,
      vehicle.current_location.longitude,
    ]);
  };

  return (
    <div className="space-y-4">
      {/* Top Map Control Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl glass-panel text-xs">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-white text-sm">Real-Time Telematics & Route Optimization</span>
          <span className="text-slate-400">({vehicles.length} Active GPS Nodes)</span>
        </div>

        {/* Route Visualization Legend & Toggles */}
        <div className="flex items-center space-x-3">
          <label className="flex items-center space-x-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showOptimizedRoute}
              onChange={(e) => setShowOptimizedRoute(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-0"
            />
            <span className="w-3 h-1 bg-emerald-500 rounded inline-block"></span>
            <span className="text-slate-300 font-medium">Optimized Route (Baseline)</span>
          </label>

          <label className="flex items-center space-x-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showActualRoute}
              onChange={(e) => setShowActualRoute(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-amber-500 focus:ring-0"
            />
            <span className="w-3 h-1 bg-amber-500 border-dashed border-t-2 inline-block"></span>
            <span className="text-slate-300 font-medium">Actual Driver Route (Deviation)</span>
          </label>

          <label className="flex items-center space-x-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showGeofences}
              onChange={(e) => setShowGeofences(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0"
            />
            <span className="text-slate-300 font-medium">Virtual Geofence Zones</span>
          </label>
        </div>
      </div>

      {/* Main Grid: Map (Left 70%) & Vehicle Inspector (Right 30%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Unified Leaflet Map Container */}
        <div className="lg:col-span-8 h-[600px] rounded-2xl overflow-hidden glass-panel border border-slate-800 relative shadow-2xl">
          <MapContainer
            center={mapCenter}
            zoom={12}
            scrollWheelZoom={true}
            className="w-full h-full"
          >
            {/* Dark Mode Tile Provider (CartoDB Dark Matter) */}
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapPanController center={mapCenter} />

            {/* Geofence Boundary Rings */}
            {showGeofences &&
              vehicles.map((v) => {
                if (!v.geofence?.centerLat) return null;
                return (
                  <Circle
                    key={`geofence-${v._id}`}
                    center={[v.geofence.centerLat, v.geofence.centerLng]}
                    radius={(v.geofence.radiusKm || 15) * 1000}
                    pathOptions={{
                      color: v.geofence.isInside ? '#06b6d4' : '#ef4444',
                      fillColor: v.geofence.isInside ? '#06b6d4' : '#ef4444',
                      fillOpacity: 0.08,
                      weight: 1.5,
                      dashArray: '6, 8',
                    }}
                  />
                );
              })}

            {/* Optimized Route Polyline (Emerald) */}
            {showOptimizedRoute &&
              activeTrip?.optimized_route_coordinates && (
                <Polyline
                  positions={activeTrip.optimized_route_coordinates.map((c) => [
                    c.lat,
                    c.lng,
                  ])}
                  pathOptions={{
                    color: '#10b981',
                    weight: 4,
                    opacity: 0.85,
                  }}
                />
              )}

            {/* Actual Route Polyline (Amber with dash) */}
            {showActualRoute &&
              activeTrip?.actual_route_coordinates && (
                <Polyline
                  positions={activeTrip.actual_route_coordinates.map((c) => [
                    c.lat,
                    c.lng,
                  ])}
                  pathOptions={{
                    color: '#f59e0b',
                    weight: 4,
                    opacity: 0.9,
                    dashArray: '8, 8',
                  }}
                />
              )}

            {/* Vehicle Markers */}
            {vehicles.map((v) => {
              const isSelected = selectedVehicle?._id === v._id;
              return (
                <Marker
                  key={v._id}
                  position={[
                    v.current_location.latitude,
                    v.current_location.longitude,
                  ]}
                  icon={createCustomMarker(v, isSelected)}
                  eventHandlers={{
                    click: () => handleSelectVehicle(v),
                  }}
                >
                  <Popup className="telematics-popup">
                    <div className="p-1 text-slate-900 text-xs font-sans">
                      <div className="font-bold text-sm flex items-center justify-between">
                        <span>{v.vehicleId} • {v.model}</span>
                      </div>
                      <p className="text-slate-600 text-[11px] mt-0.5">{v.current_location.address}</p>
                      <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-200">
                        <div>
                          <span className="text-[10px] text-slate-500">Speed:</span>
                          <strong className="block text-emerald-600 font-bold">{v.current_location.speed} km/h</strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500">Fuel:</span>
                          <strong className="block text-cyan-600 font-bold">{v.fuel_level}%</strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500">Engine Temp:</span>
                          <strong className={`block font-bold ${v.diagnostics.engineTemperature > 100 ? 'text-rose-600' : 'text-slate-700'}`}>
                            {v.diagnostics.engineTemperature}°C
                          </strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500">Driver:</span>
                          <strong className="block text-slate-700 font-bold">{v.assignedDriver?.name || 'Unassigned'}</strong>
                        </div>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>

          {/* Map Overlay: Floating Vehicle Quick Selector Strip */}
          <div className="absolute bottom-4 left-4 right-4 z-[400] flex items-center space-x-2 overflow-x-auto p-2 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-800">
            {vehicles.map((v) => {
              const isSelected = selectedVehicle?._id === v._id;
              return (
                <button
                  key={v._id}
                  onClick={() => handleSelectVehicle(v)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all ${isSelected
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/25'
                    : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 border border-slate-800'
                    }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${v.status === 'In Transit'
                      ? 'bg-emerald-400 animate-pulse'
                      : v.status === 'Idle'
                        ? 'bg-amber-400'
                        : 'bg-rose-500'
                      }`}
                  />
                  <span>{v.vehicleId}</span>
                  <span className="text-[10px] opacity-75">{v.current_location.speed} km/h</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Vehicle Telematics & Route Optimization Inspector */}
        <div className="lg:col-span-4 space-y-4">
          {selectedVehicle ? (
            <div className="p-4 rounded-2xl glass-panel-glow space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-white text-base">
                      {selectedVehicle.vehicleId}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${selectedVehicle.status === 'In Transit'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : selectedVehicle.status === 'Idle'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}
                    >
                      {selectedVehicle.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{selectedVehicle.model} ({selectedVehicle.plateNumber})</p>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Total Mileage</span>
                  <strong className="text-white text-sm font-mono">
                    {selectedVehicle.mileage?.toLocaleString()} km
                  </strong>
                </div>
              </div>

              {/* Live Speed & RPM HUD */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                  <div className="flex items-center space-x-1.5 text-slate-400 text-xs mb-1">
                    <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Live Speed</span>
                  </div>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-2xl font-black text-white font-mono">
                      {selectedVehicle.current_location.speed}
                    </span>
                    <span className="text-xs text-slate-400">km/h</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-cyan-400 h-full transition-all duration-300"
                      style={{
                        width: `${Math.min(100, (selectedVehicle.current_location.speed / 100) * 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                  <div className="flex items-center space-x-1.5 text-slate-400 text-xs mb-1">
                    <Fuel className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Fuel Reserve</span>
                  </div>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-2xl font-black text-white font-mono">
                      {selectedVehicle.fuel_level}%
                    </span>
                    <span className="text-xs text-slate-400">capacity</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${selectedVehicle.fuel_level < 25 ? 'bg-rose-500' : 'bg-emerald-400'
                        }`}
                      style={{ width: `${selectedVehicle.fuel_level}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Telematics Health Gauges */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block mb-1">Coolant Temp</span>
                  <span
                    className={`font-mono font-bold text-sm ${selectedVehicle.diagnostics.engineTemperature >= 105
                      ? 'text-rose-400 animate-pulse'
                      : selectedVehicle.diagnostics.engineTemperature > 98
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                      }`}
                  >
                    {selectedVehicle.diagnostics.engineTemperature}°C
                  </span>
                </div>

                <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block mb-1">Oil Life</span>
                  <span
                    className={`font-mono font-bold text-sm ${selectedVehicle.diagnostics.oilLifePercentage < 20
                      ? 'text-rose-400'
                      : 'text-cyan-400'
                      }`}
                  >
                    {selectedVehicle.diagnostics.oilLifePercentage}%
                  </span>
                </div>

                <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block mb-1">Battery</span>
                  <span
                    className={`font-mono font-bold text-sm ${selectedVehicle.diagnostics.batteryVoltage < 11.8
                      ? 'text-rose-400'
                      : 'text-emerald-400'
                      }`}
                  >
                    {selectedVehicle.diagnostics.batteryVoltage}V
                  </span>
                </div>
              </div>

              {/* Route Optimization Analytics Card */}
              {activeTrip && (
                <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-800/40 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5" /> Route Efficiency Variance
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{activeTrip.tripNumber}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                    <div>
                      <span className="text-slate-400 block">Optimized Baseline:</span>
                      <strong className="text-emerald-400 font-mono">
                        {activeTrip.optimized_distance_km} km ({activeTrip.optimized_fuel_liters} L)
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Actual Route:</span>
                      <strong className="text-amber-400 font-mono">
                        {activeTrip.distance_km} km ({activeTrip.fuel_consumed_liters} L)
                      </strong>
                    </div>
                  </div>

                  {activeTrip.fuel_consumed_liters > activeTrip.optimized_fuel_liters && (
                    <div className="p-2 rounded bg-slate-900/80 border border-amber-900/40 text-amber-200 text-[11px]">
                      ⚠️ <strong>Detour Fuel Variance:</strong> +
                      {(activeTrip.fuel_consumed_liters - activeTrip.optimized_fuel_liters).toFixed(1)} L extra burn. Route recalculation suggested.
                    </div>
                  )}
                </div>
              )}

              {/* Geofence Status */}
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  <div>
                    <span className="text-slate-400 block text-[10px]">Active Geofence</span>
                    <span className="text-white font-medium">{selectedVehicle.geofence?.zoneName}</span>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${selectedVehicle.geofence?.isInside
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse'
                    }`}
                >
                  {selectedVehicle.geofence?.isInside ? 'Inside Perimeter' : 'PERIMETER BREACH'}
                </span>
              </div>

              {/* Assigned Driver Profile */}
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2.5">
                  <img
                    src={
                      selectedVehicle.assignedDriver?.avatar ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'
                    }
                    alt="Driver"
                    className="w-8 h-8 rounded-full border border-slate-700 object-cover"
                  />
                  <div>
                    <span className="text-white font-medium block">
                      {selectedVehicle.assignedDriver?.name || 'Unassigned'}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      License: {selectedVehicle.assignedDriver?.licenseNumber || 'N/A'}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Safety Score</span>
                  <strong className="text-cyan-400 font-mono font-bold text-sm">
                    {selectedVehicle.assignedDriver?.safetyScore || 85}/100
                  </strong>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 glass-panel rounded-2xl">
              <Radio className="w-10 h-10 mx-auto text-slate-600 mb-2" />
              Select a vehicle on the map to inspect live telematics
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
