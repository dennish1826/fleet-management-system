import mongoose from 'mongoose';

const coordinateSchema = new mongoose.Schema(
  {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
    speed: { type: Number, default: 0 },
  },
  { _id: false }
);

const tripSchema = new mongoose.Schema(
  {
    tripNumber: {
      type: String,
      unique: true,
      required: true,
    },
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: true,
    },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    origin: {
      name: { type: String, default: 'Warehouse North Terminal' },
      lat: { type: Number, default: 40.7128 },
      lng: { type: Number, default: -74.006 },
    },
    destination: {
      name: { type: String, default: 'East Coast Distribution Center' },
      lat: { type: Number, default: 40.7831 },
      lng: { type: Number, default: -73.9712 },
    },
    optimized_route_coordinates: [coordinateSchema],
    actual_route_coordinates: [coordinateSchema],
    distance_km: {
      type: Number,
      default: 0,
    },
    optimized_distance_km: {
      type: Number,
      default: 0,
    },
    fuel_consumed_liters: {
      type: Number,
      default: 0,
    },
    optimized_fuel_liters: {
      type: Number,
      default: 0,
    },
    harsh_events_count: {
      harshBraking: { type: Number, default: 0 },
      rapidAcceleration: { type: Number, default: 0 },
      overspeeding: { type: Number, default: 0 },
      idleMinutes: { type: Number, default: 0 },
    },
    driverTripScore: {
      type: Number,
      default: 90,
      min: 0,
      max: 100,
    },
    status: {
      type: String,
      enum: ['Scheduled', 'In Progress', 'Completed', 'Cancelled'],
      default: 'In Progress',
    },
    start_time: {
      type: Date,
      default: Date.now,
    },
    end_time: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Trip = mongoose.model('Trip', tripSchema);
export default Trip;
