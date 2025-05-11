import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { sendRequest } from '../functions'
import DivInput from '../Components/DivInput'
import './styles/register.css';

const Register = () => {
  const [usuario, setUsername] = useState('');
  const [contrasena, setPassword] = useState('')
  const [crepetida, setRepeat] = useState('')
  const [correo, setEmail] = useState('');
  const [nombre, setName] = useState('')
  const [mal, setMal] = useState(true)
  const [contraMal, setContraMal] = useState(true)
  const go = useNavigate();

  const register = async (e) => {
    if(contrasena === crepetida){
      setMal(true)
      e.preventDefault();
      const form = { usuario:usuario, contrasena:contrasena, correo:correo, nombre:nombre };
      const res = await sendRequest(
        'POST', 
        form, 
        'http://localhost:3000/api/v1/users/register', 
        '', 
        false, 
        "Usuario Registrado Correctamente"
      );
      if (res) {
        go('/login')
      }
    }else{
      e.preventDefault()
      setMal(false)
    }
    
  }

  function validarContrasena(e) {
    setPassword(e.target.value)
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&]{8,}$/;
    if(regex.test(e.target.value)){
      setContraMal(true)
    }else{
      e.preventDefault()
      setContraMal(false)
    }
  }

  return (
    <div className='container-fluid'>
      <div className="row mt-5">
        <div className='col-md-4 offset-md-4'>
          <div className='register-container'>
            <div className='register-header'>
              REGISTRARSE
            </div>
            <div className='register-body'>
              <form onSubmit={register}>
                <DivInput 
                  type='text' 
                  icon='fa-user' 
                  value={usuario} 
                  className='form-control' 
                  placeholder='Usuario' 
                  required='required' 
                  handleChange={(e) => setUsername(e.target.value)} 
                />
                <DivInput type='text' icon='fa-user' value={nombre} className='form-control' placeholder='Nombre' required='required' handleChange={(e) => setName(e.target.value)} />
                <DivInput type='email' icon='fa-at' value={correo} className='form-control' placeholder='Correo' required='required' handleChange={(e) => setEmail(e.target.value)} />
                <DivInput type='password' icon='fa-key' value={contrasena} className='form-control' placeholder='Contraseña' required='required' handleChange={(e) => validarContrasena(e)} />
                <p className={`error-message ${contraMal ? 'hidden' : ''}`}>
                  La contraseña debe contener al menos 8 carácteres y al menos 1 mayúscula, 
                  1 minúscula, 1 número y 1 carácter especial
                </p>
                <DivInput type='password' icon='fa-key' value={crepetida} className='form-control' placeholder='Contraseña repetida' required='required' handleChange={(e) => setRepeat(e.target.value)} />
                <p className={`error-message ${mal ? 'hidden' : ''}`}>
                  Las contraseñas no coinciden
                </p>
                <div className='d-grid col-10 mx-auto'>
                  <button className='register-button'>
                    <i className='fa-solid fa-user-plus me-2'></i> 
                    Registrarse
                  </button>
                </div>
              </form>
              <Link to='/login' className='login-link'>
                <i className='fa-solid fa-arrow-left me-2'></i>
                Volver al login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
