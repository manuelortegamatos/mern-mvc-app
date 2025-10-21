// server/controllers/userController.js
import generateToken from '../utils/generateToken.js';
import User from '../models/User.js';
import transporter from '../config/emailConfig.js';
import crypto from 'crypto';

const registerUser = async (req, res) => {
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
        mailSent =!! (tempPassword && userEmail)
        if (mailSent) { 
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
const loginUser = async (req, res) => {
    // Para login, ahora se podría usar `email` o `userName`
    // Aquí asumimos que el frontend enviará 'email' y 'password'.
    // Si quieres login por 'userName', necesitarás otro endpoint o una lógica para determinarlo.
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please enter email and password' });
    }
    const identifier= email.toLowerCase();
    const potentialUsername = identifier.split('@')[0];

    try {
        
        const user = await User.findOne({ 
            $or: [{ email: identifier }, {userName: potentialUsername } ]  
        });

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
        // ahora usamos la funcion
        
        const token =generateToken(user._id); // generate token using the user's ID

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

const getUserProfile = async (req, res) =>{

   // cuando el middleware protect se ejecuta adjunta el objeto user a la peticion res.user
   if(req.user){
    // Enviar los datos del usuario adjuntos por el middleware
        res.json({
            _id: req.user._id,
            firstName: req.user.firstName,
            email: req.user.email,
            role: req.user.role,
            //NO  incluir la contraseña

        });

   }else {
        // esto solo ocurriria si el middleware protect falla, pero es una buena practica
        res.status(401).json ({message: 'user not found'});

   }
};

// ... otros controladores

const adminTest=(req,res) =>{
//si la solicitud llega aqui el usuario es admin
    res.status(200).json({
        message: 'Welcome Admin! this is a restricted area',
        user: req.user.firstName
    });
};

// --- Controlador para que un Admin cree un Usuario ---
// @desc    Admin creates a new user (employee, admin, client)
// @route   POST /api/users/create
// @access  Private/Admin

const createUser = async (req, res) => {
    // 💡 Aquí el admin puede establecer el rol (role)
    const { firstName, lastName, email, phone, password, role, address } = req.body; 

    // 1. Validaciones básicas
    if (!firstName || !email || !phone || !password) {
        return res.status(400).json({ message: 'Please include firstName, email, phone, and password' });
    }

    try {
        // 2. Verificar duplicados (teléfono y email)
        const userExistsPhone = await User.findOne({ phone });
        if (userExistsPhone) {
            return res.status(400).json({ message: 'User with this phone number already exists' });
        }
        const userExistsEmail = await User.findOne({ email: email.toLowerCase() });
        if (userExistsEmail) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // 3. Generar userName a partir del email (o dejarlo opcional)
        const emailParts = email.split('@');
        const generatedUserName = emailParts.length > 0 ? emailParts[0] : null;

        // 4. Crear el nuevo usuario (la contraseña se hashea automáticamente en el modelo)
        const newUser = await User.create({
            firstName,
            lastName,
            userName: generatedUserName,
            email: email.toLowerCase(),
            password, // La contraseña se hashea en el pre-save hook del modelo
            phone,
            address,
            // 💡 Permite al admin establecer el rol (por defecto 'client' si no se envía)
            role: role || 'client' 
        });

        res.status(201).json({
            message: `User ${newUser.email} created successfully with role ${newUser.role}.`,
            user: {
                _id: newUser._id,
                firstName: newUser.firstName,
                email: newUser.email,
                role: newUser.role
            }
        });

    } catch (error) {
        console.error(error);
        // Manejar errores de unicidad de MongoDB o errores del servidor
        if (error.code === 11000) {
            return res.status(400).json({ message: 'A user with this email or username already exists.' });
        }
        res.status(500).json({ message: 'Server error during user creation', error: error.message });
    }
};

export {
     registerUser,
     loginUser,
     getUserProfile, // exporta la nueva funcion
     adminTest,
     createUser,
};