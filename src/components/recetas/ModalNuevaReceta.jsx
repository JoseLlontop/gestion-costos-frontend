import React, { useState, useEffect } from "react";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import Tooltip from "@mui/material/Tooltip";
import {
    Box,
    Button,
    TextField,
    Typography,
    Modal,
    IconButton,
    Alert,
    InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faComment,
    faUtensils,
    faListOl,
    faPercent,
} from "@fortawesome/free-solid-svg-icons";
import { show_alerta } from "../../helpers/funcionSweetAlert";
import ModalAgregarIngredienteXReceta from "./ModalAgregarIngredienteXReceta";
import PercentIcon from "@mui/icons-material/Percent";

const ModalNuevaReceta = ({ open, handleClose, receta, onSave }) => {
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [porcionesRinde, setPorcionesRinde] = useState("");
    const [mensaje, setMensaje] = useState(""); // Estado para manejar la respuesta y el mensaje de éxito/error
    const [recetaId, setRecetaId] = useState(null);
    const [modalIngredientesOpen, setModalIngredientesOpen] = useState(false);
    const [porcentajeGanancia, setPorcentajeGanancia] = useState("");

    const API_URL = "http://localhost:8080";

    useEffect(() => {
        if (receta) {
            setNombre(receta.nombreReceta || "");
            setDescripcion(receta.descripcion || "");
            setPorcionesRinde(receta.porcionesRinde ? receta.porcionesRinde.toString() : "");
            setPorcentajeGanancia(receta.porcentajeGanancia || "");
            setRecetaId(receta.id || null);
        }
    }, [receta]);

    //Función para manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevenir la recarga de la página
        setMensaje(""); // Limpiar el mensaje antes de enviar

        const nuevaReceta = {
            nombreReceta: nombre,
            descripcion: descripcion,
            porcionesRinde: parseInt(porcionesRinde), // convierte a int
            porcentajeGanancia: porcentajeGanancia,
        };

        try {
            const response = await fetch(`${API_URL}/api/recetas/${recetaId ? `${recetaId}` : 'crear'}`, {
                method: recetaId ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json", // indicar que se envia un json
                },
                body: JSON.stringify(nuevaReceta), //convierte el objeto a JSON
            });

            if (response.ok) {
                const data = await response.json();
                setRecetaId(data.id);
                if (recetaId) {
                    setMensaje("Receta modificada con éxito");
                    show_alerta("Receta modificada con éxito", "success"); // Mostrar alerta de éxito
                } else {
                    setMensaje("Receta creada con éxito");
                    show_alerta("Receta creada con éxito", "success"); // Mostrar alerta de éxito
                    // Abrir el modal para agregar ingredientes
                    setModalIngredientesOpen(true);
                }
                // Limpiar los campos después de crear la receta
                setNombre("");
                setDescripcion("");
                setPorcionesRinde("");
                setPorcentajeGanancia("");
                // Cerrar el modal después de guardar
                handleClose();
                // Llamar a la función onSave si está definida
                if (onSave) {
                    onSave();
                }
            } else {
                setMensaje("Error al crear la receta");
                show_alerta("Error al crear la receta", "error"); // Mostrar alerta de error
            }
        } catch (error) {
            console.error("Error en la solicitud al backend", error);
            setMensaje("Ocurrió un error inesperado.");
            show_alerta("Ocurrió un error inesperado.", "error"); // Mostrar alerta de error
        }
    };

    return (
        <>
            <Modal open={open} onClose={handleClose}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Typography variant="h6" component="h2">
                            {recetaId ? "Editar Receta" : "Añadir Nueva Receta"}
                        </Typography>
                        <IconButton onClick={handleClose}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{ mt: 2 }}
                    >
                        <TextField
                            fullWidth
                            label="Nombre"
                            variant="outlined"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            sx={{ mb: 2 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <FontAwesomeIcon icon={faUtensils} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            fullWidth
                            label="Descripción"
                            variant="outlined"
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            sx={{ mb: 2 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <FontAwesomeIcon icon={faComment} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            fullWidth
                            label="Rendimiento en porciones"
                            variant="outlined"
                            value={porcionesRinde}
                            onChange={(e) => setPorcionesRinde(e.target.value)}
                            sx={{ mb: 2 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <FontAwesomeIcon icon={faListOl} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Tooltip title="Especifique el número de unidades que rinde la receta.">
                                            <HelpOutlineIcon color="action" />
                                        </Tooltip>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            fullWidth
                            label="Porcentaje de Ganancia"
                            variant="outlined"
                            value={porcentajeGanancia}
                            onChange={(e) =>
                                setPorcentajeGanancia(e.target.value)
                            }
                            sx={{ mb: 2 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <FontAwesomeIcon icon={faPercent} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Tooltip title="Especifique el margen de ganancia inicial para esta receta.">
                                            <HelpOutlineIcon color="action" />
                                        </Tooltip>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        {mensaje && (
                            <Alert severity="info" sx={{ mb: 2 }}>
                                {mensaje}
                            </Alert>
                        )}
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                        >
                            Guardar
                        </Button>
                    </Box>
                </Box>
            </Modal>
            <ModalAgregarIngredienteXReceta
                open={modalIngredientesOpen}
                handleClose={() => setModalIngredientesOpen(false)}
                recetaId={recetaId}
            />
        </>
    );
};

export default ModalNuevaReceta;