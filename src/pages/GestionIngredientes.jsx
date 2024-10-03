// Estilos 
import "bootstrap/dist/css/bootstrap.min.css"
import "@fortawesome/fontawesome-free/css/all.min.css"
import "bootstrap/dist/js/bootstrap.bundle"
import 'postcss';

import { useEffect, useState } from 'react';
import { useApiRequest } from '../hook/useApiRequest';

const GestionIngredientes = () => {

    const [ingredientes, setIngredientes] = useState([]);
    const [nombreIngredienteBuscado, setNombreIngredienteBuscado] = useState(""); // Estado para almacenar el nombre del ingrediente que el usuario busca

    const { data, isLoading, error } = useApiRequest(`${import.meta.env.VITE_BACKEND_API_URL}:${import.meta.env.VITE_BACKEND_API_PORT}/api/ingredientes/`, 'GET');
    const [id, setId] = useState("");
    const [nombre, setNombre] = useState("");
    const [marca, setMarca] = useState("");
    const [precio, setPrecio] = useState("");
    const [unidad_medida, setUnidadMedida] = useState("");
    const [cantidad_paquete, setCantidadPaquete] = useState("");

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

    return (
        <div className='gestionIngrdientes my-5'>
          <div className='container-fluid'>

            <div className='row mt-3'>
              <div className='col-md-4 offset-md-4'>
                <div className='d-grid mx-auto mt-6'>
                  <button className='btn btn-dark' data-bs-toggle="modal" data-bs-target="#modalIngredientes">
                    <i className='fa-solid fa-circle-plus'></i> Añadir Ingrediente
                  </button>
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
          
            <div id='modalIngredientes' className='modal fade' aria-hidden='true'>
              <div className='modal-dialog'>
                <div className='modal-content'>
                  <div className='modal-header'>
                    <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='close'></button>
                  </div>
                  <div className='modal-body'>
                    <input type='hidden' id='id'></input>

                    <div className='input-group mb-3'>
                      <span className='input-group-text'><i className='fa-solid fa-comment'></i></span>
                      <input
                        type='text'
                        id='nombre'
                        className='form-control'
                        placeholder='Nombre'
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                      ></input>
                    </div>

                    <div className='input-group mb-3'>
                      <span className='input-group-text'><i className='fa-solid fa-comment'></i></span>
                      <input
                        type='text'
                        id='marca'
                        className='form-control'
                        placeholder='Marca'
                        value={marca}
                        onChange={(e) => setMarca(e.target.value)}
                      ></input>
                    </div>

                    <div className='input-group mb-3'>
                      <span className='input-group-text'><i className='fa-solid fa-dollar'></i></span>
                      <input
                        type='text'
                        id='precio'
                        className='form-control'
                        placeholder='Precio'
                        value={precio}
                        onChange={(e) => setPrecio(e.target.value)}
                      ></input>
                    </div>

                    <div className='input-group mb-3'>
                      <span className='input-group-text'><i className='fa-solid fa-comment'></i></span>
                      <input
                        type='text'
                        id='unidad_medida'
                        className='form-control'
                        placeholder='Unidad medida'
                        value={unidad_medida}
                        onChange={(e) => setUnidadMedida(e.target.value)}
                      ></input>
                    </div>

                    <div className='input-group mb-3'>
                      <span className='input-group-text'><i className='fa-solid fa-comment'></i></span>
                      <input
                        type='text'
                        id='cantidad_paquete'
                        className='form-control'
                        placeholder='Cantidad paquete'
                        value={cantidad_paquete}
                        onChange={(e) => setCantidadPaquete(e.target.value)}
                      ></input>
                    </div>

                    <div className='d-grid col-e mx-auto'>
                      <button className='btn btn-success'>
                        <i className='fa-solid fa-floppy-disk'></i>&nbsp;&nbsp;Guardar
                      </button>
                    </div>
                  </div>
                  <div className='modal-footer'>
                    <button
                      type='button'
                      id='btncerrar'
                      className='btn btn-secondary'
                      data-bs-dismiss='modal'
                      style={{ backgroundColor: 'gray' }}>Cerrar
                    </button>
                  </div>
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