import { Button } from "@mui/material";
import React from "react";

function AplicarCambiosButton({ recetaId, porcentajeGanancia }) {
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
        } catch (error) {
            console.log("Error al actualizar porcentaje de ganancia:", error);
        }
    };

    return (
        <Button variant="contained" color="success" onClick={handleClick}>
            Aplicar Cambios
        </Button>
    );
}

export default AplicarCambiosButton;
