import Vehicle from '../models/Vehicle.js';
import Alert from '../models/Alert.js';
import User from '../models/User.js';
import Trip from '../models/Trip.js';
import { checkGeofenceStatus } from './geofenceService.js';
import { evaluatePredictiveHealth } from './predictiveMaintenanceEngine.js';

let simulationInterval = null;
const alertDebounceMap = new Map(); // Prevent duplicate alerts within a 2-minute window

// Predefined route waypoints for realistic truck transit simulation
const WAYPOINTS_MAP = {
  'VH-101': [
    { lat: 40.7128, lng: -74.006 },
    { lat: 40.7258, lng: -73.998 },
    { lat: 40.7412, lng: -73.989 },
    { lat: 40.7589, lng: -73.978 },
    { lat: 40.7712, lng: -73.965 },
    { lat: 40.785, lng: -73.95 },
  ],
  'VH-102': [
    { lat: 40.6782, lng: -73.9442 },
    { lat: 40.6912, lng: -73.935 },
    { lat: 40.7045, lng: -73.921 },
    { lat: 40.7188, lng: -73.905 },
  ],
  'VH-103': [
    { lat: 40.7587, lng: -73.9787 },
    { lat: 40.768, lng: -73.965 },
    { lat: 40.782, lng: -73.951 },
  ],
  'VH-104': [
    { lat: 40.8116, lng: -73.9465 },
    { lat: 40.825, lng: -73.932 },
    { lat: 40.839, lng: -73.918 },
  ],
  'VH-105': [
    { lat: 40.7306, lng: -73.9352 },
    { lat: 40.742, lng: -73.921 },
  ],
};

const routeIndices = {
  'VH-101': 0,
  'VH-102': 0,
  'VH-103': 0,
  'VH-104': 0,
  'VH-105': 0,
};

export const startTelematicsSimulation = (io) => {
  if (simulationInterval) {
    clearInterval(simulationInterval);
  }

  const intervalTime = parseInt(process.env.SIMULATION_INTERVAL_MS || '3000', 10);
  console.log(`📡 Real-Time Telematics Simulator started (broadcasting every ${intervalTime}ms)...`);

  simulationInterval = setInterval(async () => {
    try {
      const vehicles = await Vehicle.find().populate('assignedDriver');
      if (!vehicles || vehicles.length === 0) return;

      const updatedVehicles = [];

      for (const vehicle of vehicles) {
        let changed = false;

        // Only move vehicles that are In Transit
        if (vehicle.status === 'In Transit') {
          changed = true;
          const vId = vehicle.vehicleId;
          const waypoints = WAYPOINTS_MAP[vId] || WAYPOINTS_MAP['VH-101'];
          let currentIndex = routeIndices[vId] ?? 0;

          // Advance along route with slight GPS jitter
          currentIndex = (currentIndex + 1) % waypoints.length;
          routeIndices[vId] = currentIndex;
          const targetWaypoint = waypoints[currentIndex];

          // Small random drift for smooth real-time animation
          const jitterLat = (Math.random() - 0.5) * 0.0015;
          const jitterLng = (Math.random() - 0.5) * 0.0015;
          vehicle.current_location.latitude = parseFloat((targetWaypoint.lat + jitterLat).toFixed(6));
          vehicle.current_location.longitude = parseFloat((targetWaypoint.lng + jitterLng).toFixed(6));
          vehicle.current_location.lastUpdated = new Date();

          // Speed fluctuation (45 - 88 km/h)
          const targetSpeed = Math.floor(52 + Math.random() * 32);
          vehicle.current_location.speed = targetSpeed;
          vehicle.diagnostics.engineRpm = Math.floor(1200 + targetSpeed * 12);

          // Mileage increment
          const distanceIncrementKm = (targetSpeed * (intervalTime / 1000)) / 3600;
          vehicle.mileage = parseFloat((vehicle.mileage + distanceIncrementKm).toFixed(2));

          // Fuel consumption
          if (vehicle.fuel_level > 2) {
            vehicle.fuel_level = parseFloat((vehicle.fuel_level - 0.03).toFixed(2));
          }

          // Engine temperature dynamics
          // Special case: VH-104 has simulated cooling issue
          if (vId === 'VH-104') {
            vehicle.diagnostics.engineTemperature = Math.min(
              110,
              parseFloat((vehicle.diagnostics.engineTemperature + 0.4).toFixed(1))
            );
          } else {
            // Normal fluctuation 88 - 93 °C
            vehicle.diagnostics.engineTemperature = parseFloat(
              (90 + (Math.random() * 4 - 2)).toFixed(1)
            );
          }

          // Check Geofence
          const geofenceResult = checkGeofenceStatus(vehicle);
          if (geofenceResult.breached) {
            vehicle.geofence.isInside = false;
            await triggerAlert(
              io,
              vehicle,
              'Geofence',
              'Critical',
              `Vehicle #${vehicle.vehicleId} breached boundary of ${geofenceResult.zoneName} (${geofenceResult.distanceKm} km from center, limit ${geofenceResult.radiusKm} km).`,
              'Contact driver immediately to verify unauthorized route deviation.',
              { geofence: geofenceResult }
            );
          }

          // Check Speeding Event
          if (vehicle.current_location.speed > 82) {
            await triggerAlert(
              io,
              vehicle,
              'Speeding',
              'Warning',
              `Vehicle #${vehicle.vehicleId} overspeeding at ${vehicle.current_location.speed} km/h (Limit: 80 km/h).`,
              'Automated in-cab speed warning sent to driver.',
              { speed: vehicle.current_location.speed, speedLimit: 80 }
            );

            // Record harsh event in active trip & driver stats
            await recordDriverHarshEvent(vehicle.assignedDriver, 'overspeeding');
          }

          // Random Harsh Driving event simulation (4% probability)
          const rand = Math.random();
          if (rand < 0.02) {
            await recordDriverHarshEvent(vehicle.assignedDriver, 'harshBraking');
            await triggerAlert(
              io,
              vehicle,
              'Harsh Driving',
              'Warning',
              `Harsh braking event detected on Vehicle #${vehicle.vehicleId} (-0.55G deceleration).`,
              'Review driver behavior metrics; fuel waste spike detected.',
              { eventType: 'Harsh Braking', gForce: -0.55 }
            );
          } else if (rand > 0.98) {
            await recordDriverHarshEvent(vehicle.assignedDriver, 'rapidAcceleration');
            await triggerAlert(
              io,
              vehicle,
              'Harsh Driving',
              'Warning',
              `Rapid throttle acceleration event detected on Vehicle #${vehicle.vehicleId}.`,
              'Aggressive acceleration increases fuel consumption by 15-20%.',
              { eventType: 'Rapid Acceleration' }
            );
          }

          // Append to actual route coordinates of active trip
          await appendActiveTripCoordinate(vehicle);
        } else if (vehicle.status === 'Idle') {
          // Idle vehicle simulation
          vehicle.current_location.speed = 0;
          vehicle.diagnostics.engineRpm = 650;
          if (vehicle.fuel_level > 2) {
            vehicle.fuel_level = parseFloat((vehicle.fuel_level - 0.005).toFixed(2));
          }
          changed = true;
        }

        // Run Predictive Maintenance Rules
        const predictiveAlerts = evaluatePredictiveHealth(vehicle);
        for (const pred of predictiveAlerts) {
          await triggerAlert(
            io,
            vehicle,
            pred.type,
            pred.severity,
            pred.message,
            pred.recommendation,
            pred.metadata
          );
        }

        if (changed) {
          await vehicle.save();
        }

        updatedVehicles.push(vehicle);
      }

      // Broadcast telematics update to all connected dashboard clients
      io.emit('telematics_update', {
        timestamp: new Date().toISOString(),
        vehicles: updatedVehicles,
      });
    } catch (err) {
      console.error('Error in telematics simulation tick:', err.message);
    }
  }, intervalTime);
};

export const stopTelematicsSimulation = () => {
  if (simulationInterval) {
    clearInterval(simulationInterval);
    simulationInterval = null;
    console.log('🛑 Telematics simulation stopped.');
  }
};

// Helper: Trigger and debounce alerts to prevent alert storms
async function triggerAlert(io, vehicle, type, severity, message, recommendation = '', metadata = {}) {
  const debounceKey = `${vehicle._id}-${type}-${severity}`;
  const lastAlertTime = alertDebounceMap.get(debounceKey);
  const now = Date.now();

  // 90-second debounce per vehicle and alert category
  if (lastAlertTime && now - lastAlertTime < 90 * 1000) {
    return;
  }

  alertDebounceMap.set(debounceKey, now);

  try {
    const alertDoc = await Alert.create({
      vehicleId: vehicle._id,
      type,
      severity,
      message,
      recommendation,
      metadata,
      timestamp: new Date(),
    });

    const populatedAlert = await Alert.findById(alertDoc._id).populate('vehicleId');

    // Broadcast live alert to React frontend via WebSockets
    io.emit('new_alert', populatedAlert);
    console.log(`🚨 [Live Alert] [${severity}] ${message}`);
  } catch (e) {
    console.error('Failed to persist simulated alert:', e.message);
  }
}

// Helper: Record harsh event and recalculate driver score
async function recordDriverHarshEvent(driver, eventType) {
  if (!driver || !driver._id) return;
  try {
    const userDoc = await User.findById(driver._id);
    if (!userDoc) return;

    if (!userDoc.drivingStats) {
      userDoc.drivingStats = {
        harshBrakingEvents: 0,
        rapidAccelerationEvents: 0,
        overspeedingEvents: 0,
        totalIdleHours: 0,
      };
    }

    if (eventType === 'harshBraking') userDoc.drivingStats.harshBrakingEvents += 1;
    if (eventType === 'rapidAcceleration') userDoc.drivingStats.rapidAccelerationEvents += 1;
    if (eventType === 'overspeeding') userDoc.drivingStats.overspeedingEvents += 1;

    // Recalculate 0-100 score dynamically
    const deductions =
      userDoc.drivingStats.harshBrakingEvents * 2.5 +
      userDoc.drivingStats.rapidAccelerationEvents * 1.5 +
      userDoc.drivingStats.overspeedingEvents * 3;

    userDoc.safetyScore = Math.max(45, Math.min(100, Math.round(98 - deductions)));
    await userDoc.save();
  } catch (err) {
    console.error('Error updating driver stats:', err.message);
  }
}

// Helper: Append point to active trip
async function appendActiveTripCoordinate(vehicle) {
  try {
    const activeTrip = await Trip.findOne({
      vehicleId: vehicle._id,
      status: 'In Progress',
    });

    if (activeTrip) {
      activeTrip.actual_route_coordinates.push({
        lat: vehicle.current_location.latitude,
        lng: vehicle.current_location.longitude,
        speed: vehicle.current_location.speed,
        timestamp: new Date(),
      });

      // Keep array reasonable in size for memory
      if (activeTrip.actual_route_coordinates.length > 250) {
        activeTrip.actual_route_coordinates.shift();
      }

      await activeTrip.save();
    }
  } catch (e) {
    // Non-critical, ignore
  }
}
