import express from 'express';
import {
  getMaintenanceLogs,
  getPredictiveForecast,
  createMaintenanceLog,
  resolveMaintenanceLog,
} from '../controllers/maintenanceController.js';

const router = express.Router();

router.route('/').get(getMaintenanceLogs).post(createMaintenanceLog);
router.route('/predictive-forecast').get(getPredictiveForecast);
router.route('/:id/resolve').put(resolveMaintenanceLog);

export default router;
