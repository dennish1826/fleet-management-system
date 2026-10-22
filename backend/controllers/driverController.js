import User from '../models/User.js';

export const getDrivers = async (req, res) => {
  try {
    const drivers = await User.find({ role: 'Driver' })
      .populate('assignedVehicle', 'vehicleId plateNumber model status')
      .sort({ safetyScore: -1 });

    res.json({
      success: true,
      count: drivers.length,
      data: drivers,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDriverLeaderboard = async (req, res) => {
  try {
    const drivers = await User.find({ role: 'Driver' })
      .populate('assignedVehicle', 'vehicleId plateNumber model status')
      .sort({ safetyScore: -1 });

    const topPerformers = drivers.filter((d) => d.safetyScore >= 85);
    const moderateRisk = drivers.filter((d) => d.safetyScore >= 70 && d.safetyScore < 85);
    const highRisk = drivers.filter((d) => d.safetyScore < 70);

    const averageFleetSafetyScore =
      drivers.length > 0
        ? Math.round(drivers.reduce((acc, d) => acc + (d.safetyScore || 0), 0) / drivers.length)
        : 85;

    res.json({
      success: true,
      data: {
        averageFleetSafetyScore,
        topPerformers,
        moderateRisk,
        highRisk,
        rankedList: drivers,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDriverById = async (req, res) => {
  try {
    const driver = await User.findById(req.params.id).populate('assignedVehicle');
    if (!driver) {
      return res.status(404).json({ success: false, message: 'Driver not found' });
    }
    res.json({ success: true, data: driver });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
