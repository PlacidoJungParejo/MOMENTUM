import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { sendRequest } from '../../functions'
import storage from '../../Storage/storage'
import DivInput from '../../Components/DivInput'
import DivSelect from '../../Components/DivSelect'
import './styles/edit.css';

const UsersEdit = () => {
  const { id } = useParams()
  const [usuario, setUsername] = useState('')
  const [contrasena, setPassword] = useState('')
  const [correo, setEmail] = useState('')
  const [nombre, setName] = useState('')
  const [rol, setRol] = useState('')
  const [contraMal, setContraMal] = useState(true)
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const go = useNavigate()

  useEffect(() => {
    const getUser = async () => {
      const res = await sendRequest('GET', '', `/users/${id}`, '', false)
      console.log("res: ", res);
      
      if (res) {
        setUsername(res[0].usuario)
        setEmail(res[0].correo)
        setName(res[0].nombre)
        setRol(res[0].rol)
      }
      setIsLoading(false)
    }
    const user = storage.get('authUser')
    setIsSuperAdmin(user?.rol === 'SUPERADMIN')
    getUser()
  }, [id])

  const editUser = async (e) => {
    e.preventDefault()
    const form = {
      usuario: usuario,
      correo: correo,
      nombre: nombre,
      rol: rol
    }
    if (contrasena) {
      form.contrasena = contrasena
    }
    
    const res = await sendRequest('PATCH', form, `/users/${id}`, '/users', true, "Usuario Actualizado Correctamente")
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

  const rolOptions = [
    { value: 'USER', label: 'Usuario' },
    { value: 'ADMIN', label: 'Administrador' }
  ]

  return (
    <div className='container-fluid'>
      <div className="row mt-5">
        <div className='col-md-4 offset-md-4'>
          <div className='edit-form-container'>
            <div className='edit-form-header'>
              <h4>EDITAR USUARIO</h4>
            </div>
            {isLoading ? (
              <div className="loading-overlay">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
              </div>
            ) : (
              <form onSubmit={editUser}>
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
                  placeholder='Contraseña (dejar vacío si no cambia)' 
                  handleChange={(e) => validarContrasena(e)} 
                />
                {contrasena && (
                  <p className='text-danger' hidden={contraMal}>
                    La contraseña debe contener al menos 8 carácteres y al menos 1 mayúscula, 
                    1 minúscula, 1 número y 1 carácter especial
                  </p>
                )}
                {rol !== "SUPERADMIN" && isSuperAdmin && (
                  <DivSelect
                    icon='fa-user-shield'
                    value={rol}
                    className='form-control'
                    placeholder='Seleccione un rol'
                    required='required'
                    handleChange={(e) => setRol(e.target.value)}
                    options={rolOptions}
                  />
                )}
                <div className='d-grid col-10 mx-auto'>
                  <button className='submit-button'>
                    <i className='fa-solid fa-save me-2'></i>
                    Actualizar
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UsersEdit