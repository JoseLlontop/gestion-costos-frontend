import { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    RadioGroup,
    FormLabel,
    Radio,
    FormControlLabel,
    Button,
    Alert,
    InputAdornment,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faDollar } from "@fortawesome/free-solid-svg-icons";
import { show_alerta } from '../../helpers/funcionSweetAlert'; // Importa show_alerta

const ModalNuevoCosto = ({ open, onClose, onSave, costo }) => {
    const [nombre, setNombre] = useState("");
    const [tipo, setTipo] = useState("");
    const [valor, setValor] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        // Si hay un costo, cargar sus datos en el formulario
        if (costo) {
            setNombre(costo.nombre);
            setTipo(costo.tipo);
            setValor(costo.valor.toString());
        } else {
            // Si no hay costo, limpiar el formulario
            setNombre("");
            setTipo("");
            setValor("");
        }
    }, [costo]);

    const handleSave = () => {
        const parsedValor = parseFloat(valor);

        if (!nombre || !tipo || !valor) {
            setError("Todos los campos son obligatorios.");
            show_alerta("Todos los campos son obligatorios.", "warning");
            return;
        }

        if (isNaN(parsedValor) || parsedValor <= 0) {
            setError("El valor debe ser un número positivo.");
            show_alerta("El valor debe ser un número positivo.", "warning");
            return;
        }

        setError("");
        
        // Llamar a onSave con los datos del costo
        onSave({
            id: costo?.id || null, // Incluye el ID solo si es edición
            nombre,
            tipo,
            valor: parsedValor,
            });

        // Mostrar alerta de éxito después de guardar o actualizar
        show_alerta(costo ? "Costo actualizado con éxito" : "Costo guardado con éxito", "success");

        // Limpiar campos del formulario
        setNombre("");
        setTipo("");
        setValor("");
        };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{costo ? "Editar Costo" : "Nuevo Costo"}</DialogTitle>
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
                    label="Valor"
                    fullWidth
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <FontAwesomeIcon icon={faDollar} />
                            </InputAdornment>
                        ),
                    }}
                />

                <FormLabel component="legend" sx={{ marginTop: 2 }}>Tipo de Costo</FormLabel>
                <RadioGroup
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                    row
                >
                    <FormControlLabel value="Fijo" control={<Radio />} label="Fijo" />
                    <FormControlLabel value="Variable" control={<Radio />} label="Variable" />
                </RadioGroup>

            </DialogContent>
            <DialogActions>
                <Button onClick={handleSave} color="primary" variant="contained">
                    {costo ? "Actualizar" : "Guardar"}
                </Button>
                <Button onClick={onClose} color="secondary" variant="contained">
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ModalNuevoCosto;
