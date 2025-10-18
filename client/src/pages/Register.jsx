import React, {useState } from 'react';

const Register =() => {
//1. initialize state for registration inputs 
   const [formData, setFormData] = useState({
      name: '',
      email: '',
      password: '',
      password2: '',// for password confirmation
});

const { name, email, password, password2 } =formData;

//2. handle input changes

const onChange =(e) => {
   setFormData({ ...formData, [e.target.name]: e.target.value });
};

//3. handle form submission 
const onSubmit =(e) => {
  e.preventDefault();
  
  if(password !== password2) {
  //Basic client-side validation
  console.error('Passowrds do not match!');
 } else {
  //passwords match, proceed with registration logic
  //*** placeholder for the API call (step 3b) ***
  console.log('Register Form submitted:', {name,email,password});
  alert(`Attempting to register user: ${name}`);

  }
};

return (
  <div className ="register-container">
    <h1> Create Account </h1>
    <p> Register a new account </p>

  <form onSubmit ={onSubmit}>
    <div className="form-group">
    <label htmlFor="name"> Name</label>
    <input 
      type="text"
      placeholder="your name"
      name="name"
      value={name}
      onChange={onChange}
      required
     />

   </div>

   <div className="form-group">
      <label htmlFor="email"> Email Address </label>
      <input
        type="email"
        placeholder="Enter email"
        name="email"
        value={email}
        onChange={onChange}
        required
       />
    </div>

   <div className="form-group">
     <label htmlFor="password"> Password </label>
      <input
        type="password"
        placeholder="Create password"
        name="password"
        value={password}
        required
        minLenght="6"
      />
      </div>

    <div className="form-group">
      <label htmlFor="password2"> Confirm PAssword </label>
      <input 
        type="password"
        placeholder="confirm password"
        name="password2"
        value={password2}
        onChange={onChange}
        required
        minLength="6"
      />
  
    </div>

    <button type= "submit" className="btn btn-primary">
      Register
    </button>
    </form>
  </div>

  );
};

export default Register;
