import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Modal, IconButton, Alert, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useApiRequest } from '../../hook/useApiRequest';

const ModalAgregarIngredienteXReceta = ({ open, handleClose, recetaId }) => {
    const [ingredientes, setIngredientes] = useState([]);
    const [ingredienteId, setIngredienteId] = useState("");
    const [cantidad, setCantidad] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [ingredientesAgregados, setIngredientesAgregados] = useState([]);

    const API_URL = "http://localhost:8080";

    const { data, isLoading, error } = useApiRequest(`${API_URL}/api/ingredientes/`, 'GET');

    useEffect(() => {
        if (!isLoading && !error) {
            setIngredientes(data || []);
        }
    }, [data, isLoading, error]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje("");

        const nuevoIngredienteXReceta = {
            receta: { id: recetaId },
            ingrediente: { id: parseInt(ingredienteId) },
            cantidad: parseFloat(cantidad)
        };

        try {
            const response = await fetch(
                `${API_URL}/api/IngredientesXReceta/crear`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(nuevoIngredienteXReceta),
                }
            );

            if (response.ok) {
                const data = await response.json();
                setIngredientesAgregados([...ingredientesAgregados, { ...data, nombre: ingredientes.find(ing => ing.id === parseInt(ingredienteId)).nombre }]);
                setMensaje("Ingrediente agregado con éxito");
                setIngredienteId("");
                setCantidad("");
            } else {
                setMensaje("Error al agregar el ingrediente");
            }
        } catch (error) {
            console.error("Error en la solicitud al backend", error);
            setMensaje("Ocurrió un error inesperado.");
        }
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={{ 
                position: 'absolute', 
                top: '50%', 
                left: '50%', 
                transform: 'translate(-50%, -50%)', 
                width: 600, 
                bgcolor: 'background.paper', 
                boxShadow: 24, 
                p: 4 
            }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" component="h2">
                        Agregar Ingrediente a Receta
                    </Typography>
                    <IconButton onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                    <TextField
                        select
                        fullWidth
                        label="Ingrediente"
                        variant="outlined"
                        value={ingredienteId}
                        onChange={(e) => setIngredienteId(e.target.value)}
                        sx={{ mb: 2 }}
                    >
                        {ingredientes.map((ingrediente) => (
                            <MenuItem key={ingrediente.id} value={ingrediente.id}>
                                {ingrediente.nombre}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        fullWidth
                        label="Cantidad (Gramos o Litros)"
                        variant="outlined"
                        value={cantidad}
                        onChange={(e) => setCantidad(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    {mensaje && (
                        <Alert severity="info" sx={{ mb: 2 }}>{mensaje}</Alert>
                    )}
                    <Button
                        variant="outlined"
                        color="secondary"
                        fullWidth
                        onClick={() => {
                            console.log("Open ModalUsarIngredienteDeReceta");
                        }}
                        sx={{ mb: 2 }}
                    >
                        Usar Ingredientes de Receta Existente
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                    >
                        Guardar
                    </Button>
                </Box>
                <TableContainer component={Paper} sx={{ mt: 4 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Ingrediente</strong></TableCell>
                                <TableCell><strong>Cantidad </strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {ingredientesAgregados.map((ingrediente, index) => (
                                <TableRow key={index}>
                                    <TableCell>{ingrediente.nombre}</TableCell>
                                    <TableCell>{ingrediente.cantidad}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Modal>
    );
};

export default ModalAgregarIngredienteXReceta;