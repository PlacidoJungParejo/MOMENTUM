import React, { useEffect, useState } from "react";
import DivAdd from "../../Components/DivAdd";
import DivTable from "../../Components/DivTable";
import { confirmation, sendRequest } from "../../functions";
import storage from "../../Storage/storage";
import { useNavigate, Link } from 'react-router-dom';

// Importar el CSS
import './styles/index.css';

const UsersIndex = () => {
  const [users, setUsers] = useState([]);
  const [classLoad, setClassLoad] = useState("");
  const [classTable, setClassTable] = useState("d-none");
  const go = useNavigate();

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    const res = await sendRequest("GET", "", "/users", "");
  
    if (res && Array.isArray(res)) {
      setUsers(res);
    } else {
      setUsers([]);
    }
    setClassTable("");
    setClassLoad("d-none");
  };
  
  const deleteUsers = (id, name) => {
    console.log("id", id);
    console.log("name", name);
    
    confirmation(name, "/users/" + id);
  };

  const idUser = storage.get("authUser").id;
  const rol = storage.get("authUser").rol;
  
  return (
    <div className="users-container">
      <div className="users-header">
        <div className="users-actions">
          <div className="action-item">
            <Link to="create" className="btn btn-dark">
              <i className="fa-solid fa-circle-plus"></i> Añadir
            </Link>
          </div>
        </div>
      </div>
      <DivTable col="6" off="0" classLoad={classLoad} classTable={classTable}>
        <table className="table users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Editar</th>
              <th>Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {users.map((usuario, i) => (
              <tr key={usuario.id}>
                <td>{i + 1}</td>
                <td>{usuario.usuario}</td>
                <td>{usuario.nombre}</td>
                <td>{usuario.correo}</td>
                <td>
                  <span className={`role-badge role-${usuario.rol.toLowerCase()}`}>
                    {usuario.rol}
                  </span>
                </td>
                <td>
                  {rol === "SUPERADMIN" || usuario.id === idUser ? (
                    <Link 
                      to={`/users/edit/${usuario.id}`} 
                      className="btn btn-edit action-button"
                    >
                      <i className="fa-solid fa-edit"></i>
                    </Link>
                  ) : (
                    <button className="btn btn-disabled action-button" disabled>
                      <i className="fa-solid fa-edit"></i>
                    </button>
                  )}
                </td>
                <td>
                  {rol === "SUPERADMIN" && usuario.rol !== "SUPERADMIN" ? (
                    <button 
                      className="btn btn-delete action-button"
                      onClick={() => deleteUsers(usuario.id, usuario.usuario)}
                    >
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
  );
};

export default UsersIndex;
