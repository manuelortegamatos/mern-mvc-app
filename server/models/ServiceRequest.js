const mongoose = require('mongoose');
const ServiceRequestSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Referencia al cliente
    serviceType: { type: String, enum: ['garage', 'house', 'office', 'other'], required: true },
    description: { type: String },
    location: {
        address: { type: String, required: true },
        notes: { type: String }
    },
    requestedDate: { type: Date, required: true },
    status: { type: String, enum: ['pending', 'scheduled', 'in_progress', 'completed', 'cancelled'], default: 'pending' },
    price: { type: Number }, // Opcional, para que lo asigne el admin
    notesAdmin: { type: String }, // Notas solo para el admin
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('ServiceRequest', ServiceRequestSchema);