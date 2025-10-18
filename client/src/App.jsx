// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Services from './pages/Services';
import Booking from './pages/Booking';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Header />
      <Navbar /> 
      <main>
        <div className="App">
          <h1>Hello, World! I'm Working! try to find me 🎉</h1>
          {/* ... The rest of your app components ... */}
        </div>
        <Routes>
          
          <Route path="/services" element={<Services />} />
          <Route path="/book" element={<Booking />} />
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login /> } />
          <Route path="/register" element={<Register />} />
          

          {/* Añadir más rutas según sea necesario */}
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;