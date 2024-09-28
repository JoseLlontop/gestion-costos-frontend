// Estilos
import "bootstrap/dist/css/bootstrap.min.css"
import "@fortawesome/fontawesome-free/css/all.min.css"
import "bootstrap/dist/js/bootstrap.bundle"
import 'postcss';

import { useEffect, useState } from 'react';
import { useApiRequest } from '../hook/useApiRequest'; 

const GestionIngredientes = () => {

    const [ingredientes, setIngredientes] = useState([])

    const { data, isLoading, error } = useApiRequest('http://localhost:8080/api/ingredientes', 'GET');

    useEffect(() => {
      if (!isLoading && !error) {
        setIngredientes(data); // Guardamos los datos cuando se complete la carga
        console.log(data);
      }
    }, [data, isLoading, error]);

    return (
        <div className='gestionIngrdientes my-5'>
          <div className='container-fluid'>
            <div className='row mt-3'>
              <div className='col-md-4 offset-md-4'>
                <div className='d-grid mx-auto mt-6'>
                  <button className='btn btn-dark' data-bs-toggle="modal" data-bs-target="#modalIngredientes">
                    <i className='fa-solid fa-circle-plus'></i> Añadir
                  </button>
                </div>
              </div>
            </div>
            <div className='row mt-3'>
              <div className='col-12 col-lg-8 offset-lg-2'>
                <div className='table-responsive'>
                  {/* Corregir la etiqueta de apertura de la tabla */}
                  <table className='table table-bordered'>
                    {/* Encabezado de la tabla */}
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Ingrediente</th>
                        <th>Cantidad</th>
                        <th>Unidad Medida</th>
                        <th>Precio</th>
                        <th></th>
                      </tr>
                    </thead>
                    {/* Cuerpo de la tabla */}
                    <tbody className='table-group-divider'>
                      {ingredientes.map((ingredientes, i) => (
                        <tr key={ingredientes.id}>
                          <td>{(i + 1)}</td>
                          <td>{ingredientes.nombre}</td>
                          <td>{ingredientes.cantidad}</td>
                          <td>{ingredientes.unidad_medida}</td>
                          <td>${new Intl.NumberFormat("es-mx").format(ingredientes.precio)}</td>
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
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>    
        </div>
      )
}

export default GestionIngredientes;