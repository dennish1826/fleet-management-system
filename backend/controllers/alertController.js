import Alert from '../models/Alert.js';

export const getAlerts = async (req, res) => {
  try {
    const { resolved_status, severity, type, limit = 50 } = req.query;
    const filter = {};

    if (resolved_status !== undefined) {
      filter.resolved_status = resolved_status === 'true';
    }
    if (severity) filter.severity = severity;
    if (type) filter.type = type;

    const alerts = await Alert.find(filter)
      .populate('vehicleId', 'vehicleId plateNumber model status')
      .sort({ timestamp: -1 })
      .limit(parseInt(limit, 10));

    const unreadCount = await Alert.countDocuments({ resolved_status: false });
    const criticalCount = await Alert.countDocuments({
      resolved_status: false,
      severity: 'Critical',
    });

    res.json({
      success: true,
      count: alerts.length,
      unreadCount,
      criticalCount,
      data: alerts,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const resolveAlert = async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      {
        resolved_status: true,
        resolvedAt: new Date(),
      },
      { new: true }
    );

    if (!alert) {
      return res.status(404).json({ success: false, message: 'Alert not found' });
    }

    res.json({ success: true, data: alert });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const resolveAllAlerts = async (req, res) => {
  try {
    await Alert.updateMany(
      { resolved_status: false },
      {
        resolved_status: true,
        resolvedAt: new Date(),
      }
    );

    res.json({ success: true, message: 'All alerts marked as resolved' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
