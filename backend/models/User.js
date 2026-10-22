import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'User name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      default: '$2a$10$FleetManagerSecureHashPlaceholder2026',
    },
    role: {
      type: String,
      enum: ['Fleet Manager', 'Driver', 'Admin'],
      default: 'Driver',
    },
    phone: {
      type: String,
      default: '+1 (555) 234-5678',
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
    licenseNumber: {
      type: String,
      default: 'DL-98234-NY',
    },
    assignedVehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      default: null,
    },
    safetyScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 88,
    },
    status: {
      type: String,
      enum: ['Active', 'On Duty', 'Off Duty', 'Suspended'],
      default: 'Active',
    },
    drivingStats: {
      totalTrips: { type: Number, default: 0 },
      totalDistanceKm: { type: Number, default: 0 },
      harshBrakingEvents: { type: Number, default: 0 },
      rapidAccelerationEvents: { type: Number, default: 0 },
      overspeedingEvents: { type: Number, default: 0 },
      totalIdleHours: { type: Number, default: 0 },
      weeklyScores: [
        {
          week: { type: String },
          score: { type: Number },
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);
export default User;
