// client/src/components/Navbar.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <header>
      <nav>
        {/* Enlace principal */}
        <Link to="/">Inicio</Link> 
        
        {/* Enlace de autenticación */}
        <Link to="/login">Iniciar Sesión</Link> {/* <--- Aquí está la integración */}
        
        <Link to="/register">Registro</Link>
      </nav>
    </header>
  );
};

// add this line to make it availabe 

export default Navbar;
