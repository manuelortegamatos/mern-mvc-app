import express from 'express';
const router = express.Router();
import {protect,admin} from '../middleware/authMiddleware.js';

// 💡 Nota: Aquí es donde importarías tu controlador (controller) de usuarios
// const userController = require('../controllers/userController');

// Rutas de ejemplo:

// GET /api/users/test

//importar el controlador de usuarios 
//nombre del controlador userController.js

import {
    registerUser,
    loginUser,
    getUserProfile,
    adminTest,
    createUser

    //puedes importar los contradores aqui.
}
from '../controllers/userController.js';


router.get('/test', (req, res) => {
    res.status(200).send({ message: 'User routes are working!' });
});

// POST /api/users/register
router.post('/register', registerUser);

// ... otras rutas como login, profile, etc.

router.post('/login', loginUser); // conexion clave

//otras rutas como para obtener perfil, actualizar, etc.

//Get / api/users/profile - PROTECTED ROUTE
router.get('/profile', protect , getUserProfile); // user protect here

router.post('/create',protect,admin, createUser);

//RUTA PROTEGIDA DOBLEMENTE: solo para usuarios autenticados que son administradores

//GET/api/users/admin-test

router.get('/admin-test', protect, admin, adminTest); //implementacion

//module.exports = router;

export default router;