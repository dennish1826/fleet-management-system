import express from 'express';
import {
  getTrips,
  getActiveTrips,
  getTripById,
  createTrip,
} from '../controllers/tripController.js';

const router = express.Router();

router.route('/').get(getTrips).post(createTrip);
router.route('/active').get(getActiveTrips);
router.route('/:id').get(getTripById);

export default router;
