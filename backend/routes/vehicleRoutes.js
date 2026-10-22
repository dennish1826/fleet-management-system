import express from 'express';
import {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  injectSimulatedFault,
} from '../controllers/vehicleController.js';

const router = express.Router();

router.route('/').get(getVehicles).post(createVehicle);
router.route('/:id').get(getVehicleById).put(updateVehicle);
router.route('/:id/simulate-fault').post(injectSimulatedFault);

export default router;
