import { Button, Modal, TextField, Typography, Box } from "@mui/material";
import React, { useState, useEffect } from "react";

const ModalNuevaMarca = ({ open, onClose, onSave }) => {
    const [marca, setMarca] = useState("");
    const [error, setError] = useState("");
    const [marcasExistentes, setMarcasExistentes] = useState([]);

    // Obtener todas las marcas al abrir el modal
    useEffect(() => {
        const fetchMarcas = async () => {
            try {
                const response = await fetch(
                    "http://localhost:8080/api/marcas/"
                );
                if (response.ok) {
                    const data = await response.json();
                    setMarcasExistentes(data);
                } else {
                    console.error("Error al obtener las marcas");
                }
            } catch (error) {
                console.error("Error en la solicitud:", error);
            }
        };

        if (open) {
            fetchMarcas();
        }
    }, [open]);

    const handleSave = async () => {
        if (!marca) {
            setError("El nombre de la marca es obligatorio");
            return;
        }

        if (
            marcasExistentes.some(
                (existingMarca) =>
                    existingMarca.nombre.toLowerCase() === marca.toLowerCase()
            )
        ) {
            setError("La marca ya existe");
            return;
        }

        const newMarca = { nombre: marca };

        try {
            const response = await fetch(
                "http://localhost:8080/api/marcas/crear",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newMarca),
                }
            );

            if (!response.ok) {
                throw new Error("Error al crear la marca");
            }

            const data = await response.json();
            console.log("Marca creada con éxito:", data);

            // Llamada a onSave para notificar al componente principal
            onSave(newMarca);

            // Resetear los valores y cerrar el modal
            setMarca("");
            setError("");
            onClose(); // Cerrar el modal después de guardar
        } catch (error) {
            console.error("Error al crear la marca: ", error);
            setError("Hubo un problema al crear la marca");
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    padding: 3,
                    maxWidth: 400,
                    margin: "auto",
                    backgroundColor: "white",
                    borderRadius: 2,
                    mt: 10,
                }}
            >
                <Typography variant="h6" gutterBottom>
                    Crear Nueva Marca
                </Typography>
                <TextField
                    label="Nombre de la marca"
                    fullWidth
                    value={marca}
                    onChange={(e) => setMarca(e.target.value)}
                    error={!!error}
                    helperText={error}
                    sx={{ mb: 2 }}
                />
                <Box display="flex" justifyContent="space-between">
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={onClose} // Llamar a onClose para cerrar el modal
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={handleSave}
                    >
                        Agregar
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default ModalNuevaMarca;
