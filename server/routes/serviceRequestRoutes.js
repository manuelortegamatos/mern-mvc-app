// server/routes/serviceRequestRoutes.js

import express from 'express';
import {
    createServiceRequest,
    getMyServiceRequests,
    getAllServiceRequests,
    getServiceRequestById,
    updateServiceRequest,
    deleteServiceRequest
}from '../controllers/serviceRequestController.js';
import { protect, admin } from '../middleware/authMiddleware'; // Importa los middlewares

const router = express.Router();

// Rutas accesibles para clientes y/o administradores

// @route   GET /api/servicerequests/myrequests
// @desc    Get all service requests for the logged-in client
// @access  Private (Client)
router.get('/myrequests', protect, getMyServiceRequests);

// @route   GET /api/servicerequests
// @desc    Get all service requests
// @access  Private (Admin)
router.get('/', protect, admin, getAllServiceRequests);

// @route   POST /api/servicerequests
// @desc    Create a new service request
// @access  Private (Client)
router.post('/', protect, createServiceRequest);

// @route   GET /api/servicerequests/:id
// @desc    Get a single service request (by ID)
// @access  Private (Admin or Client if it's theirs)
router.get('/:id', protect, getServiceRequestById);

// --- Rutas solo para administradores ---

// @route   PUT /api/servicerequests/:id
// @desc    Update a service request
// @access  Private (Admin)
router.put('/:id', protect, admin, updateServiceRequest);

// @route   DELETE /api/servicerequests/:id
// @desc    Delete a service request
// @access  Private (Admin)
router.delete('/:id', protect, admin, deleteServiceRequest);

module.exports = router;