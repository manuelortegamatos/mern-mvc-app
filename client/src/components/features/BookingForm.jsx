import React from 'react';

const BookingForm = () => {
  return (
    <div className="booking-form">
      <h2> Book Your Appointment</h2>
      <form>
        <div>
          <label htmlFor="name">Name: </label>
          <input type="text" id="name" name="name" />
        </div>
        <button type="submit"> Submit Booking </button>
       </form>
     </div>
    );
};

export default BookingForm;
