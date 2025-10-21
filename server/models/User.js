// server/models/User.js

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
    // --- Campos de Nombre y Apellido ---
    firstName: { // Nuevo nombre del campo 'name'
        type: String,
        required: true // Sigue siendo obligatorio
    },
    lastName: { // Nuevo campo 'lastName'
        type: String,
        // No es requerido
    },
    // --- Nuevo campo userName ---
    userName: { // Se generará a partir del email si existe
        type: String,
        // No es requerido por defecto. Puede ser null.
        unique: true, // Si existe, debe ser único
        sparse: true, // Permite múltiples documentos con 'userName: null'
    },
    // --- Email (opcional, como habíamos definido) ---
    email: {
        type: String,
        required: false,
        unique:true,
        sparse:true, //Allows multiple documents to have a null email
        lowercase: true,
        // unique: true, // Lo manejaremos en el controlador si se proporciona
        // No es requerido
    },
    // --- Password (condicional al email, como habíamos definido) ---
    password: {
        type: String,
        // No es requerido. Puede ser null.
        required: function (){
            //"this" refers to the document being validated/saved
            //if this.email has a value, password is required (returns true)
            //if this.email. is null/undefined, password is NOT required (returns false)
            return !!this.email;
        },
        minlength: 6,

    },
    // --- Otros campos (iguales) ---
    phone: {
        type: String,
        required: true,
        unique: true,
        sparse: true
    },
    address: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        zipCode: { type: String },
        country: { type: String },
    },
    role: {
        type: String,
        enum: ['client', 'admin'],
        default: 'client'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Middleware de Mongoose para hashear la contraseña ANTES de guardar
UserSchema.pre('save', async function(next) {
    // Solo hashea si la contraseña ha sido modificada Y SI SU VALOR NO ES NULO/UNDEFINED
    if (!this.isModified('password') || !this.password) {
        return next();
    }
    try{
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        return next();
    }
    catch(error){
        next(error); // pass any hashing error to Mongoose
    }

});

// Método para comparar contraseñas
UserSchema.methods.matchPassword = async function(enteredPassword) {
    if (!this.password) { // Si el usuario no tiene contraseña almacenada
        return false;
    }
    return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', UserSchema);