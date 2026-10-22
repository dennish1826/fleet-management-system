import express from 'express';
import {
  getDrivers,
  getDriverLeaderboard,
  getDriverById,
} from '../controllers/driverController.js';

const router = express.Router();

router.route('/').get(getDrivers);
router.route('/leaderboard').get(getDriverLeaderboard);
router.route('/:id').get(getDriverById);

export default router;
