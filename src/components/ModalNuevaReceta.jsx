// Estilos
import "bootstrap/dist/css/bootstrap.min.css";

import { useEffect, useState } from "react";
import { useApiRequest } from "../hook/useApiRequest";

const ModalNuevaReceta = () => {
    const [nombre, setNombre] = useState([]);
    const [descripcion, setDescripcion] = useState([]);
    const [porcionesRinde, setPorcionesRinde] = useState([]);
    return (
        <div
            className="modal fade"
            id="modalRecetas"
            tabIndex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="close"
                        ></button>
                    </div>
                    <div className="modal-body">
                        <div className="input-group mb-3">
                            <span className="input-group-text">
                                <i className="fa-solid fa-comment"></i>
                            </span>
                            <input
                                type="text"
                                id="nombreReceta"
                                className="form-control"
                                placeholder="Nombre"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                            ></input>
                        </div>
                        <div className="input-group mb-3">
                            <span className="input-group-text">
                                <i className="fa-solid fa-clipboard"></i>
                            </span>
                            <input
                                type="text"
                                id="descripcion"
                                className="form-control"
                                placeholder="Descripcion"
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                            ></input>
                        </div>
                        <div className="input-group mb-3">
                            <span className="input-group-text">
                                <i className="fa-solid fa-pizza-slice"></i>
                            </span>
                            <input
                                type="text"
                                id="porciones_rinde"
                                className="form-control"
                                placeholder="Rendimiento en porciones"
                                value={porcionesRinde}
                                onChange={(e) =>
                                    setPorcionesRinde(e.target.value)
                                }
                            ></input>
                        </div>
                    </div>
                    <div className="modal-footer  ">
                        <button className="btn btn-success w-100">
                            <i className="fa-solid fa-floppy-disk"></i>
                            &nbsp;&nbsp;Guardar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalNuevaReceta;
