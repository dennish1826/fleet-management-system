import Vehicle from '../models/Vehicle.js';

export const getVehicles = async (req, res) => {
  try {
    const { status, type } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;

    const vehicles = await Vehicle.find(filter)
      .populate('assignedDriver', 'name email phone avatar safetyScore licenseNumber')
      .sort({ vehicleId: 1 });

    res.json({
      success: true,
      count: vehicles.length,
      data: vehicles,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id).populate('assignedDriver');
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }
    res.json({ success: true, data: vehicle });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.create(req.body);
    res.status(201).json({ success: true, data: vehicle });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }
    res.json({ success: true, data: vehicle });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Simulation testing endpoint: inject fault
export const injectSimulatedFault = async (req, res) => {
  try {
    const { faultType } = req.body; // 'OVERHEAT', 'LOW_BATTERY', 'LOW_OIL', 'DTC_MISFIRE'
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    if (faultType === 'OVERHEAT') {
      vehicle.diagnostics.engineTemperature = 108.5;
    } else if (faultType === 'LOW_BATTERY') {
      vehicle.diagnostics.batteryVoltage = 11.2;
    } else if (faultType === 'LOW_OIL') {
      vehicle.diagnostics.oilLifePercentage = 11;
    } else if (faultType === 'DTC_MISFIRE') {
      if (!vehicle.diagnostics.dtcCodes.includes('P0300')) {
        vehicle.diagnostics.dtcCodes.push('P0300');
      }
    }

    await vehicle.save();
    res.json({
      success: true,
      message: `Injected simulated fault '${faultType}' into ${vehicle.vehicleId}`,
      data: vehicle,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
