import MaintenanceLog from '../models/MaintenanceLog.js';
import Vehicle from '../models/Vehicle.js';
import { evaluatePredictiveHealth } from '../services/predictiveMaintenanceEngine.js';

export const getMaintenanceLogs = async (req, res) => {
  try {
    const { type, vehicleId } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (vehicleId) filter.vehicleId = vehicleId;

    const logs = await MaintenanceLog.find(filter)
      .populate('vehicleId', 'vehicleId plateNumber model status mileage')
      .sort({ date: -1 });

    res.json({
      success: true,
      count: logs.length,
      data: logs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPredictiveForecast = async (req, res) => {
  try {
    const vehicles = await Vehicle.find().populate('assignedDriver', 'name');

    const forecastItems = [];
    let totalPredictedRiskCount = 0;
    let potentialBreakdownSavings = 0;

    for (const v of vehicles) {
      const risks = evaluatePredictiveHealth(v);
      if (risks.length > 0) {
        totalPredictedRiskCount += risks.length;
        // Estimated savings per prevented catastrophic breakdown ($1,200 - $3,500)
        potentialBreakdownSavings += risks.length * 1850;

        forecastItems.push({
          vehicleId: v._id,
          vehicleCode: v.vehicleId,
          plateNumber: v.plateNumber,
          model: v.model,
          diagnostics: v.diagnostics,
          driver: v.assignedDriver?.name || 'Unassigned',
          risks,
        });
      }
    }

    // Historical breakdown vs predictive cost comparison
    const allLogs = await MaintenanceLog.find();
    const predictiveCost = allLogs
      .filter((l) => l.type === 'Predictive')
      .reduce((sum, l) => sum + (l.cost || 0), 0);
    const breakdownCost = allLogs
      .filter((l) => l.type === 'Breakdown')
      .reduce((sum, l) => sum + (l.cost || 0), 0);
    const scheduledCost = allLogs
      .filter((l) => l.type === 'Scheduled')
      .reduce((sum, l) => sum + (l.cost || 0), 0);
    const totalHistoricalSavings = allLogs.reduce(
      (sum, l) => sum + (l.savingsByPredictiveAction || 0),
      0
    );

    res.json({
      success: true,
      data: {
        totalPredictedRiskCount,
        potentialBreakdownSavings,
        totalHistoricalSavings,
        costBreakdown: {
          predictiveCost,
          breakdownCost,
          scheduledCost,
        },
        forecastItems,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createMaintenanceLog = async (req, res) => {
  try {
    const log = await MaintenanceLog.create(req.body);
    res.status(201).json({ success: true, data: log });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const resolveMaintenanceLog = async (req, res) => {
  try {
    const log = await MaintenanceLog.findByIdAndUpdate(
      req.params.id,
      { status: 'Completed' },
      { new: true }
    );
    if (!log) {
      return res.status(404).json({ success: false, message: 'Maintenance record not found' });
    }
    res.json({ success: true, data: log });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
