// server/controllers/serviceRequestController.js

const ServiceRequest = require('../models/ServiceRequest');
const User = require('../models/User'); // Necesitamos el modelo User para referencias

// @desc    Create a new service request
// @route   POST /api/servicerequests
// @access  Private (Client)
exports.createServiceRequest = async (req, res) => {
    // req.user._id viene del middleware de autenticación, es el ID del cliente logueado
    const { serviceType, description, location, requestedDate } = req.body;

    // Validación básica
    if (!serviceType || !location || !location.address || !requestedDate) {
        return res.status(400).json({ message: 'Please provide service type, location address, and requested date.' });
    }

    // Opcional: Validar que el serviceType sea uno de los enums válidos
    const validServiceTypes = ServiceRequest.schema.path('serviceType').caster.enumValues;
    if (!validServiceTypes.includes(serviceType)) {
        return res.status(400).json({ message: `Invalid service type. Must be one of: ${validServiceTypes.join(', ')}.` });
    }

    try {
        const newServiceRequest = new ServiceRequest({
            user: req.user._id, // Asigna la solicitud al usuario logueado
            serviceType,
            description,
            location,
            requestedDate: new Date(requestedDate), // Asegúrate de que la fecha sea un objeto Date
            status: 'pending' // Por defecto
        });

        const serviceRequest = await newServiceRequest.save();
        res.status(201).json({ message: 'Service request created successfully.', serviceRequest });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error creating service request.', error: error.message });
    }
};

// @desc    Get all service requests for a specific client
// @route   GET /api/servicerequests/myrequests
// @access  Private (Client)
exports.getMyServiceRequests = async (req, res) => {
    try {
        const serviceRequests = await ServiceRequest.find({ user: req.user._id }).sort({ createdAt: -1 }); // Las más recientes primero
        res.status(200).json({ serviceRequests });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching client service requests.', error: error.message });
    }
};

// @desc    Get all service requests (Admin only)
// @route   GET /api/servicerequests
// @access  Private (Admin)
exports.getAllServiceRequests = async (req, res) => {
    try {
        // .populate('user', 'firstName lastName email phone')
        // Esto 'rellena' el campo 'user' con los datos del usuario, pero solo los campos especificados
        const serviceRequests = await ServiceRequest.find({})
            .populate('user', 'firstName lastName email userName phone') // Incluye userName aquí
            .sort({ createdAt: -1 });
        res.status(200).json({ serviceRequests });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching all service requests.', error: error.message });
    }
};

// @desc    Get a single service request by ID (Admin or client if it's theirs)
// @route   GET /api/servicerequests/:id
// @access  Private (Admin or Client)
exports.getServiceRequestById = async (req, res) => {
    try {
        const serviceRequest = await ServiceRequest.findById(req.params.id).populate('user', 'firstName lastName email userName phone'); // También populate userName
        if (!serviceRequest) {
            return res.status(404).json({ message: 'Service request not found.' });
        }

        // Si es un cliente, solo puede ver sus propias solicitudes
        if (req.user.role === 'client' && serviceRequest.user._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to view this service request.' });
        }

       // res.status(200).json({ serviceRequest });
       res.status(200).json(serviceRequests);
    } catch (error) {
        console.error(error);
        if (error.kind === 'ObjectId') { // Si el ID no es válido para MongoDB
            return res.status(400).json({ message: 'Invalid service request ID.' });
        }
        res.status(500).json({ message: 'Server error fetching service request.', error: error.message });
    }
};

// @desc    Update a service request (Admin only)
// @route   PUT /api/servicerequests/:id
// @access  Private (Admin)
exports.updateServiceRequest = async (req, res) => {
    const { serviceType, description, location, requestedDate, status, price, notesAdmin } = req.body;

    // Opcional: Validar que el status sea uno de los enums válidos
    if (status) {
        const validStatuses = ServiceRequest.schema.path('status').caster.enumValues;
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: `Invalid status. Must be one of: ${validStatuses.join(', ')}.` });
        }
    }

    try {
        let serviceRequest = await ServiceRequest.findById(req.params.id);

        if (!serviceRequest) {
            return res.status(404).json({ message: 'Service request not found.' });
        }

        // Actualizar solo los campos que se envíen
        serviceRequest.serviceType = serviceType || serviceRequest.serviceType;
        serviceRequest.description = description || serviceRequest.description;
        serviceRequest.location = location || serviceRequest.location;
        serviceRequest.requestedDate = requestedDate ? new Date(requestedDate) : serviceRequest.requestedDate;
        serviceRequest.status = status || serviceRequest.status;
        serviceRequest.price = price !== undefined ? price : serviceRequest.price; // Permite establecer 0
        serviceRequest.notesAdmin = notesAdmin || serviceRequest.notesAdmin;
        serviceRequest.updatedAt = Date.now();

        const updatedServiceRequest = await serviceRequest.save();
        res.status(200).json({ message: 'Service request updated successfully.', serviceRequest: updatedServiceRequest });

    } catch (error) {
        console.error(error);
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid service request ID.' });
        }
        res.status(500).json({ message: 'Server error updating service request.', error: error.message });
    }
};

// @desc    Delete a service request (Admin only)
// @route   DELETE /api/servicerequests/:id
// @access  Private (Admin)
exports.deleteServiceRequest = async (req, res) => {
    try {
        const serviceRequest = await ServiceRequest.findById(req.params.id);

        if (!serviceRequest) {
            return res.status(404).json({ message: 'Service request not found.' });
        }

        await ServiceRequest.deleteOne({ _id: req.params.id }); // Mongoose 6+ uses deleteOne/deleteMany
        res.status(200).json({ message: 'Service request removed successfully.' });

    } catch (error) {
        console.error(error);
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid service request ID.' });
        }
        res.status(500).json({ message: 'Server error deleting service request.', error: error.message });
    }
};