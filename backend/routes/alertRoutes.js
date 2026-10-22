import express from 'express';
import {
  getAlerts,
  resolveAlert,
  resolveAllAlerts,
} from '../controllers/alertController.js';

const router = express.Router();

router.route('/').get(getAlerts);
router.route('/resolve-all').put(resolveAllAlerts);
router.route('/:id/resolve').put(resolveAlert);

export default router;
