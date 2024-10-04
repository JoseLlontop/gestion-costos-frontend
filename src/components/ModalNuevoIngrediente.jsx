import "bootstrap/dist/css/bootstrap.min.css";

import { useEffect, useState } from "react";
import { useApiRequest } from "../hook/useApiRequest";

const ModalNuevoIngrediente = () => {
    const [nombre, setNombre] = useState([]);
    const [marca, setMarca] = useState([]);
    const [precio, setPrecio] = useState([]);
    const [unidad_medida, setUnidadMedida] = useState([]);
    const [cantidad_paquete, setCantidadPaquete] = useState([]);
    return (
        <div className='modal fade' aria-hidden='true'>
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
    );
};

export default ModalNuevoIngrediente;