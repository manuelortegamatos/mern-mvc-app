// src/api/apiService.js
import axios from 'axios';

// La URL base del backend
const API_URL = '/api';

// Función auxiliar para obtener los headers de autenticación
const getConfig = () => {
    // Asumiendo que el token se guarda como 'userToken'
    const token = localStorage.getItem('userToken');

    if (token) {
        return {
            headers: {
                'Content-Type': 'application/json',
                // Enviamos el Token JWT en el encabezado Authorization
                'Authorization': `Bearer ${token}`, 
            },
        };
    } else {
        // Para peticiones sin autenticar (ej. registro)
        return {
            headers: {
                'Content-Type': 'application/json',
            }
        };
    }
};

//funcion para iniciar seccion 

export const loginUser = async (loginData) => {

    try {
        //Peticion POST a la ruta de login del backend
        const response = await axios.post(`${API_URL}/users/login`, loginData, getConfig());

        //el backend debe devolver un objeto con los datos del usuario y el token
        const {token }= response.data;

        if(token){
            //!paso clave! guardamos el token en localstorage para futuras peticiones
            localStorage.setItem('userToken', token);

        }

        //devovemos todos los datos de la respuesta (ej. nombre email, token)

        return response.data;

    } catch (error){
        console.error('Error loggin in:', error);
        //manejo robusto de errores
        throw error.response?.data || error.message;

    } 
}

// Función para registrar un nuevo usuario
export const registerUser = async (userData) => {

try {
    const response = await axios.post(`${API_URL}/users/register`, userData,getConfig());
    return response.data;
    } catch (error) {
    // Manejo de errores
    console.error('Error registering user:', error);
    //throw error.response.data;
    throw error.response?.data || error.message;
 }
};

// Función para crear una nueva reserva
export const createBooking = async (bookingData) => {
 try {
  const response = await axios.post(`${API_URL}/bookings`, bookingData,getConfig());
  return response.data;
 } catch (error) {
  console.error('Error creating booking:', error);
  throw error.response?.data || error.message;
 }
};

// 3. (OPCIONAL) Función para obtener las solicitudes del cliente (Requiere Token)
export const getMyServiceRequests = async () => {
    try {
        const response = await axios.get(`${API_URL}/servicerequests/myrequests`, getConfig());
        return response.data; // Devuelve el array de solicitudes
    } catch (error) {
        console.error('Error fetching service requests:', error);
        throw error.response?.data || error.message;
    }
};
