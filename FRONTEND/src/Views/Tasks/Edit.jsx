import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { sendRequest } from '../../functions'
import storage from '../../Storage/storage'
import DivInput from '../../Components/DivInput'
import DivSelect from '../../Components/DivSelect'
import './styles/edit.css';

const TasksEdit = () => {
  // -------------------------------
  // Estados del componente
  // -------------------------------
  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [estado, setEstado] = useState('pendiente')
  const [prioridad, setPrioridad] = useState('media')
  const [fecha_finalizacion, setFechaFinalizacion] = useState('')
  const [usuarios, setUsuarios] = useState([])
  const [listaUsuarios, setListaUsuarios] = useState([])
  const [etiquetas, setEtiquetas] = useState([])
  const [nuevaEtiqueta, setNuevaEtiqueta] = useState('')
  const [selectedUser, setSelectedUser] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTask, setSelectedTask] = useState(null)
  // -------------------------------
  // Hooks y variables de navegación
  // -------------------------------
  const userId = storage.get("authUser").id
  const { id } = useParams()
  const go = useNavigate()

  // -------------------------------
  // Efectos y carga inicial de datos
  // -------------------------------
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setIsLoading(true)
        await getUsers()
        const res = await sendRequest('GET', '', `/tasks/${id}`, '')
        
        if (res && res[0]) {
          const tarea = res[0]
          setSelectedTask(tarea)

          // Datos básicos de la tarea
          setTitulo(tarea.titulo || '')
          setDescripcion(tarea.descripcion || '')
          setEstado(tarea.estado || 'pendiente')
          setPrioridad(tarea.prioridad || 'media')
          setFechaFinalizacion(tarea.fecha_finalizacion?.slice(0, 16) || '')
          
          // Procesar lista de usuarios asignados
          try {
            const listaUsuarios = JSON.parse(tarea.lista_id || '[]')
            setListaUsuarios(listaUsuarios.map(id => parseInt(id)))
          } catch (error) {
            setListaUsuarios([])
          }

          // Procesar etiquetas de la tarea
          try {
            let etiquetas = tarea.etiquetas
            if (typeof etiquetas === 'string') {
              etiquetas = JSON.parse(etiquetas)
              if (typeof etiquetas === 'string') {
                etiquetas = JSON.parse(etiquetas)
              }
            }
            setEtiquetas(Array.isArray(etiquetas) ? etiquetas : [])
          } catch (error) {
            setEtiquetas([])
          }
        }
      } catch (error) {
        // Manejo silencioso de errores
      } finally {
        setIsLoading(false)
      }
    }

    cargarDatos()
  }, [id])

  // -------------------------------
  // Funciones auxiliares
  // -------------------------------
  const getUsers = async () => {
    const res = await sendRequest('GET', '', '/users', '')
    if (res) {
      const usuariosFiltrados = res.filter(user => user.id !== userId)
      setUsuarios(usuariosFiltrados)
    }
  }

  const getUserName = (userId) => {
    const user = usuarios.find(u => u.id === userId)
    return user ? `${user.nombre} (${user.usuario}) - ${user.rol}` : ''
  }

  // -------------------------------
  // Manejadores de eventos de usuarios
  // -------------------------------
  const handleUserSelect = (e) => {
    const selectedUsers = Array.from(e.target.selectedOptions, option => parseInt(option.value))
    setListaUsuarios(selectedUsers)
  }

  const handleAddUser = (e) => {
    e.preventDefault()
    if (selectedUser && !listaUsuarios.includes(parseInt(selectedUser))) {
      setListaUsuarios([...listaUsuarios, parseInt(selectedUser)])
    }
    setSelectedUser('') 
  }

  const handleRemoveUser = (userId) => {
    setListaUsuarios(listaUsuarios.filter(id => id !== userId))
  }

  // -------------------------------
  // Manejadores de eventos de etiquetas
  // -------------------------------
  const handleAddTag = (e) => {
    e.preventDefault()
    if (nuevaEtiqueta.trim()) {
      setEtiquetas([...etiquetas, nuevaEtiqueta.trim()])
      setNuevaEtiqueta('')
    }
  }

  const handleRemoveTag = (indexToRemove) => {
    setEtiquetas(etiquetas.filter((_, index) => index !== indexToRemove))
  }

  // -------------------------------
  // Función principal de actualización
  // -------------------------------
  const updateTask = async (e) => {
    e.preventDefault()
    
    const formattedListaId = JSON.stringify(listaUsuarios || [])
    const formattedEtiquetas = JSON.stringify(etiquetas || [])

    const form = {
      titulo,
      descripcion,
      estado,
      prioridad,
      fecha_finalizacion,
      id_creador: selectedTask?.id_creador,
      lista_id: formattedListaId,
      etiquetas: formattedEtiquetas
    }

    try {
      const res = await sendRequest(
        'PATCH',
        form, 
        `/tasks/${id}`, 
        '/tasks', 
        true, 
        "Tarea Actualizada Correctamente"
      )
      if (res) {
        go('/tasks')
      }
    } catch (error) {
      console.error('Error actualizando tarea:', error)
    }
  }

  // -------------------------------
  // Datos de opciones para selects
  // -------------------------------
  const estadoOptions = [
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'en progreso', label: 'En Progreso' },
    { value: 'completada', label: 'Completada' }
  ]

  const prioridadOptions = [
    { value: 'alta', label: 'Alta' },
    { value: 'media', label: 'Media' },
    { value: 'baja', label: 'Baja' }
  ]

  // -------------------------------
  // Renderizado del componente
  // -------------------------------
  return (
    <div className='container-fluid'>
      <div className="row mt-5">
        <div className='col-md-4 offset-md-4'>
          <div className='card border border-dark'>
            <div className='card-header bg-dark border boder-dark text-white'>
              EDITAR TAREA
            </div>
            <div className='card-body'>
              <div className="edit-form-container">
                <div className="edit-form-header">
                  <h4>EDITAR TAREA</h4>
                </div>
                {isLoading ? (
                  <div className="loading-overlay">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Cargando...</span>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={updateTask}>
                    <DivInput 
                      type='text'
                      icon='fa-tasks'
                      value={titulo}
                      className='form-control'
                      placeholder='Título'
                      required='required'
                      handleChange={(e) => setTitulo(e.target.value)}
                    />
                    <DivInput 
                      type='textarea'
                      icon='fa-align-left'
                      value={descripcion}
                      className='form-control'
                      placeholder='Descripción'
                      required='required'
                      handleChange={(e) => setDescripcion(e.target.value)}
                    />
                    <DivSelect
                      icon='fa-list-check'
                      value={estado}
                      className='form-control'
                      placeholder='Estado'
                      required='required'
                      handleChange={(e) => setEstado(e.target.value)}
                      options={estadoOptions}
                    />
                    <DivSelect
                      icon='fa-flag'
                      value={prioridad}
                      className='form-control'
                      placeholder='Prioridad'
                      required='required'
                      handleChange={(e) => setPrioridad(e.target.value)}
                      options={prioridadOptions}
                    />
                    <DivInput 
                      type='datetime-local'
                      icon='fa-calendar'
                      value={fecha_finalizacion}
                      className='form-control'
                      placeholder='Fecha de Finalización'
                      handleChange={(e) => setFechaFinalizacion(e.target.value)}
                    />
                    <div className="mb-3">
                      <label className="form-label">
                        <i className="fa-solid fa-users me-2"></i>
                        Usuarios con acceso
                      </label>
                      <div className="input-group">
                        <select 
                          className="form-select" 
                          value={selectedUser}
                          onChange={(e) => setSelectedUser(e.target.value)}
                        >
                          <option value="">Seleccionar usuario</option>
                          {usuarios
                            .filter(user => !listaUsuarios.includes(user.id))
                            .map(usuario => (
                              <option key={usuario.id} value={usuario.id}>
                                {usuario.nombre} ({usuario.usuario}) - {usuario.rol}
                              </option>
                            ))}
                        </select>
                        <button 
                          className="btn btn-outline-dark" 
                          onClick={handleAddUser}
                          type="button"
                        >
                          <i className="fa-solid fa-plus"></i>
                        </button>
                      </div>
                      <div className="mt-2">
                        {listaUsuarios.map((userId) => (
                          <span 
                            key={userId} 
                            className="user-badge"
                            onClick={() => handleRemoveUser(userId)}
                          >
                            {getUserName(userId)} <i className="fa-solid fa-times"></i>
                          </span>
                        ))}
                      </div>
                      <div className="form-text">
                        Haz clic en un usuario para eliminarlo de la lista
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">
                        <i className="fa-solid fa-tags me-2"></i>
                        Etiquetas
                      </label>
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          value={nuevaEtiqueta}
                          onChange={(e) => setNuevaEtiqueta(e.target.value)}
                          placeholder="Añadir etiqueta"
                        />
                        <button 
                          className="btn btn-outline-dark" 
                          onClick={handleAddTag}
                          type="button"
                        >
                          <i className="fa-solid fa-plus"></i>
                        </button>
                      </div>
                      <div className="mt-2">
                        {etiquetas.map((etiqueta, index) => (
                          <span 
                            key={index} 
                            className="tag-badge"
                            onClick={() => handleRemoveTag(index)}
                          >
                            {etiqueta} <i className="fa-solid fa-times"></i>
                          </span>
                        ))}
                      </div>
                    </div>
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
      </div>
    </div>
  )
}

export default TasksEdit