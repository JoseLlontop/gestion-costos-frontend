import { useState, useEffect } from "react";
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
import { show_alerta } from "../../helpers/funcionSweetAlert"; // Importa show_alerta
import MarcaSelect from "./SelectMarca";
import ModalNuevaMarca from "./ModalNuevaMarca";

const ModalNuevoIngrediente = ({ open, onClose, onSave, ingrediente }) => {
    const [nombre, setNombre] = useState("");
    const [marca, setMarca] = useState("");
    const [precio, setPrecio] = useState("");
    const [unidad_medida, setUnidadMedida] = useState("");
    const [cantidad_paquete, setCantidadPaquete] = useState("");
    const [error, setError] = useState("");
    const [openModalMarca, setOpenModalMarca] = useState(false);

    useEffect(() => {
        // Si hay un ingrediente, cargar sus datos en el formulario
        if (ingrediente) {
            setNombre(ingrediente.nombre);
            setMarca(ingrediente.marca);
            setPrecio(ingrediente.precio.toString());
            setUnidadMedida(ingrediente.unidad_medida);
            setCantidadPaquete(ingrediente.cantidad_paquete.toString());
        } else {
            // Si no hay ingrediente, limpiar el formulario
            setNombre("");
            setMarca("");
            setPrecio("");
            setUnidadMedida("");
            setCantidadPaquete("");
        }
    }, [ingrediente]);

    const handleSave = () => {
        const parsedPrecio = parseFloat(precio);
        const parsedCantidadPaquete = parseInt(cantidad_paquete);

        if (
            !nombre ||
            !marca ||
            !precio ||
            !unidad_medida ||
            !cantidad_paquete
        ) {
            setError("Todos los campos son obligatorios.");
            show_alerta("Todos los campos son obligatorios.", "warning");
            return;
        }

        if (isNaN(parsedPrecio) || parsedPrecio <= 0) {
            setError("El precio debe ser un número positivo.");
            show_alerta("El precio debe ser un número positivo.", "warning");
            return;
        }

        if (isNaN(parsedCantidadPaquete) || parsedCantidadPaquete <= 0) {
            setError(
                "La cantidad del paquete debe ser un número entero positivo."
            );
            show_alerta(
                "La cantidad del paquete debe ser un número entero positivo.",
                "warning"
            );
            return;
        }

        setError("");

        // Llamar a onSave con los datos del ingrediente
        onSave({
            id: ingrediente?.id || null, // Incluye el ID solo si es edición
            nombre,
            marca,
            precio: parsedPrecio,
            unidad_medida,
            cantidad_paquete: parsedCantidadPaquete,
        });

        // Mostrar alerta de éxito después de guardar o actualizar
        show_alerta(
            ingrediente
                ? "Ingrediente actualizado con éxito"
                : "Ingrediente guardado con éxito",
            "success"
        );

        // Limpiar campos del formulario
        setNombre("");
        setMarca("");
        setPrecio("");
        setUnidadMedida("");
        setCantidadPaquete("");
    };

    // Función para abrir el modal
    const handleClickGestionMarca = () => {
        setOpenModalMarca(true);
    };

    // Función para cerrar el modal
    const handleCloseModalMarca = () => {
        setOpenModalMarca(false);
    };

    // Función para guardar la nueva marca
    const handleSaveMarca = (newMarca) => {
        console.log("Nueva marca guardada:", newMarca);
        setOpenModalMarca(false); // Cierra el modal después de guardar
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                {ingrediente ? "Editar Ingrediente" : "Nuevo Ingrediente"}
            </DialogTitle>
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

                <MarcaSelect setMarca={setMarca} />

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
                <Button onClick={onClose} color="secondary" variant="contained">
                    Cerrar
                </Button>
                <Button
                    onClick={handleClickGestionMarca}
                    color="success"
                    variant="contained"
                >
                    Gestion de marcas
                </Button>
                <ModalNuevaMarca
                    open={openModalMarca} // Cambié esto de 'handleClickGestionMarca' a 'openModalMarca'
                    onClose={handleCloseModalMarca}
                    onSave={handleSaveMarca}
                />

                <Button
                    onClick={handleSave}
                    color="primary"
                    variant="contained"
                >
                    {ingrediente ? "Actualizar" : "Guardar"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ModalNuevoIngrediente;
