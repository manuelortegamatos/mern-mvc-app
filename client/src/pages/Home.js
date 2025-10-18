// src/pages/Home.js
import React from 'react';
import HeroSection from '../components/features/HeroSection';
import ServicesOverview from '../components/features/ServicesOverview';
import Testimonials from '../components/features/Testimonials';

const Home = () => {
  return (
    <div>
      {/* 🏞️ Estética: Imagen de fondo grande, CTA visible */}
      <HeroSection />

      {/* 📋 Visión General: Bloques de 3-4 servicios (Ceramic, Paint, Mobile) */}
      <ServicesOverview />

      {/* ⭐ Confianza: Citas de clientes */}
      <Testimonials />
      
      {/* Sección de Contacto Rápido */}
    </div>
  );
};

export default Home;