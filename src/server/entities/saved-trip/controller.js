const { Router } = require('express');
const asyncHandler = require('express-async-handler');

const requireAuth = require('../../middleware/require-auth');
const service = require('./service');

const router = Router();

router.get(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      user: { id },
    } = req;
    const savedTrips = await service.findAllByUser(id);
    const savedTripDTOs = await Promise.all(savedTrips.map(service.toTripDTO));

    res.send({ trips: savedTripDTOs });
  }),
);

router.get(
  '/users/:userId',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      params: { userId },
    } = req;
    const savedTrips = await service.findAllFinishedByUser(userId);
    const savedTripDTOs = await Promise.all(savedTrips.map(service.toTripDTO));

    res.send({ trips: savedTripDTOs });
  }),
);

router.get(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      params: { id },
    } = req;
    const trip = await service.findById(id, { includeModels: true });
    const tripDTO = await service.toTripDTO(trip);

    res.send({ trip: tripDTO });
  }),
);

router.post(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      user: { id },
      body: { trip },
    } = req;

    const savedTrip = await service.create(trip, id);
    const savedTripDTO = await service.toTripDTO(savedTrip);

    res.send({ trip: savedTripDTO });
  }),
);

router.put(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      user: { id: userId },
      params: { id },
      body: { trip },
    } = req;

    const existingTrip = await service.findById(id);

    if (!existingTrip) {
      const error = new Error('Trip not found');
      error.status = 404;

      throw error;
    } else if (existingTrip.userId !== userId) {
      const error = new Error('The user is not authorized to do this action');
      error.status = 403;

      throw error;
    }

    const updatedTrip = await service.updateFullTrip(existingTrip, trip);
    const updatedTripDTO = await service.toTripDTO(updatedTrip);

    res.send({ trip: updatedTripDTO });
  }),
);

router.put(
  '/:id/from-point',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      user: { id: userId },
      params: { id },
      body: { startingLocationId },
    } = req;

    const existingTrip = await service.findById(id, { includeModels: true });

    if (!existingTrip) {
      const error = new Error('Trip not found');
      error.status = 404;

      throw error;
    } else if (existingTrip.userId !== userId) {
      const error = new Error('The user is not authorized to do this action');
      error.status = 403;

      throw error;
    }

    const updatedTrip = await service.startTripFromLocation(
      existingTrip,
      startingLocationId,
    );
    const updatedTripDTO = await service.toTripDTO(updatedTrip);

    res.send({ trip: updatedTripDTO });
  }),
);

router.post(
  '/:id/started',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      user: { id: userId },
      params: { id },
    } = req;
    const trip = await service.findById(id);

    if (!trip) {
      const error = new Error('Trip not found');
      error.status = 404;

      throw error;
    } else if (trip.userId !== userId) {
      const error = new Error('The user is not authorized to do this action');
      error.status = 403;

      throw error;
    }

    await service.update(id, { startedAt: new Date() });

    res.send({ message: 'Trip started' });
  }),
);

router.post(
  '/:id/locations/:locationId/skipped',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      user: { id: userId },
      params: { id, locationId },
    } = req;
    const savedLocation = await service.findLocationById(locationId);

    if (!savedLocation) {
      const error = new Error('Location not found');
      error.status = 404;

      throw error;
    } else if (savedLocation.savedTrip.userId !== userId) {
      const error = new Error('The user is not authorized to do this action');
      error.status = 403;

      throw error;
    } else if (savedLocation.savedTrip.id !== id) {
      const error = new Error('The location trip does not match the trip id');
      error.status = 422;

      throw error;
    }

    await service.markLocationSkipped(locationId);

    res.send({ message: 'Location skipped' });
  }),
);

router.post(
  '/:id/locations/:locationId/visited',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      user: { id: userId },
      params: { id, locationId },
    } = req;
    const savedLocation = await service.findLocationById(locationId);

    if (!savedLocation) {
      const error = new Error('Location not found');
      error.status = 404;

      throw error;
    } else if (savedLocation.savedTrip.userId !== userId) {
      const error = new Error('The user is not authorized to do this action');
      error.status = 403;

      throw error;
    } else if (savedLocation.savedTrip.id !== id) {
      const error = new Error('The location trip does not match the trip id');
      error.status = 422;

      throw error;
    }

    await service.markLocationVisited(locationId);

    res.send({ message: 'Location visited' });
  }),
);

router.post(
  '/:id/ended',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      user: { id: userId },
      params: { id },
    } = req;
    const trip = await service.findById(id);

    if (!trip) {
      const error = new Error('Saved trip not found');
      error.status = 404;

      throw error;
    } else if (trip.userId !== userId) {
      const error = new Error('The user is not authorized to do this action');
      error.status = 403;

      throw error;
    }

    await service.endTrip(id);

    res.send({ message: 'Saved Trip ended' });
  }),
);

router.delete(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      user: { id: userId },
      params: { id },
    } = req;
    const trip = await service.findById(id);

    if (!trip) {
      return res.send({ message: 'Saved Trip deleted' });
    } else if (trip.userId !== userId) {
      const error = new Error('The user is not authorized to do this action');
      error.status = 403;

      throw error;
    }

    await service.destroy(id);

    res.send({ message: 'Saved Trip deleted' });
  }),
);

module.exports = router;
