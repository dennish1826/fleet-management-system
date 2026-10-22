import mongoose from 'mongoose';

const maintenanceLogSchema = new mongoose.Schema(
  {
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    cost: {
      type: Number,
      required: true,
      min: 0,
    },
    type: {
      type: String,
      enum: ['Scheduled', 'Predictive', 'Breakdown'],
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed'],
      default: 'Completed',
    },
    component: {
      type: String,
      default: 'Engine & Powertrain',
    },
    triggerReason: {
      type: String,
      default: 'Routine periodic maintenance schedule',
    },
    estimatedDownTimeHours: {
      type: Number,
      default: 4,
    },
    savingsByPredictiveAction: {
      type: Number,
      default: 0,
    },
    serviceCenter: {
      type: String,
      default: 'FleetCare Metro Center',
    },
  },
  {
    timestamps: true,
  }
);

const MaintenanceLog = mongoose.model('MaintenanceLog', maintenanceLogSchema);
export default MaintenanceLog;
