// server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Necesitamos el modelo User

// Para tu .env, necesitarás una SECRET_KEY como esta (usa una cadena larga y aleatoria):
// JWT_SECRET=alguna_clave_secreta_muy_larga_y_aleatoria_para_jwt

// Middleware para proteger rutas (verificar token JWT)
exports.protect = async (req, res, next) => {
    let token;
    // Comprobar si el token está en los headers de autorización
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Obtener token del header
            token = req.headers.authorization.split(' ')[1];

            // Verificar token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Adjuntar el usuario al objeto de solicitud (sin la contraseña)
            req.user = await User.findById(decoded.id).select('-password');
            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            next(); // Pasar al siguiente middleware/controlador
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }
    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// Middleware para verificar si el usuario es administrador
exports.admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};

// Para tu userController, necesitarás una función para generar el token
// Ejemplo:
// const jwt = require('jsonwebtoken');
// const generateToken = (id) => {
//     return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
// };
// Y luego en loginUser: const token = generateToken(user._id);