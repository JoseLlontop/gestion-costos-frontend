// Estilos 
import "bootstrap/dist/css/bootstrap.min.css"
import "@fortawesome/fontawesome-free/css/all.min.css"
import "bootstrap/dist/js/bootstrap.bundle"
import 'postcss';
import { ModalNuevoIngrediente } from '../components';
import { useEffect, useState } from 'react';
import { useApiRequest } from '../hook/useApiRequest';
import { show_alerta } from '../helpers/funcionSweetAlert'


const GestionIngredientes = () => {

    const [ingredientes, setIngredientes] = useState([]);
    const [nombreIngredienteBuscado, setNombreIngredienteBuscado] = useState(""); // Estado para almacenar el nombre del ingrediente que el usuario busca

    const { data, isLoading, error } = useApiRequest(`${import.meta.env.VITE_BACKEND_API_URL}:${import.meta.env.VITE_BACKEND_API_PORT}/api/ingredientes/`, 'GET');

    useEffect(() => {
      if (!isLoading && !error) {
        setIngredientes(data); // Guardamos los datos cuando se complete la carga
        console.log(data);
      }
    }, [data, isLoading, error]);  

    // Filtrar los ingredientes si el usuario ha escrito algo en el campo de búsqueda
    const ingredientesFiltrados = ingredientes.filter(ingrediente =>
      ingrediente.nombre.toLowerCase().includes(nombreIngredienteBuscado.toLowerCase())
    );

    const handleSaveIngrediente = async (nuevoIngrediente) => {
      try {
          const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}:${import.meta.env.VITE_BACKEND_API_PORT}/api/ingredientes/crear`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(nuevoIngrediente)
          });

          if (!response.ok) {
              throw new Error('Error al guardar el ingrediente');
          }else{
            show_alerta('Ingrediente guardado', 'success');
          }

          // Actualiza la lista de ingredientes después de agregar el nuevo ingrediente
          const ingredienteAgregado = await response.json();
          setIngredientes([...ingredientes, ingredienteAgregado]);
      } catch (error) {
          console.error('Error de conexión', error);
      }
    };

    return (
        <div className='gestionIngredientes my-5'>
          <div className='container-fluid'>
            <div className='row mt-3'>
              <div className='col-md-4 offset-md-4'>
                <div className='d-grid mx-auto mt-6'>
                  <button className='btn btn-dark' data-bs-toggle="modal" data-bs-target="#modalIngredientes">
                    <i className='fa-solid fa-circle-plus'></i> Añadir Ingrediente
                  </button>
                  <ModalNuevoIngrediente onSave={handleSaveIngrediente}/>
                </div>
              </div>
            </div>

            <div className='row mt-3'>
              <div className='col-12 col-lg-8 offset-lg-2'>

                {/* Campo de búsqueda */}
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Buscar ingrediente por nombre"
                  value={nombreIngredienteBuscado} // Vincular el valor del input con el estado
                  onChange={(e) => setNombreIngredienteBuscado(e.target.value)} // Actualizar el nombre buscado
                />

                <div className='table-responsive'>
                  <table className='table table-bordered'>
                    {/* Encabezado de la tabla */}
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Ingrediente</th>
                        <th>Cantidad</th>
                        <th>Unidad Medida</th>
                        <th>Precio</th>
                        <th>Marca</th>
                        <th></th>
                      </tr>
                    </thead>

                    {/* Cuerpo de la tabla */}
                    <tbody className='table-group-divider'>
                      {ingredientesFiltrados.length > 0 ? (
                        ingredientesFiltrados.map((ingrediente, i) => (
                          <tr key={ingrediente.id}>
                            <td>{(i + 1)}</td>
                            <td>{ingrediente.nombre}</td>
                            <td>{ingrediente.cantidad_paquete}</td>
                            <td>{ingrediente.unidad_medida}</td>
                            <td>${new Intl.NumberFormat("es-mx").format(ingrediente.precio)}</td>
                            <td>{ingrediente.marca}</td>
                            
                            <td className='d-flex align-items-center'>                             
                              {/* Editar */}
                              <button 
                                className='btn btn-warning me-2' data-bs-toggle='modal' data-bs-target='#modalIngredientes'>
                                <i className='fa-solid fa-edit'></i>
                              </button>
                              {/* Eliminar */}
                              <button className='btn btn-danger'>
                                <i className='fa-solid fa-trash'></i>
                              </button>
                            </td>

                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className='text-center'>No se encontraron ingredientes con ese nombre.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Mostrar mensaje si no hay ingredientes */}
            {ingredientes.length === 0 && !isLoading && !error && (
              <div className='row'>
                <div className='col-12 text-center'>
                  <div className="alert alert-info d-flex align-items-center justify-content-center mt-3" role="alert" style={{ backgroundColor: '#f8f9fa', border: '1px solid #b0bec5' }}>
                    <i className="fa-solid fa-info-circle me-2"></i>
                    <span>No hay ingrediente cargados todavía. ¡Empieza añadiendo un nuevo ingrediente!</span>
                  </div>
                </div>
              </div>
            )}
        
          </div>    
        </div>
      )
}

export default GestionIngredientes;