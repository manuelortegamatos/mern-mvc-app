import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { loginUser } from '../api/apiService';

function Login() {
   const [formData, setFormData] = useState({
      email: '',
      password: '',
   });

const [error, setError] = useState(null);
const [loading, setLoading] = useState(false);

const navigate = useNavigate();
const { email, password } =formData;

const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
};

const onSubmit = async (e) => {
   e.preventDefault();
   setError(null);
   setLoading(true);

   // validacion basica 

   if(!email || !password) {
       setError('please, enter email y password!');
       setLoading(false); 
       return;
}

try{
    //llama a la funcion de tu apiService
    const user = await loginUser({email, password });
    
    //si tiene exito, el token ya esta guardado en localStorage
    console.log('login was sucessful. username:',user.email);
    
    //redirige al usuario a la pagina de solicitudes ( o donde sea necesario)
    navigate('/myrequests');

}catch (err){
//Captura el mensaje de error robusto que lanzaste en apiService
const errorMessage = err.message || err.message || 'an unknown error occurred while logging in';
}finally{
   setLoading(false);
  }
};

return (
   <div className ="login-container">
       <h1> Sign in </h1>
            <form onSubmit ={onSubmit}>
                <div className="form-group">
                    <label> Email</label>
                    <input type="email" placeholder="Enter your email" name="email" value={email} onChange={onChange} required />
                </div>
                <div className ="form-group">
                    <label> Password </label>
                    <input type ="password" placeholder="Enter your password" name ="password" value ={password} onChange={onChange} required />
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Charging...' : 'Enter'}
                    Login
        </button>
            </form>

        {error && <p style= {{color: 'red', marginTop: '15px' }}> {error}</p>}
           </div>
      );
}
export default Login; 
