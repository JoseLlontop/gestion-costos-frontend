import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Modal, IconButton, Alert, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useApiRequest } from '../../hook/useApiRequest';

const ModalMoficarCantidad = ({ open, handleClose, recetaId, ingredienteId }) => {

    const [ingrediente, setIngrediente] = useState({});
    const [cantidad, setCantidad] = useState("");
    const [mensaje, setMensaje] = useState("");


    const API_URL = "http://localhost:8080";

    const { data, isLoading, error } = useApiRequest(`${API_URL}/api/ingredientes/${ingredienteId}`, 'GET');

    useEffect(() => {
      if (!isLoading && !error) {
        setIngrediente(data);
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
                `${API_URL}/api/IngredientesXReceta/modificarCantidad`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(nuevoIngredienteXReceta),
                }
            );

            if (response.ok) {
                const data = await response.json();
    
                setIngrediente("");
                setCantidad("");
                handleClose();
            } else {
                setMensaje("Error al modificar el ingrediente");
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
                        Modificar Cantidad de {ingrediente.nombre ? ingrediente.nombre : '...'}
                    </Typography>
                    <IconButton onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                    <TextField
                        fullWidth
                        label="Cantidad (Gramos)"
                        variant="outlined"
                        value={cantidad}
                        onChange={(e) => setCantidad(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    {mensaje && (
                        <Alert severity="info" sx={{ mb: 2 }}>{mensaje}</Alert>
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
    );
};

export default ModalMoficarCantidad;