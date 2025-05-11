import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { sendRequest, show_alerta } from '../functions';
import DivInput from '../Components/DivInput';
import storage from '../Storage/storage';
import './styles/login.css';

const Login = () => {
  const [usuario, setUsername] = useState('');
  const [contrasena, setPassword] = useState('');
  const [contraMal, setContraMal] = useState(true);
  const go = useNavigate();
  const login = async (e) => {
    e.preventDefault();
    const form = { usuario, contrasena };

    const res = await sendRequest('POST', form, '/users/login', '', false, "Iniciado sesión correctamente");

    console.log(res);
    
    if (res.data) {
      storage.set('authToken', res.token);
      storage.set('authUser', res.data);
      storage.set('profile', res.data.profile);
      go("/company");
    } else {
      show_alerta("Error al iniciar sesión, credenciales inválidas", "error");
    }
  };

  const logout = async () => {
    try {
      await sendRequest('POST', {}, '/users/logout', '', true);
      
      storage.remove("authToken");
      storage.remove("authUser");
      storage.remove("profile");
      setUsername("");
      setPassword("");
      show_alerta("Sesión cerrada con éxito", "success");
      go("/login");
    } catch (error) {
      show_alerta("No se pudo cerrar sesión", error);
    }
  };

  function validarContrasena(e) {
    setPassword(e.target.value);

    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&]{8,}$/;
    setContraMal(regex.test(e.target.value));
  }

  const authUser = storage.get("authUser");
  const authToken = storage.get("authToken");

  if (authUser && authToken) {
    return (
      <div className='container-fluid'>
        <div className="row mt-5">
          <div className='col-md-4 offset-md-4'>
            <div className='auth-container'>
              <div className='auth-header'>
                PERFIL
              </div>
              <div className='auth-body text-center'>
                <h5>{authUser.usuario}</h5>
                <p>{authUser.correo}</p>
                <span className={`role-badge role-${authUser.rol.toLowerCase()}`}>
                  {authUser.rol}
                </span>
                <div className="mt-3">
                  <button className='btn btn-logout profile-button' onClick={logout}>
                    <i className='fa-solid fa-sign-out-alt'></i> Cerrar Sesión
                  </button>
                  <Link to={`/users/edit/${authUser.id}`} className='btn btn-edit profile-button'>
                    <i className='fa-solid fa-user-pen'></i> Editar Perfil
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='container-fluid'>
      <div className="row mt-5">
        <div className='col-md-4 offset-md-4'>
          <div className='auth-container'>
            <div className='auth-header'>
              LOGIN
            </div>
            <div className='auth-body'>
              <form onSubmit={login}>
                <DivInput type='text' icon='fa-at' value={usuario} className='form-control' placeholder='Usuario...' required='required' handleChange={(e) => setUsername(e.target.value)} />
                <DivInput type='password' icon='fa-key' value={contrasena} className='form-control' placeholder='Contraseña...  ' required='required' handleChange={validarContrasena} />
                <p hidden={contraMal} className='text-danger'>
                  La contraseña debe contener al menos 8 caracteres, incluyendo una mayúscula, una minúscula, un número y un carácter especial.
                </p>
                <div className='d-grid col-10 mx-auto'>
                  <button className='auth-button'>
                    <i className='fa-solid fa-door-open'></i> Login
                  </button>
                </div>
              </form>
              <Link to='/register' className='register-link'>
                <i className='fa-solid fa-user-plus'></i> Registrarse
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
