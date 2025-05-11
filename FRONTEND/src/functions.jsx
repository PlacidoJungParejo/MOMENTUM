import Swal from "sweetalert2";
import storage from './Storage/storage'
import axios from "axios";

export const show_alerta = (msj,icon) =>{
    Swal.fire({title:msj, icon:icon})
}

export const sendRequest = async (method, params, url, redir = '', token = true, mensaje = '') => {
    let res;
    try {
        if (token) {
            const authToken = storage.get('authToken');  // Obtener el token desde el almacenamiento
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + authToken;  // Asegúrate de que el token esté bien formateado
        }

        // Realiza la solicitud
        const response = await axios({
            method: method,
            url: url,
            data: params,
        });
        

        console.log("Mensaje" ,mensaje);

        res = response.data;
        if (method !== 'GET') {
            show_alerta(mensaje, 'success');
        }

        // Redirige si es necesario
        setTimeout(() => {
            if (redir !== '') {
                window.location.href = redir;
            }
        }, 2000);

    } catch (errors) {
        // Si la URL es la de empresas y ocurre un error, retornamos un objeto con empresas vacías
        if (
            url &&
             errors.response &&
            errors.response.status === 400
           ) {
            res = { empresas: [] };
            return res;
          }
        let desc = '';
        res = errors.response.data;
    
        // Verifica si `errors.response.data.errors` es un array antes de llamar a `.map()`
        if (Array.isArray(errors.response.data.errors)) {
            errors.response.data.errors.forEach((e) => {
                desc = desc + ' ' + e;
            });
        } else {
            // Si no es un array, agrega un mensaje de error genérico
            desc = 'Error desconocido o formato de error inesperado.';
        }
    
        show_alerta(desc, 'error');
    }
    
    return res;
};

export const confirmation = (name, url, redir) => {
    return new Promise((resolve) => {
        const alert = Swal.mixin({ buttonStyling: true });
        alert.fire({
            title: 'Estás seguro de eliminar ' + name + ' ?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: '<i class="fa-solid fa-check"></i> Si, eliminar',
            cancelButtonText: '<i class="fa-solid fa-ban"></i> Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                console.log(url);
                
                sendRequest('DELETE', {}, url, redir);
                window.location.reload();
                resolve(true);  // Devuelve true si el usuario confirma
            } else {
                resolve(false); // Devuelve false si el usuario cancela
            }
        });
    });
};


export default show_alerta;