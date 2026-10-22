import express from 'express';
import {
  getOverviewKPIs,
  getFuelConsumptionTrends,
  getMaintenanceCostTrends,
  getFleetUtilization,
} from '../controllers/analyticsController.js';

const router = express.Router();

router.route('/overview').get(getOverviewKPIs);
router.route('/fuel-consumption').get(getFuelConsumptionTrends);
router.route('/maintenance-costs').get(getMaintenanceCostTrends);
router.route('/fleet-utilization').get(getFleetUtilization);

export default router;
