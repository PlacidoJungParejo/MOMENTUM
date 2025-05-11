import React, { useEffect, useState } from "react";
import DivAdd from "../../Components/DivAdd";
import DivTable from "../../Components/DivTable";
import { confirmation, sendRequest } from "../../functions";
import storage from "../../Storage/storage";
import { useNavigate, Link } from 'react-router-dom';
import './styles/index.css';

// ==========================================
// Funciones de utilidad / Helpers
// ==========================================
const formatDate = (dateString) => {
  if (!dateString) return "No establecida";
  const date = new Date(dateString);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${date.toLocaleDateString()} ${hours}:${minutes}`;
};

const getStatusClass = (estado) => {
  switch (estado.toLowerCase()) {
    case 'pendiente':
      return 'bg-warning text-dark';
    case 'en progreso':
      return 'bg-info text-white';
    case 'completada':
      return 'bg-success text-white';
    default:
      return 'bg-secondary text-white';
  }
};

const getPriorityClass = (prioridad) => {
  switch (prioridad.toLowerCase()) {
    case 'alta':
      return 'bg-danger text-white';
    case 'media':
      return 'bg-warning text-dark';
    default:
      return 'bg-secondary text-white';
  }
};

const parseEtiquetas = (etiquetas) => {
  if (!etiquetas) return [];
  if (Array.isArray(etiquetas)) return etiquetas;
  try {
    const parsed = JSON.parse(etiquetas);
    return typeof parsed === 'string' ? JSON.parse(parsed) : parsed;
  } catch (e) {
    console.error('Error parsing etiquetas:', e);
    return [];
  }
};

const parseListaId = (listaId) => {
  try {
    if (!listaId) return [];
    // Si ya es un array, lo devolvemos convertido a números
    if (Array.isArray(listaId)) {
      return listaId.map(id => parseInt(id));
    }
    // Si es string, intentamos parsearlo
    const parsed = JSON.parse(listaId);
    return Array.isArray(parsed) ? parsed.map(id => parseInt(id)) : [];
  } catch (error) {
    console.error('Error parsing lista_id:', error);
    return [];
  }
};

// ==========================================
// Componente principal
// ==========================================
const TasksIndex = () => {
  // ----------------------------------------
  // Estados (States)
  // ----------------------------------------
  const [tasks, setTasks] = useState([]);
  const [classLoad, setClassLoad] = useState("");
  const [classTable, setClassTable] = useState("d-none");
  const [selectedTask, setSelectedTask] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTag, setSelectedTag] = useState('');
  const [availableTags, setAvailableTags] = useState([]);
  const go = useNavigate();

  // ----------------------------------------
  // Efectos (Effects)
  // ----------------------------------------
  useEffect(() => {
    getTasks();
    getUsers();
  }, []);

  // ----------------------------------------
  // Funciones de manejo de datos
  // ----------------------------------------
  const updateAvailableTags = (tasks) => {
    const tags = new Set();
    tasks.forEach(task => {
      const taskTags = parseEtiquetas(task.etiquetas);
      taskTags.forEach(tag => tags.add(tag));
    });
    setAvailableTags(Array.from(tags));
  };

  const sortByPriority = (tasks) => {
    const priorityOrder = {
      'alta': 1,
      'media': 2,
      'baja': 3
    }

    return [...tasks].sort((a, b) => {
      return priorityOrder[a.prioridad.toLowerCase()] - priorityOrder[b.prioridad.toLowerCase()]
    })
  }

  // ----------------------------------------
  // Funciones de API
  // ----------------------------------------
  const getTasks = async () => {
    const res = await sendRequest("GET", "", "/tasks", "")

    if (res && Array.isArray(res)) {
      const filteredTasks = res.filter(task => 
        task.id_creador === userId || 
        (task.lista_id && parseListaId(task.lista_id).includes(userId)) || 
        rol === "ADMIN" || 
        rol === "SUPERADMIN" 
      );
      // Ordenar las tareas por prioridad
      const sortedTasks = sortByPriority(filteredTasks)
      setTasks(sortedTasks);
      updateAvailableTags(sortedTasks);
    } else {
      setTasks([]);
    }
    setClassTable("");
    setClassLoad("d-none");
  };
  
  const getUsers = async () => {
    const res = await sendRequest("GET", "", "/users", "");
    if (res) {
      setUsuarios(res);
    }
  };

  // ----------------------------------------
  // Manejadores de eventos
  // ----------------------------------------
  const deleteTasks = (id, title) => {
    confirmation(title, "/tasks/" + id);
  };

  const handleView = (task) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  // ----------------------------------------
  // Variables y constantes auxiliares
  // ----------------------------------------
  const userId = storage.get("authUser").id;
  const rol = storage.get("authUser").rol;

  // ----------------------------------------
  // Funciones de procesamiento de datos
  // ----------------------------------------
  const groupTasksByStatus = () => {
    const grouped = {
      pendiente: [],
      'en progreso': [],
      completada: []
    };

    tasks.forEach(task => {
      if (grouped.hasOwnProperty(task.estado.toLowerCase())) {
        const taskTags = parseEtiquetas(task.etiquetas);
        if (!selectedTag || taskTags.includes(selectedTag)) {
          grouped[task.estado.toLowerCase()].push(task);
        }
      }
    });

    return grouped;
  };
  
  // ----------------------------------------
  // Renderizado del componente
  // ----------------------------------------
  return (
    <div className="tasks-container">
      <div className="tasks-header">
        <div className="tasks-actions">
          <div className="action-item">
            <Link to="create" className="btn btn-dark">
              <i className="fa-solid fa-circle-plus"></i> Añadir
            </Link>
          </div>
          <div className="action-item">
            <label className="d-block">Filtrar por etiqueta:</label>
            <select 
              className="form-select" 
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
            >
              <option value="">Todas las etiquetas</option>
              {availableTags.map((tag, index) => (
                <option key={index} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {Object.entries(groupTasksByStatus()).map(([estado, tareas]) => (
        tareas.length > 0 && (
          <div key={estado} className="mb-4">
            <h4 className={`badge ${getStatusClass(estado)} p-2 mb-3`}>
              {estado.toUpperCase()} ({tareas.length})
            </h4>
            <DivTable col="12" off="0" classLoad={classLoad} classTable={classTable}>
              <table className="table tasks-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Título</th>
                    <th>Descripción</th>
                    <th>Prioridad</th>
                    <th>Fecha Creación</th>
                    <th>Fecha Finalización</th>
                    <th>Usuarios</th>
                    <th>Editar</th>
                    <th>Eliminar</th>
                  </tr>
                </thead>
                <tbody>
                  {tareas.map((task, i) => (
                    <tr key={task.id}>
                      <td>{i + 1}</td>
                      <td>{task.titulo}</td>
                      <td>{task.descripcion}</td>
                      <td>
                        <span className={`role-badge priority-${task.prioridad.toLowerCase()}`}>
                          {task.prioridad}
                        </span>
                      </td>
                      <td>{formatDate(task.fecha_creacion)}</td>
                      <td>{formatDate(task.fecha_finalizacion)}</td>
                      <td>
                        <button className="btn btn-info action-button" onClick={() => handleView(task)}>
                          <i className="fa-solid fa-eye"></i>
                        </button>
                      </td>
                      <td>
                        {task.id_creador === userId || rol === "ADMIN" || rol === "SUPERADMIN" ? (
                          <Link to={`/tasks/edit/${task.id}`} className="btn btn-edit action-button">
                            <i className="fa-solid fa-edit"></i>
                          </Link>
                        ) : (
                          <button className="btn btn-disabled action-button" disabled>
                            <i className="fa-solid fa-edit"></i>
                          </button>
                        )}
                      </td>
                      <td>
                        {task.id_creador === userId || rol === "SUPERADMIN" ? (
                          <button className="btn btn-delete action-button" onClick={() => deleteTasks(task.id, task.titulo)}>
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        ) : (
                          <button className="btn btn-disabled action-button" disabled>
                            <i className="fa-solid fa-x"></i>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </DivTable>
          </div>
        )
      ))}

      <div className={`modal fade ${showModal ? 'show' : ''}`} 
           style={{ display: showModal ? 'block' : 'none' }}
           tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header bg-dark text-white">
              <h5 className="modal-title">DETALLES DE LA TAREA</h5>
              <button type="button" className="btn-close btn-close-white" 
                      onClick={() => setShowModal(false)}></button>
            </div>
            {selectedTask && (
              <div className="modal-body">
                <h5>{selectedTask.titulo}</h5>
                <p>{selectedTask.descripcion}</p>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <strong>Estado: </strong>
                    <span className={`badge ${getStatusClass(selectedTask.estado)}`}>
                      {selectedTask.estado}
                    </span>
                  </div>
                  <div className="col-md-6">
                    <strong>Prioridad: </strong>
                    <span className={`badge ${getPriorityClass(selectedTask.prioridad)}`}>
                      {selectedTask.prioridad}
                    </span>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <strong>Fecha Creación: </strong>
                    {formatDate(selectedTask.fecha_creacion)}
                  </div>
                  <div className="col-md-6">
                    <strong>Fecha Finalización: </strong>
                    {formatDate(selectedTask.fecha_finalizacion)}
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-12">
                    <strong>Etiquetas: </strong>
                    {(() => {
                      const etiquetas = parseEtiquetas(selectedTask.etiquetas);
                      return etiquetas.length > 0 ? (
                        etiquetas.map((etiqueta, index) => (
                          <span key={index} className="badge bg-secondary me-1">
                            {etiqueta}
                          </span>
                        ))
                      ) : (
                        <span className="text-muted">Sin etiquetas</span>
                      );
                    })()}
                  </div>
                </div>
                <hr/>
                <h6>Usuarios con acceso:</h6>
                <div className="list-group">
                  {usuarios
                    .filter(usuario => 
                      selectedTask.id_creador === usuario.id || 
                      (selectedTask.lista_id && selectedTask.lista_id.includes(usuario.id))
                    )
                    .map(usuario => (
                      <div key={usuario.id} className="list-group-item">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <strong>{usuario.nombre}</strong> ({usuario.usuario})
                            {selectedTask.id_creador === usuario.id && 
                              <span className="badge bg-primary ms-2">Creador</span>
                            }
                          </div>
                          <span className="badge bg-secondary">{usuario.rol}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {showModal && <div className="modal-backdrop fade show"></div>}
    </div>
  );
};

export default TasksIndex;