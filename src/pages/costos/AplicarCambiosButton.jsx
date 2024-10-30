import React, { useState } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";

function AplicarCambiosButton({ recetaId, porcentajeGanancia }) {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleClick = async () => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/recetas/${recetaId}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ porcentajeGanancia }),
                }
            );

            if (!response.ok) {
                throw new Error("Error en la solicitud");
            }

            const data = await response.json();
            console.log("Item agregado : ", data);

            handleOpen();
        } catch (error) {
            console.log("Error al actualizar porcentaje de ganancia:", error);
        }
    };

    return (
        <>
            <Button variant="contained" color="success" onClick={handleClick}>
                Aplicar Cambios
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Cambio Confirmado</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Se actualizo el porcentaje de ganancia a{" "}
                        <strong>{porcentajeGanancia}%</strong>.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="error">
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default AplicarCambiosButton;
