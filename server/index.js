import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


/*

// server/index.js (o app.js)

const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db').default; // Asume que tienes un archivo para conectar a MongoDB
const userRoutes = require('./routes/userRoutes'); // Tus rutas de usuario
const serviceRequestRoutes = require('./routes/serviceRequestRoutes'); // ¡Nuevas rutas de servicio!

dotenv.config({ path: './server/.env' }); // Cargar variables de entorno
connectDB(); // Conectar a la base de datos

const app = express();

app.use(express.json()); // Middleware para parsear JSON en el cuerpo de las solicitudes

// --- Rutas de la API ---
app.use('/api/users', userRoutes); // Por ejemplo, todas las rutas de usuario irán bajo /api/users
app.use('/api/servicerequests', serviceRequestRoutes); // ¡Aquí integras las nuevas rutas!

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

*/