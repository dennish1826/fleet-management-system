import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB, disconnectDB } from '../config/db.js';
import User from '../models/User.js';
import Vehicle from '../models/Vehicle.js';
import Trip from '../models/Trip.js';
import MaintenanceLog from '../models/MaintenanceLog.js';
import Alert from '../models/Alert.js';

dotenv.config();

export const seedData = async () => {
  try {
    console.log('🌱 Starting Fleet Optimization Database Seeding...');

    // Clear existing records
    await User.deleteMany({});
    await Vehicle.deleteMany({});
    await Trip.deleteMany({});
    await MaintenanceLog.deleteMany({});
    await Alert.deleteMany({});

    console.log('🧹 Purged existing collections.');

    // 1. Create Fleet Users (1 Manager + 3 Drivers)
    const users = await User.create([
      {
        name: 'Sarah Connor',
        email: 'sarah.manager@fleetopt.io',
        role: 'Fleet Manager',
        phone: '+1 (555) 019-2834',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
        safetyScore: 98,
        status: 'Active',
      },
      {
        name: 'Marcus Vance',
        email: 'marcus.v@fleetopt.io',
        role: 'Driver',
        phone: '+1 (555) 234-8901',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        licenseNumber: 'CDL-NY-891024',
        safetyScore: 94, // Top Performer
        status: 'On Duty',
        drivingStats: {
          totalTrips: 142,
          totalDistanceKm: 28400,
          harshBrakingEvents: 2,
          rapidAccelerationEvents: 3,
          overspeedingEvents: 1,
          totalIdleHours: 12.4,
          weeklyScores: [
            { week: 'W1', score: 92 },
            { week: 'W2', score: 95 },
            { week: 'W3', score: 93 },
            { week: 'W4', score: 94 },
          ],
        },
      },
      {
        name: 'Elena Rostova',
        email: 'elena.r@fleetopt.io',
        role: 'Driver',
        phone: '+1 (555) 345-9012',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
        licenseNumber: 'CDL-NJ-441290',
        safetyScore: 86, // Moderate / Good
        status: 'On Duty',
        drivingStats: {
          totalTrips: 118,
          totalDistanceKm: 21500,
          harshBrakingEvents: 6,
          rapidAccelerationEvents: 7,
          overspeedingEvents: 4,
          totalIdleHours: 18.2,
          weeklyScores: [
            { week: 'W1', score: 84 },
            { week: 'W2', score: 87 },
            { week: 'W3', score: 85 },
            { week: 'W4', score: 86 },
          ],
        },
      },
      {
        name: 'Dave Miller',
        email: 'dave.m@fleetopt.io',
        role: 'Driver',
        phone: '+1 (555) 456-0123',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
        licenseNumber: 'CDL-PA-109238',
        safetyScore: 68, // High-Risk Driver
        status: 'On Duty',
        drivingStats: {
          totalTrips: 94,
          totalDistanceKm: 18200,
          harshBrakingEvents: 19,
          rapidAccelerationEvents: 22,
          overspeedingEvents: 14,
          totalIdleHours: 34.6,
          weeklyScores: [
            { week: 'W1', score: 74 },
            { week: 'W2', score: 71 },
            { week: 'W3', score: 65 },
            { week: 'W4', score: 68 },
          ],
        },
      },
    ]);

    const [, marcus, elena, dave] = users;
    console.log(`👤 Created ${users.length} users (1 Fleet Manager + 3 Drivers).`);

    // 2. Create 5 Vehicles
    const vehicles = await Vehicle.create([
      {
        vehicleId: 'VH-101',
        plateNumber: 'NY-492-TRK',
        model: 'Freightliner Cascadia EVO',
        make: 'Freightliner',
        type: 'Semi-Truck',
        year: 2024,
        status: 'In Transit',
        current_location: {
          latitude: 40.7128,
          longitude: -74.006,
          speed: 68,
          heading: 45,
          address: 'I-95 North, Exit 14A, Jersey City corridor',
          lastUpdated: new Date(),
        },
        geofence: {
          zoneName: 'Metro Logistics Hub',
          centerLat: 40.7128,
          centerLng: -74.006,
          radiusKm: 25,
          isInside: true,
        },
        mileage: 64200,
        fuel_level: 82,
        fuel_capacity_liters: 320,
        diagnostics: {
          engineTemperature: 90.5,
          oilLifePercentage: 81,
          batteryVoltage: 12.8,
          tirePressurePSI: [34, 34, 33, 34],
          dtcCodes: [],
          brakePadLifePercentage: 84,
          engineRpm: 1540,
          fuelEfficiencyKmPerLiter: 4.1,
        },
        assignedDriver: marcus._id,
      },
      {
        vehicleId: 'VH-102',
        plateNumber: 'NJ-811-LOG',
        model: 'Volvo VNL 860 Turbo',
        make: 'Volvo Trucks',
        type: 'Semi-Truck',
        year: 2023,
        status: 'In Transit',
        current_location: {
          latitude: 40.6782,
          longitude: -73.9442,
          speed: 74,
          heading: 120,
          address: 'Atlantic Ave Corridor, Brooklyn Gateway',
          lastUpdated: new Date(),
        },
        geofence: {
          zoneName: 'Metro Logistics Hub',
          centerLat: 40.7128,
          centerLng: -74.006,
          radiusKm: 25,
          isInside: true,
        },
        mileage: 91400,
        fuel_level: 68,
        fuel_capacity_liters: 300,
        diagnostics: {
          engineTemperature: 92.1,
          oilLifePercentage: 64,
          batteryVoltage: 12.5,
          tirePressurePSI: [33, 33, 32, 33],
          dtcCodes: [],
          brakePadLifePercentage: 72,
          engineRpm: 1610,
          fuelEfficiencyKmPerLiter: 3.9,
        },
        assignedDriver: elena._id,
      },
      {
        vehicleId: 'VH-103',
        plateNumber: 'PA-304-EXP',
        model: 'Kenworth T680 Aerodyne',
        make: 'Kenworth',
        type: 'Semi-Truck',
        year: 2024,
        status: 'Idle',
        current_location: {
          latitude: 40.7587,
          longitude: -73.9787,
          speed: 0,
          heading: 0,
          address: 'Central Manhattan Cross-Dock Terminal',
          lastUpdated: new Date(),
        },
        geofence: {
          zoneName: 'Manhattan Distribution Ring',
          centerLat: 40.7587,
          centerLng: -73.9787,
          radiusKm: 12,
          isInside: true,
        },
        mileage: 42100,
        fuel_level: 94,
        fuel_capacity_liters: 280,
        diagnostics: {
          engineTemperature: 76.0,
          oilLifePercentage: 92,
          batteryVoltage: 12.7,
          tirePressurePSI: [35, 35, 35, 35],
          dtcCodes: [],
          brakePadLifePercentage: 91,
          engineRpm: 650,
          fuelEfficiencyKmPerLiter: 4.2,
        },
        assignedDriver: null,
      },
      {
        vehicleId: 'VH-104',
        plateNumber: 'CT-920-HAU',
        model: 'Peterbilt 579 UltraLoft',
        make: 'Peterbilt',
        type: 'Cargo Hauler',
        year: 2022,
        status: 'In Transit',
        current_location: {
          latitude: 40.8116,
          longitude: -73.9465,
          speed: 64,
          heading: 32,
          address: 'Major Deegan Expressway, Bronx North',
          lastUpdated: new Date(),
        },
        geofence: {
          zoneName: 'Metro Logistics Hub',
          centerLat: 40.7128,
          centerLng: -74.006,
          radiusKm: 25,
          isInside: true,
        },
        mileage: 128500,
        fuel_level: 42,
        fuel_capacity_liters: 310,
        diagnostics: {
          engineTemperature: 106.2, // Critical predictive risk!
          oilLifePercentage: 28,
          batteryVoltage: 12.1,
          tirePressurePSI: [32, 31, 31, 32],
          dtcCodes: ['P0128'], // Thermostat / Cooling fault code
          brakePadLifePercentage: 42,
          engineRpm: 1720,
          fuelEfficiencyKmPerLiter: 3.2,
        },
        assignedDriver: dave._id,
      },
      {
        vehicleId: 'VH-105',
        plateNumber: 'NY-155-VAN',
        model: 'Mack Anthem High-Rise',
        make: 'Mack',
        type: 'Heavy Truck',
        year: 2021,
        status: 'Maintenance',
        current_location: {
          latitude: 40.7306,
          longitude: -73.9352,
          speed: 0,
          heading: 0,
          address: 'Queens FleetCare Maintenance Bay #4',
          lastUpdated: new Date(),
        },
        geofence: {
          zoneName: 'Metro Logistics Hub',
          centerLat: 40.7128,
          centerLng: -74.006,
          radiusKm: 25,
          isInside: true,
        },
        mileage: 154200,
        fuel_level: 25,
        fuel_capacity_liters: 320,
        diagnostics: {
          engineTemperature: 65.0,
          oilLifePercentage: 12, // Needs oil change
          batteryVoltage: 11.6, // Low auxiliary voltage
          tirePressurePSI: [30, 31, 30, 31],
          dtcCodes: ['P0420'],
          brakePadLifePercentage: 16, // Critical brake wear
          engineRpm: 0,
          fuelEfficiencyKmPerLiter: 3.1,
        },
        assignedDriver: null,
      },
    ]);

    console.log(`🚛 Created ${vehicles.length} vehicles.`);

    // Update drivers with assigned vehicle IDs
    marcus.assignedVehicle = vehicles[0]._id;
    await marcus.save();
    elena.assignedVehicle = vehicles[1]._id;
    await elena.save();
    dave.assignedVehicle = vehicles[3]._id;
    await dave.save();

    // 3. Create Trips (Route Optimization demo: Optimized vs Actual coordinates)
    const trip1Optimized = [
      { lat: 40.7128, lng: -74.006 },
      { lat: 40.7258, lng: -73.998 },
      { lat: 40.7412, lng: -73.989 },
      { lat: 40.7589, lng: -73.978 },
      { lat: 40.7712, lng: -73.965 },
      { lat: 40.785, lng: -73.95 },
    ];
    // Driver took slight detour
    const trip1Actual = [
      { lat: 40.7128, lng: -74.006 },
      { lat: 40.721, lng: -74.015 }, // detour
      { lat: 40.738, lng: -74.002 },
      { lat: 40.755, lng: -73.985 },
      { lat: 40.7712, lng: -73.965 },
      { lat: 40.785, lng: -73.95 },
    ];

    const trips = await Trip.create([
      {
        tripNumber: 'TRIP-2026-001',
        vehicleId: vehicles[0]._id, // VH-101
        driverId: marcus._id,
        origin: {
          name: 'Jersey City Terminal Hub',
          lat: 40.7128,
          lng: -74.006,
        },
        destination: {
          name: 'Bronx East Cross-Dock Hub',
          lat: 40.785,
          lng: -73.95,
        },
        optimized_route_coordinates: trip1Optimized,
        actual_route_coordinates: trip1Actual,
        distance_km: 19.8,
        optimized_distance_km: 17.2,
        fuel_consumed_liters: 4.8,
        optimized_fuel_liters: 4.1,
        harsh_events_count: {
          harshBraking: 0,
          rapidAcceleration: 1,
          overspeeding: 0,
          idleMinutes: 3,
        },
        driverTripScore: 95,
        status: 'In Progress',
        start_time: new Date(Date.now() - 45 * 60 * 1000),
      },
      {
        tripNumber: 'TRIP-2026-002',
        vehicleId: vehicles[1]._id, // VH-102
        driverId: elena._id,
        origin: {
          name: 'Brooklyn Gateway Logistics',
          lat: 40.6782,
          lng: -73.9442,
        },
        destination: {
          name: 'Queens Industrial Park Depot',
          lat: 40.742,
          lng: -73.921,
        },
        optimized_route_coordinates: [
          { lat: 40.6782, lng: -73.9442 },
          { lat: 40.695, lng: -73.938 },
          { lat: 40.718, lng: -73.928 },
          { lat: 40.742, lng: -73.921 },
        ],
        actual_route_coordinates: [
          { lat: 40.6782, lng: -73.9442 },
          { lat: 40.6912, lng: -73.935 },
          { lat: 40.7188, lng: -73.905 }, // slight traffic avoidance
        ],
        distance_km: 14.2,
        optimized_distance_km: 12.8,
        fuel_consumed_liters: 3.9,
        optimized_fuel_liters: 3.3,
        harsh_events_count: {
          harshBraking: 1,
          rapidAcceleration: 1,
          overspeeding: 1,
          idleMinutes: 5,
        },
        driverTripScore: 88,
        status: 'In Progress',
        start_time: new Date(Date.now() - 30 * 60 * 1000),
      },
      {
        tripNumber: 'TRIP-2026-003',
        vehicleId: vehicles[3]._id, // VH-104 (Dave Miller - high risk)
        driverId: dave._id,
        origin: {
          name: 'Manhattan Distribution Ring',
          lat: 40.7587,
          lng: -73.9787,
        },
        destination: {
          name: 'Yonkers Cargo Terminal',
          lat: 40.839,
          lng: -73.918,
        },
        optimized_route_coordinates: [
          { lat: 40.7587, lng: -73.9787 },
          { lat: 40.785, lng: -73.955 },
          { lat: 40.8116, lng: -73.9465 },
          { lat: 40.839, lng: -73.918 },
        ],
        actual_route_coordinates: [
          { lat: 40.7587, lng: -73.9787 },
          { lat: 40.772, lng: -73.968 },
          { lat: 40.8116, lng: -73.9465 },
        ],
        distance_km: 18.6,
        optimized_distance_km: 15.1,
        fuel_consumed_liters: 6.2,
        optimized_fuel_liters: 4.4,
        harsh_events_count: {
          harshBraking: 4,
          rapidAcceleration: 5,
          overspeeding: 3,
          idleMinutes: 14,
        },
        driverTripScore: 64,
        status: 'In Progress',
        start_time: new Date(Date.now() - 55 * 60 * 1000),
      },
    ]);

    console.log(`🗺️ Created ${trips.length} trips with optimized vs actual route coordinates.`);

    // 4. Create Maintenance Logs (Scheduled, Predictive, Breakdown)
    const maintenanceLogs = await MaintenanceLog.create([
      {
        vehicleId: vehicles[3]._id, // VH-104
        description: 'Predictive alert triggered: Engine temperature spike & DTC P0128 inspection',
        cost: 450,
        type: 'Predictive',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        status: 'Pending',
        component: 'Cooling System & Thermostat',
        triggerReason: 'Telemetry engine temp 106.2°C spike and DTC P0128 detected',
        estimatedDownTimeHours: 2.5,
        savingsByPredictiveAction: 2800, // prevented $3,250 blown head gasket & roadside towing
        serviceCenter: 'FleetCare North Hub',
      },
      {
        vehicleId: vehicles[4]._id, // VH-105
        description: 'Brake pads replacement and rotor machining',
        cost: 620,
        type: 'Predictive',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        status: 'In Progress',
        component: 'Brake Calipers & Friction Pads',
        triggerReason: 'Brake pad thickness dropped to 16% threshold',
        estimatedDownTimeHours: 4,
        savingsByPredictiveAction: 1950, // prevented brake rotor scoring & highway failure
        serviceCenter: 'Queens FleetCare Maintenance Bay #4',
      },
      {
        vehicleId: vehicles[0]._id, // VH-101
        description: 'Scheduled 60,000 km full synthetic lube, filter, and multi-point inspection',
        cost: 380,
        type: 'Scheduled',
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        status: 'Completed',
        component: 'Powertrain & Filters',
        triggerReason: 'Scheduled 60,000 km interval milestone',
        estimatedDownTimeHours: 2,
        savingsByPredictiveAction: 0,
        serviceCenter: 'FleetCare Central Depot',
      },
      {
        vehicleId: vehicles[1]._id, // VH-102
        description: 'Emergency roadside repair: Turbo intercooler hose rupture (Historical)',
        cost: 2150,
        type: 'Breakdown',
        date: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
        status: 'Completed',
        component: 'Turbocharger Induction',
        triggerReason: 'Sudden boost pipe detachment during highway transit',
        estimatedDownTimeHours: 16,
        savingsByPredictiveAction: 0,
        serviceCenter: 'Interstate Roadside Heavy Tow',
      },
    ]);

    console.log(`🔧 Created ${maintenanceLogs.length} maintenance logs.`);

    // 5. Create Initial Alerts
    const alerts = await Alert.create([
      {
        vehicleId: vehicles[3]._id, // VH-104
        type: 'Maintenance',
        severity: 'Critical',
        message:
          'Vehicle #VH-104 engine temperature spike detected (106.2°C). Predictive risk of cooling system failure within 48 hours. Schedule maintenance immediately.',
        recommendation:
          'Inspect thermostat valve P0128, inspect radiator coolant pressure, and verify fan clutch operation.',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        resolved_status: false,
        metadata: {
          sensor: 'CoolantTemp',
          value: 106.2,
          threshold: 105,
          dtc: 'P0128',
        },
      },
      {
        vehicleId: vehicles[3]._id, // VH-104
        type: 'Diagnostic Fault',
        severity: 'Critical',
        message:
          'Vehicle #VH-104 logged DTC P0128: Thermostat valve stuck open; coolant temp below threshold',
        recommendation: 'Replace thermostat assembly and coolant temperature sensor.',
        timestamp: new Date(Date.now() - 25 * 60 * 1000),
        resolved_status: false,
        metadata: {
          code: 'P0128',
        },
      },
      {
        vehicleId: vehicles[4]._id, // VH-105
        type: 'Maintenance',
        severity: 'Warning',
        message: 'Vehicle #VH-105 brake pad friction lining at 16%. Rotor damage risk.',
        recommendation: 'Replace front and rear disc brake friction pads.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        resolved_status: false,
        metadata: {
          sensor: 'BrakeWear',
          value: 16,
        },
      },
      {
        vehicleId: vehicles[1]._id, // VH-102
        type: 'Speeding',
        severity: 'Warning',
        message: 'Vehicle #VH-102 overspeeding at 84 km/h (Limit: 80 km/h).',
        recommendation: 'Automated in-cab speed warning sent to Elena Rostova.',
        timestamp: new Date(Date.now() - 40 * 60 * 1000),
        resolved_status: true,
        resolvedAt: new Date(Date.now() - 35 * 60 * 1000),
        metadata: {
          speed: 84,
          speedLimit: 80,
        },
      },
    ]);

    console.log(`🚨 Created ${alerts.length} initial telemetry alerts.`);
    console.log('✅ Database seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};

// If run directly via `node seed/seed.js`
if (process.argv[1]?.endsWith('seed.js')) {
  (async () => {
    try {
      await connectDB();
      await seedData();
      await disconnectDB();
      process.exit(0);
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  })();
}
