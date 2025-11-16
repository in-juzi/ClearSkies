import express from 'express';
import * as locationController from '../controllers/locationController';
import { protect } from '../middleware/auth';

const router = express.Router();

// All location routes require authentication
router.use(protect);

// Location endpoints
router.get('/', locationController.getDiscoveredLocations);
router.get('/all', locationController.getAllLocations);
router.get('/current', locationController.getCurrentLocation);
router.get('/:locationId', locationController.getLocation);

// Travel endpoints
router.post('/travel', locationController.startTravel);
router.get('/travel/status', locationController.getTravelStatus);
router.post('/travel/cancel', locationController.cancelTravel);
router.post('/travel/skip', locationController.skipTravel);

// Facility endpoints
router.get('/facilities/:facilityId', locationController.getFacility);

// Activity endpoints
router.post('/activities/start', locationController.startActivity);
router.get('/activities/status', locationController.getActivityStatus);
router.post('/activities/complete', locationController.completeActivity);
router.post('/activities/cancel', locationController.cancelActivity);

// Admin/Debug endpoints
router.get('/definitions/all', locationController.getAllDefinitions);
router.post('/definitions/reload', locationController.reloadDefinitions);

export default router;
