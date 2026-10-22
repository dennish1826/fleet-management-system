import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema(
  {
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: true,
    },
    type: {
      type: String,
      enum: ['Speeding', 'Maintenance', 'Geofence', 'Harsh Driving', 'Diagnostic Fault'],
      required: true,
    },
    severity: {
      type: String,
      enum: ['Critical', 'Warning', 'Informational'],
      default: 'Warning',
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    recommendation: {
      type: String,
      default: '',
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    resolved_status: {
      type: Boolean,
      default: false,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const Alert = mongoose.model('Alert', alertSchema);
export default Alert;
