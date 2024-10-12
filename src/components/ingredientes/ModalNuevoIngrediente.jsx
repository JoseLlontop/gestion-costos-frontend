import { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Alert,
    InputAdornment,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faDollar } from "@fortawesome/free-solid-svg-icons";
import { show_alerta } from '../../helpers/funcionSweetAlert'; // Importa show_alerta

const ModalNuevoIngrediente = ({ open, onClose, onSave }) => {
    const [nombre, setNombre] = useState("");
    const [marca, setMarca] = useState("");
    const [precio, setPrecio] = useState("");
    const [unidad_medida, setUnidadMedida] = useState("");
    const [cantidad_paquete, setCantidadPaquete] = useState("");
    const [error, setError] = useState("");

    const handleSave = () => {
        // Validación de campos vacíos
        if (!nombre || !marca || !precio || !unidad_medida || !cantidad_paquete) {
            setError("Todos los campos son obligatorios.");
            show_alerta("Todos los campos son obligatorios.", "warning");
            return;
        }

        // Validación adicional para los campos de tipo float e int
        if (isNaN(precio) || parseFloat(precio) <= 0) {
            setError("El precio debe ser un número positivo.");
            show_alerta("El precio debe ser un número positivo.", "warning");
            return;
        }

        if (!Number.isInteger(Number(cantidad_paquete)) || parseInt(cantidad_paquete) <= 0) {
            setError("La cantidad del paquete debe ser un número entero positivo.");
            show_alerta("La cantidad del paquete debe ser un número entero positivo.", "warning");
            return;
        }

        // Validación para campos de texto: nombre, marca y unidad de medida
        if (typeof nombre !== 'string' || nombre.trim().length === 0) {
            setError("El nombre es inválido.");
            show_alerta("El nombre es inválido.", "warning");
            return;
        }

        if (typeof marca !== 'string' || marca.trim().length === 0) {
            setError("La marca es inválida.");
            show_alerta("La marca es inválida.", "warning");
            return;
        }

        if (typeof unidad_medida !== 'string' || unidad_medida.trim().length === 0) {
            setError("La unidad de medida es inválida.");
            show_alerta("La unidad de medida es inválida.", "warning");
            return;
        }

        // Limpiar el error si todos los campos están completos
        setError("");
        onSave({ nombre, marca, precio, unidad_medida, cantidad_paquete });

        // Mostrar alerta de éxito después de guardar
        show_alerta("Ingrediente guardado con éxito", "success");

        // Limpiar campos del formulario
        setNombre("");
        setMarca("");
        setPrecio("");
        setUnidadMedida("");
        setCantidadPaquete("");
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Nuevo Ingrediente</DialogTitle>
            <DialogContent>
                {error && <Alert severity="error">{error}</Alert>}

                <TextField
                    margin="dense"
                    label="Nombre"
                    fullWidth
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <FontAwesomeIcon icon={faComment} />
                            </InputAdornment>
                        ),
                    }}
                />

                <TextField
                    margin="dense"
                    label="Marca"
                    fullWidth
                    value={marca}
                    onChange={(e) => setMarca(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <FontAwesomeIcon icon={faComment} />
                            </InputAdornment>
                        ),
                    }}
                />

                <TextField
                    margin="dense"
                    label="Precio"
                    fullWidth
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <FontAwesomeIcon icon={faDollar} />
                            </InputAdornment>
                        ),
                    }}
                />

                <TextField
                    margin="dense"
                    label="Unidad de Medida"
                    fullWidth
                    value={unidad_medida}
                    onChange={(e) => setUnidadMedida(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <FontAwesomeIcon icon={faComment} />
                            </InputAdornment>
                        ),
                    }}
                />

                <TextField
                    margin="dense"
                    label="Cantidad por Paquete"
                    fullWidth
                    value={cantidad_paquete}
                    onChange={(e) => setCantidadPaquete(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <FontAwesomeIcon icon={faComment} />
                            </InputAdornment>
                        ),
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleSave} color="primary" variant="contained">
                    Guardar
                </Button>
                <Button onClick={onClose} color="secondary" variant="contained">
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ModalNuevoIngrediente;
