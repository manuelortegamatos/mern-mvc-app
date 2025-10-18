// src/pages/Booking.js
import React from 'react';
import BookingForm from '../components/features/BookingForm';

const Booking = () => {
  return (
    <div className="booking-page-container">
      <h1>Agenda tu Cita de Detailing</h1>
      {/* 📝 Lógica: Formulario multi-paso (selección de servicio, datos, fecha/hora) */}
      <BookingForm />
    </div>
  );
};

export default Booking;