import Trip from '../models/Trip.js';

export const getTrips = async (req, res) => {
  try {
    const { status, vehicleId, driverId } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (vehicleId) filter.vehicleId = vehicleId;
    if (driverId) filter.driverId = driverId;

    const trips = await Trip.find(filter)
      .populate('vehicleId', 'vehicleId plateNumber model status')
      .populate('driverId', 'name email safetyScore avatar')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: trips.length,
      data: trips,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getActiveTrips = async (req, res) => {
  try {
    const activeTrips = await Trip.find({ status: 'In Progress' })
      .populate('vehicleId')
      .populate('driverId')
      .sort({ start_time: -1 });

    res.json({
      success: true,
      count: activeTrips.length,
      data: activeTrips,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate('vehicleId')
      .populate('driverId');

    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    res.json({ success: true, data: trip });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createTrip = async (req, res) => {
  try {
    const trip = await Trip.create(req.body);
    res.status(201).json({ success: true, data: trip });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
