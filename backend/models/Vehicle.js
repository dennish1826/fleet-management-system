import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema(
  {
    vehicleId: {
      type: String,
      required: [true, 'Vehicle identifier is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    plateNumber: {
      type: String,
      required: [true, 'License plate number is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    model: {
      type: String,
      required: true,
      trim: true,
    },
    make: {
      type: String,
      default: 'Freightliner',
    },
    type: {
      type: String,
      enum: ['Semi-Truck', 'Delivery Van', 'Cargo Hauler', 'Utility Truck', 'Heavy Truck'],
      default: 'Semi-Truck',
    },
    year: {
      type: Number,
      default: 2023,
    },
    status: {
      type: String,
      enum: ['In Transit', 'Idle', 'Maintenance'],
      default: 'Idle',
    },
    current_location: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
      speed: { type: Number, default: 0 }, // km/h
      heading: { type: Number, default: 0 }, // degrees 0-360
      address: { type: String, default: 'Logistics Central Depot' },
      lastUpdated: { type: Date, default: Date.now },
    },
    geofence: {
      zoneName: { type: String, default: 'Metro Logistics Hub' },
      centerLat: { type: Number, default: 40.7128 },
      centerLng: { type: Number, default: -74.006 },
      radiusKm: { type: Number, default: 15 },
      isInside: { type: Boolean, default: true },
    },
    mileage: {
      type: Number,
      required: true,
      default: 50000, // km
    },
    fuel_level: {
      type: Number,
      min: 0,
      max: 100,
      default: 80, // %
    },
    fuel_capacity_liters: {
      type: Number,
      default: 300,
    },
    diagnostics: {
      engineTemperature: { type: Number, default: 90 }, // °C (normal ~88-95°C)
      oilLifePercentage: { type: Number, default: 78 }, // %
      batteryVoltage: { type: Number, default: 12.6 }, // Volts
      tirePressurePSI: {
        type: [Number],
        default: [34, 34, 34, 34],
      },
      dtcCodes: {
        type: [String],
        default: [], // Diagnostic Trouble Codes
      },
      brakePadLifePercentage: { type: Number, default: 85 }, // %
      engineRpm: { type: Number, default: 1400 },
      fuelEfficiencyKmPerLiter: { type: Number, default: 3.8 },
    },
    assignedDriver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Vehicle = mongoose.model('Vehicle', vehicleSchema);
export default Vehicle;
