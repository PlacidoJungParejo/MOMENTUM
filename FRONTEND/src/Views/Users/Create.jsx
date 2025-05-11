import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { sendRequest } from '../../functions'
import storage from '../../Storage/storage'
import DivInput from '../../Components/DivInput'
import DivSelect from '../../Components/DivSelect'
import './styles/create.css';

const UsersCreate = () => {
  const [usuario, setUsername] = useState('')
  const [contrasena, setPassword] = useState('')
  const [correo, setEmail] = useState('')
  const [nombre, setName] = useState('')
  const [contraMal, setContraMal] = useState(true)
  const [userRol, setUserRol] = useState('USER') // Añadido estado para el rol
  const currentUserRol = storage.get("authUser").rol;
  const go = useNavigate()

  const createUser = async (e) => {
    e.preventDefault()
    const form = { 
      usuario: usuario, 
      contrasena: contrasena, 
      correo: correo, 
      nombre: nombre,
      rol: userRol // Usar el rol del estado
    }
    const res = await sendRequest('POST', form, '/users/register', '/users', true, "Usuario Creado Correctamente")
    if (res) {
      go('/users')
    }
  }

  function validarContrasena(e) {
    setPassword(e.target.value)
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&]{8,}$/
    if(regex.test(e.target.value)){
      setContraMal(true)
    }else{
      e.preventDefault()
      setContraMal(false)
    }
  }

  if (currentUserRol !== "SUPERADMIN" && currentUserRol !== "ADMIN") {
    go('/tasks')
  }
  const rolOptions = [
    { value: 'USER', label: 'Usuario' },
    { value: 'ADMIN', label: 'Administrador' }
  ]

  return (
    <div className='container-fluid'>
      <div className="row mt-5">
        <div className='col-md-4 offset-md-4'>
          <div className='create-form-container'>
            <div className='create-form-header'>
              <h4>CREAR USUARIO</h4>
            </div>
            <div className='card-body'>
              <form onSubmit={createUser}>
                <DivInput 
                  type='text' 
                  icon='fa-user' 
                  value={usuario} 
                  className='form-control' 
                  placeholder='Usuario' 
                  required='required' 
                  handleChange={(e) => setUsername(e.target.value)} 
                />
                <DivInput 
                  type='text' 
                  icon='fa-user' 
                  value={nombre} 
                  className='form-control' 
                  placeholder='Nombre' 
                  required='required' 
                  handleChange={(e) => setName(e.target.value)} 
                />
                <DivInput 
                  type='email' 
                  icon='fa-at' 
                  value={correo} 
                  className='form-control' 
                  placeholder='Correo' 
                  required='required' 
                  handleChange={(e) => setEmail(e.target.value)} 
                />
                <DivInput 
                  type='password' 
                  icon='fa-key' 
                  value={contrasena} 
                  className='form-control' 
                  placeholder='Contraseña' 
                  required='required' 
                  handleChange={(e) => validarContrasena(e)} 
                />
                <p className='text-danger' hidden={contraMal}>
                  La contraseña debe contener al menos 8 carácteres y al menos 1 mayúscula, 
                  1 minúscula, 1 número y 1 carácter especial
                </p>
                {currentUserRol == "SUPERADMIN" ? (
                <DivSelect
                  icon='fa-user-shield'
                  value={userRol}
                  className='form-control'
                  placeholder='Seleccione un rol'
                  required='required'
                  handleChange={(e) => setUserRol(e.target.value)}
                  options={rolOptions}
                />) : null}
                <div className='d-grid col-10 mx-auto'>
                  <button className='btn btn-dark'>
                    <i className='fa-solid fa-circle-plus'></i> Crear Usuario
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UsersCreate