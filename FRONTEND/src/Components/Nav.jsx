import { Link } from 'react-router-dom';
import image from "./imgs/logo.png"
import "./styles/nav.css"
import storage from '../Storage/storage'
import { useState, useEffect } from 'react'

const Nav = () => {
  const [isLogged, setIsLogged] = useState(!!storage.get('authUser'))
  const [rol, setRol] = useState(storage.get("authUser")?.rol || null)

  useEffect(() => {
    const checkAuth = () => {
      const authUser = storage.get('authUser');
      setIsLogged(!!authUser);
      setRol(authUser?.rol || null);
    }

    window.addEventListener('authChange', checkAuth)
    window.addEventListener('storage', checkAuth)
    
    return () => {
      window.removeEventListener('authChange', checkAuth)
      window.removeEventListener('storage', checkAuth)
    }
  }, [])
  
  return (
    <nav className='navbar navbar-expand-lg navbar-white'>
      <div className='container-fluid'>
        <a className='navbar-brand'><img src={image} alt="MOMENTUM" /></a>
        <button className='navbar-toggler' type='button' data-bs-toggle='collapse' data-bs-target='#nav' aria-controls='navbarSupportedContent'>
          <span className='navbar-toggler-icon'></span>
        </button>
      </div>
      {isLogged ? (
        <div className='collapse navbar-collapse' id='nav'>
          <ul className='navbar-nav mx-auto mb-2'>
            <li className='nav-item px-lg-5'>
              <Link to='/task' className='nav-link'>Tasks</Link>
            </li>
          </ul>
        </div>
      ) : null}
      {rol === "ADMIN" || rol === "SUPERADMIN" ? (
        <div className='collapse navbar-collapse' id='nav'>
          <ul className='navbar-nav mx-auto mb-2'>
            <li className='nav-item px-lg-5'>
              <Link to='/users' className='nav-link'>Users</Link>
            </li>
          </ul>
        </div>
        ) : null
      }
      
      <div className='collapse navbar-collapse' id='nav'>
        <ul className='navbar-nav mx-auto mb-2'>
          <li className='nav-item px-lg-5'>
            <Link to='/login' className='nav-link'>{isLogged ? "Perfil" : "Login"}</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Nav;
