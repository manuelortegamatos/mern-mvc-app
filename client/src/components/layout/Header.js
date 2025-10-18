import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; // Asegúrate de crear este archivo para los estilos

const Header = () => {
    return (
        <header className="header">
            <div className="container">
                {/* 1. Logo o Nombre de la Marca */}
                <Link to="/" className="logo">
                    RSC DETAILING
                </Link>

                {/* 2. Navegación Principal */}
                <nav className="nav">
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/services">Services</Link></li>
                        <li><Link to="/gallery">Gallery</Link></li>
                        <li><Link to="/about">About Us</Link></li>
                        {/* Puedes añadir más enlaces como Contacto */}
                    </ul>
                </nav>

                {/* 3. Botón de Llamada a la Acción (CTA) */}
                <Link to="/book" className="cta-button">
                    Book Now
                </Link>
            </div>
        </header>
    );
};

export default Header;