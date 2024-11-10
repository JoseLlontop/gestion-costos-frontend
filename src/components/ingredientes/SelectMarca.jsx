import {
    FormControl,
    InputAdornment,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import React, { useEffect, useState } from "react";

const MarcaSelect = ({ setMarca }) => {
    const [marcas, setMarcas] = useState([]);

    // Cargar datos del server
    useEffect(() => {
        const fetchMarcas = async () => {
            try {
                const response = await fetch(
                    "http://localhost:8080/api/marcas/"
                );
                if (!response.ok) {
                    throw new Error("Error al cargar las marcas");
                }
                const data = await response.json();
                setMarcas(data);
            } catch (error) {
                console.error("Error al cargar las marcas", error);
            }
        };
        fetchMarcas();
    }, []);

    return (
        <FormControl fullWidth>
            <InputLabel>Marca</InputLabel>
            <Select onChange={(e) => setMarca(e.target.value)} defaultValue="">
                {marcas.map((marca) => (
                    <MenuItem key={marca.id} value={marca.nombre}>
                        {marca.nombre}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default MarcaSelect;
