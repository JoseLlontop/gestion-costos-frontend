// Estilos 
import "bootstrap/dist/css/bootstrap.min.css"
import "@fortawesome/fontawesome-free/css/all.min.css"
import "bootstrap/dist/js/bootstrap.bundle"
import 'postcss';
import { ModalNuevaReceta } from '../components';
import { useEffect, useState } from 'react';
import { useApiRequest } from '../hook/useApiRequest'; 

const GestionRecetas = () => {

    const [recetas, setRecetas] = useState([]);
    const [nombreRecetaBuscada, setNombreRecetaBuscada] = useState(""); // Estado para almacenar el nombre de la receta que el usuario busca

    const { data, isLoading, error } = useApiRequest(`${import.meta.env.VITE_BACKEND_API_URL}:${import.meta.env.VITE_BACKEND_API_PORT}/api/recetas`, 'GET');
    
    useEffect(() => {
        if (!isLoading && !error) {
        setRecetas(data); 
          console.log(data);
        }
      }, [data, isLoading, error]);

    // Filtrar las recetas si el usuario ha escrito algo en el campo de búsqueda
    const recetasFiltradas = recetas.filter(receta =>
        receta.nombreReceta.toLowerCase().includes(nombreRecetaBuscada.toLowerCase())
    );


    return (
       
        <div className='gestionRecetas my-5'>
          <div className='container-fluid'>
            <div className='row mt-3'>
              <div className='col-md-4 offset-md-4'>
                <div className='d-grid mx-auto mt-6'>
                  <button className='btn btn-dark' data-bs-toggle="modal" data-bs-target="#modalRecetas">
                    <i className='fa-solid fa-circle-plus'></i> Añadir Receta
                  </button>
                  <ModalNuevaReceta />
                </div>
              </div>
            </div>

            <div className='row mt-3'>
              <div className='col-12 col-lg-8 offset-lg-2'>

                {/* Campo de búsqueda */}
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Buscar receta por nombre"
                  value={nombreRecetaBuscada} // Vincular el valor del input con el estado
                  onChange={(e) => setNombreRecetaBuscada(e.target.value)} // Actualizar el nombre buscado
                />

    
                <div className='table-responsive'>
                  <table className='table table-bordered'>
                    {/* Encabezado de la tabla */}
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Receta</th>
                        <th>Descripcion</th>
                        <th>Cantidad de porciones</th>
                      </tr>
                    </thead>

                    {/* Cuerpo de la tabla */}
                    <tbody className='table-group-divider'>
                      {recetasFiltradas.length > 0 ? (
                        recetasFiltradas.map((receta, i) => (
                          <tr key={receta.id}>
                            <td>{(i + 1)}</td>
                            <td>{receta.nombreReceta}</td>
                            <td>{receta.descripcion}</td>
                            <td>{receta.cantidadPorciones}</td>

                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className='text-center'>No se encontraron recetas</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Mostrar mensaje si no hay recetas */}
            {recetas.length === 0 && !isLoading && !error && (
              <div className='row'>
                <div className='col-12 text-center'>
                  <div className="alert alert-info d-flex align-items-center justify-content-center mt-3" role="alert" style={{ backgroundColor: '#f8f9fa', border: '1px solid #b0bec5' }}>
                    <i className="fa-solid fa-info-circle me-2"></i>
                    <span>No hay recetas cargadas todavía. ¡Empieza añadiendo un nueva receta!</span>
                  </div>
                </div>
              </div>
            )}

          </div>    
        </div>
      )
}

export default GestionRecetas;