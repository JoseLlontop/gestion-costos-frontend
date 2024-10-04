import "bootstrap/dist/css/bootstrap.min.css";

import { useEffect, useState } from "react";
import { useApiRequest } from "../hook/useApiRequest";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { show_alerta } from '../helpers/funcionSweetAlert'

const ModalNuevoIngrediente = ({ onSave }) => {
    const [nombre, setNombre] = useState([]);
    const [marca, setMarca] = useState([]);
    const [precio, setPrecio] = useState([]);
    const [unidad_medida, setUnidadMedida] = useState([]);
    const [cantidad_paquete, setCantidadPaquete] = useState([]);

    const [error, setError] = useState("");

    const handleSave = () => {
        if (
            !nombre ||
            !marca ||
            !precio ||
            !unidad_medida ||
            !cantidad_paquete
        ) {
            setError("Todos los campos son obligatorios.");
            return;
        }

        // Validación adicional para los campos de tipo float e int
        if (isNaN(precio) || parseFloat(precio) <= 0) {
            setError("El precio debe ser un número positivo.");
            return;
        }

        if (!Number.isInteger(Number(cantidad_paquete)) || parseInt(cantidad_paquete) <= 0) {
            setError("La cantidad del paquete debe ser un número entero positivo.");
            return;
        }

        // Validación para campos de texto: nombre, marca y unidad de medida
        if (typeof nombre !== 'string' || nombre.trim().length === 0) {
            setError("El nombre es inválido.");
            return;
        }

        if (typeof marca !== 'string' || marca.trim().length === 0) {
            setError("La marca es inválida.");
            return;
        }

        if (typeof unidad_medida !== 'string' || unidad_medida.trim().length === 0) {
            setError("La unidad de medida es inválida.");
            return;
        }

        // Limpiar el error si todos los campos están completos
        setError("");

        // Llamar al método de guardado con los valores de los campos
        onSave({
            nombre,
            marca,
            precio: parseFloat(precio),
            unidad_medida,
            cantidad_paquete: parseInt(cantidad_paquete),
        });

        // Limpiar el formulario después de guardar
        setNombre("");
        setMarca("");
        setPrecio("");
        setUnidadMedida("");
        setCantidadPaquete("");

    };

    return (
        <div className="modal fade" id="modalIngredientes" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div
                        className="modal-header"
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <h5 className="modal-title">Nuevo ingrediente</h5>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="close"
                        ></button>
                    </div>
                    <div className="modal-body">
                        {error && (
                            <div className="alert alert-danger">{error}</div>
                        )}
                        <div className="input-group mb-3">
                            <span className="input-group-text">
                                <i className="fa-solid fa-comment"></i>
                            </span>
                            <input
                                type="text"
                                id="nombre"
                                className="form-control"
                                placeholder="Nombre"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                            ></input>
                        </div>

                        <div className="input-group mb-3">
                            <span className="input-group-text">
                                <i className="fa-solid fa-comment"></i>
                            </span>
                            <input
                                type="text"
                                id="marca"
                                className="form-control"
                                placeholder="Marca"
                                value={marca}
                                onChange={(e) => setMarca(e.target.value)}
                            ></input>
                        </div>

                        <div className="input-group mb-3">
                            <span className="input-group-text">
                                <i className="fa-solid fa-dollar"></i>
                            </span>
                            <input
                                type="text"
                                id="precio"
                                className="form-control"
                                placeholder="Precio"
                                value={precio}
                                onChange={(e) => setPrecio(e.target.value)}
                            ></input>
                        </div>

                        <div className="input-group mb-3">
                            <span className="input-group-text">
                                <i className="fa-solid fa-comment"></i>
                            </span>
                            <input
                                type="text"
                                id="unidad_medida"
                                className="form-control"
                                placeholder="Unidad medida"
                                value={unidad_medida}
                                onChange={(e) =>
                                    setUnidadMedida(e.target.value)
                                }
                            ></input>
                        </div>

                        <div className="input-group mb-3">
                            <span className="input-group-text">
                                <i className="fa-solid fa-comment"></i>
                            </span>
                            <input
                                type="text"
                                id="cantidad_paquete"
                                className="form-control"
                                placeholder="Cantidad paquete"
                                value={cantidad_paquete}
                                onChange={(e) =>
                                    setCantidadPaquete(e.target.value)
                                }
                            ></input>
                        </div>

                        <div className="d-grid col-e mx-auto">
                            <button
                                type="button"
                                className="btn btn-success"
                                onClick={handleSave}
                            >
                                Guardar
                            </button>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            id="btncerrar"
                            className="btn btn-secondary"
                            data-bs-dismiss="modal"
                            style={{ backgroundColor: "gray" }}
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalNuevoIngrediente;
