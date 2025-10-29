import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import {notFound, errorHandler } from './middleware/errorMiddleware.js';
import smsRoutes from './routes/smsRoutes.js';


dotenv.config({ path: '../.env' }); 
connectDB();

const app = express();

//middleware: usar json para el cuerpo de las peticiones
app.use(express.json());

/*
Register the SMS Routes
All routes defined in smsRoutes will be prefixed with '/api/sms'
*/
app.use('/api/sms', smsRoutes);
//URL-encoded middleware: Allows the server to accept data from HTML forms
app.use(express.urlencoded({extended: true }));

//Default route for a simple server check
app.get('/', (req, res )=> {
    res.send('API is running...');
});

//middleware: usar las rutas de usuario
//todas las rutas dentro de userRoutes.js se montaran bajo /api/users
app.use('/api/users',userRoutes);

//This should always be placed after the routes
app.use(notFound);
app.use(errorHandler);

//start the server

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