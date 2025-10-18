// server/controllers/userController.js

const User = require('../models/User');
const transporter = require('../config/emailConfig');
const crypto = require('crypto');

exports.registerUser = async (req, res) => {
    // Ahora esperamos firstName y lastName
    const { firstName, lastName, email, phone, address } = req.body;

    try {
        // 1. Verificar si el usuario ya existe con ese teléfono (obligatorio y único)
        let userExistsPhone = await User.findOne({ phone });
        if (userExistsPhone) {
            return res.status(400).json({ message: 'User with this phone number already exists' });
        }

        let tempPassword = null;
        let mailSent = false;
        let userEmail = null;
        let generatedUserName = null; // Variable para almacenar el userName generado

        // 2. Lógica para el email (si se proporciona)
        if (email) {
            userEmail = email.toLowerCase();

            // Verificar si el email ya existe (debe ser único si se proporciona)
            let userExistsEmail = await User.findOne({ email: userEmail });
            if (userExistsEmail) {
                return res.status(400).json({ message: 'User with this email already exists' });
            }

            // --- Generar userName a partir del email ---
            // Extraer la parte antes del '@'
            const emailParts = userEmail.split('@');
            if (emailParts.length > 0) {
                generatedUserName = emailParts[0];

                // Opcional: Asegurarse de que el userName generado no exista ya
                // Si la lógica de tu negocio lo requiere, podrías verificar su unicidad aquí,
                // pero como el campo en el modelo tiene `unique: true` y `sparse: true`,
                // MongoDB se encargará de lanzar un error si hay duplicados no-null.
                // Sin embargo, si quieres un mensaje más amigable, puedes pre-chequear:
                let userExistsUserName = await User.findOne({ userName: generatedUserName });
                if (userExistsUserName) {
                    // Puedes añadir un sufijo si el userName ya existe, o pedir al usuario que elija otro email
                    // Por simplicidad, por ahora, dejaremos que MongoDB maneje el error de unicidad.
                    // O podrías generar un userName más complejo (ej. con un número aleatorio al final)
                }
            }


            // Generar una contraseña temporal en texto plano SOLO SI HAY EMAIL
            tempPassword = crypto.randomBytes(8).toString('hex');
        }

        // 3. Crear el nuevo usuario
        const newUser = new User({
            firstName,
            lastName,
            userName: generatedUserName, // Será null si no se proporcionó email
            email: userEmail,            // Será null si no se proporcionó email
            password: tempPassword,      // Será null si no se proporcionó email
            phone,
            address,
            role: 'client'
        });

        // 4. Guardar el usuario en la base de datos
        await newUser.save();

        // 5. Enviar correo electrónico si se generó una contraseña
        if (mailSent = (tempPassword && userEmail)) { // Asigna y evalúa al mismo tiempo
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: userEmail,
                subject: '¡Bienvenido a nuestro servicio de limpieza!',
                html: `
                    <p>Hola ${firstName},</p>
                    <p>Gracias por registrarte en nuestro servicio de limpieza.</p>
                    <p>Tus credenciales para iniciar sesión son:</p>
                    <p><strong>Usuario (Email):</strong> ${userEmail}</p>
                    <p><strong>Usuario (Nombre de Usuario):</strong> ${generatedUserName}</p>
                    <p><strong>Contraseña Temporal:</strong> ${tempPassword}</p>
                    <p>Por favor, inicia sesión y considera cambiar tu contraseña por una más segura.</p>
                    <p>¡Esperamos verte pronto!</p>
                `
            };
            await transporter.sendMail(mailOptions);
        }

        res.status(201).json({
            message: mailSent ?
                     'User registered successfully. Temporary password and username sent to your email.' :
                     'User registered successfully with phone number (no email provided for login).',
            user: {
                _id: newUser._id,
                firstName: newUser.firstName,
                lastName: newUser.lastName || null,
                userName: newUser.userName || null, // Asegura que se envíe null si no existe
                email: newUser.email || null,
                phone: newUser.phone,
                role: newUser.role,
                createdAt: newUser.createdAt
            }
        });

    } catch (error) {
        console.error(error);
        // Manejar específicamente el error de duplicidad de userName si es crítico
        if (error.code === 11000 && error.keyPattern && error.keyPattern.userName) {
             return res.status(400).json({ message: 'The generated username from your email is already taken. Please try a different email or contact support.' });
        }
        res.status(500).json({ message: 'Server error during registration', error: error.message });
    }
};

// --- Controlador para login ---
// Ahora, el login podría ser por email/pass O por userName/pass
// El login por email/pass ya funciona. Necesitarás uno nuevo para userName/pass si lo quieres.

// @desc    Auth user & get token (Login por Email y Contraseña)
// @route   POST /api/users/login
// @access  Public
exports.loginUser = async (req, res) => {
    // Para login, ahora se podría usar `email` o `userName`
    // Aquí asumimos que el frontend enviará 'email' y 'password'.
    // Si quieres login por 'userName', necesitarás otro endpoint o una lógica para determinarlo.
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please enter email and password' });
    }

    try {
        const userEmail = email.toLowerCase();
        const user = await User.findOne({ email: userEmail });

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        if (!user.password) {
             return res.status(400).json({ message: 'User registered without a password. Please contact support or use alternative login methods.' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = "GENERAR_JWT_AQUI";

        res.json({
            message: 'Logged in successfully',
            token,
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                userName: user.userName,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during login', error: error.message });
    }
};

// ... otros controladores