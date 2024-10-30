import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Collapse,
    Paper,
    IconButton,
    Modal,
} from "@mui/material";
import ModalNuevaReceta from "../../components/recetas/ModalNuevaReceta";
import ModalModificarCantidad from "../../components/recetas/ModalModificarCantidad";
import ModalAgregarIngredienteXReceta from "../../components/recetas/ModalAgregarIngredienteXReceta";
import { useApiRequest } from "../../hook/useApiRequest";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { show_alerta } from "../../helpers/funcionSweetAlert";

interface Receta {
    id: number;
    nombreReceta: string;
    descripcion: string;
    porcionesRinde: number;
    costoTotal: number;
    costoPorPorcion: number;
    porcentajeGanancia: number;
    precioVenta: number;
}

interface Ingrediente {
    id: number;
    nombre: string;
    cantidad: number;
    costo: number;
    marca: string;
}

const GestionRecetas = () => {
    const [recetas, setRecetas] = useState<Receta[]>([]);
    const [nombreRecetaBuscada, setNombreRecetaBuscada] = useState("");
    const [recetasExpandidas, setRecetasExpandidas] = useState<{
        [key: number]: boolean;
    }>({});
    const [ingredientesPorReceta, setIngredientesPorReceta] = useState<{
        [key: number]: Ingrediente[];
    }>({});
    const [openModal, setOpenModal] = useState(false);
    const [openModalIngredientes, setOpenModalIngredientes] = useState(false);
    const [openModalModificarCantidad, setOpenModalModificarCantidad] = useState(false);
    const [selectedRecetaId, setSelectedRecetaId] = useState<number | null>(
        null
    );
    const [selectedIngredienteId, setSelectedIngredienteId] = useState<number | null>(
        null
    );
    const [recetaToEdit, setRecetaToEdit] = useState<Receta | null>(null);

    const API_URL = "http://localhost:8080";

    const { data, isLoading, error } = useApiRequest(
        `${API_URL}/api/recetas`,
        "GET"
    );

    useEffect(() => {
        if (!isLoading && !error) {
            setRecetas(Array.isArray(data) ? data : []);
        }
    }, [data, isLoading, error]);

    const recetasFiltradas = recetas.filter((receta) =>
        receta.nombreReceta
            .toLowerCase()
            .includes(nombreRecetaBuscada.toLowerCase())
    );

    const toggleReceta = async (id: number) => {
        setRecetasExpandidas((prevState) => ({
            ...prevState,
            [id]: !prevState[id],
        }));

        if (!recetasExpandidas[id]) {
            try {
                const response = await fetch(
                    `${API_URL}/api/IngredientesXReceta/getxRecetaId=${id}`
                );
                const ingredientes: Ingrediente[] = await response.json();

                setIngredientesPorReceta((prevState) => ({
                    ...prevState,
                    [id]: ingredientes,
                }));
            } catch (error) {
                console.error("Error al obtener los ingredientes:", error);
            }
        }
    };

    const handleOpenEditModal = (receta: Receta) => {
        setRecetaToEdit(receta);
        setOpenModal(true);
    };

    const handleCloseEditModal = () => {
        setOpenModal(false);
        setRecetaToEdit(null);
    };

    const handleUpdateReceta = async (id: number, updatedReceta: Receta) => {
        try {
            const response = await fetch(`${API_URL}/api/recetas/${id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedReceta),
            });

            if (response.ok) {
                setRecetas((prevRecetas) =>
                    prevRecetas.map((receta) =>
                        receta.id === id ? updatedReceta : receta
                    )
                );
                show_alerta("Receta modificada con éxito", "success");
                handleCloseEditModal();
            } else {
                show_alerta("Error al modificar la receta", "error");
            }
        } catch (error) {
            console.error("Error al modificar la receta:", error);
            show_alerta("Ocurrió un error inesperado.", "error");
        }
    };

    const handleDeleteReceta = async (id: number) => {
        try {
            const response = await fetch(`${API_URL}/api/recetas/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                setRecetas((prevRecetas) =>
                    prevRecetas.filter((receta) => receta.id !== id)
                );
                show_alerta("Receta eliminada con éxito", "success");
            } else {
                show_alerta("Error al eliminar la receta", "error");
            }
        } catch (error) {
            console.error("Error al eliminar la receta:", error);
            show_alerta("Ocurrió un error inesperado.", "error");
        }
    };

    const handleDeleteIngrediente = async (recetaId: number, ingredienteId: number) => {
        try {
            const response = await fetch(`${API_URL}/api/IngredientesXReceta/${recetaId}/${ingredienteId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setIngredientesPorReceta((prevState) => ({
                    ...prevState,
                    [recetaId]: prevState[recetaId].filter(
                        (ingrediente) => ingrediente.id !== ingredienteId
                    ),
                }));
                show_alerta("Ingrediente eliminado con éxito", "success");
            } else {
                show_alerta("Error al eliminar el ingrediente", "error");
            }
        } catch (error) {
            console.error("Error al eliminar el ingrediente:", error);
            show_alerta("Ocurrió un error inesperado.", "error");
        }
    };

    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    const handleOpenModalModificarIngrediente = (recetaId: number, ingredienteId: number) => {
        setSelectedRecetaId(recetaId);
        setSelectedIngredienteId(ingredienteId);
        setOpenModalModificarCantidad(true);
    }
    const handleCloseModalModificarIngrediente = () => {
        setOpenModalModificarCantidad(false);
        if (selectedRecetaId !== null) {
            const fetchIngredientes = async () => {
                try {
                    const response = await fetch(
                        `${API_URL}/api/IngredientesXReceta/getxRecetaId=${selectedRecetaId}`
                    );
                    const ingredientes: Ingrediente[] = await response.json();

                    setIngredientesPorReceta((prevState) => ({
                        ...prevState,
                        [selectedRecetaId]: ingredientes,
                    }));
                } catch (error) {
                    console.error("Error al obtener los ingredientes:", error);
                }
            };

            fetchIngredientes();
        }
    };

    const handleOpenModalIngredientes = (recetaId: number) => {
        setSelectedRecetaId(recetaId);
        setOpenModalIngredientes(true);
    };
    const handleCloseModalIngredientes = () => setOpenModalIngredientes(false);

    const handleSave = () => {
        const fetchRecetas = async () => {
            try {
                const response = await fetch(`${API_URL}/api/recetas`);
                const data = await response.json();
                setRecetas(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Error al obtener las recetas:", error);
            }
        };

        fetchRecetas(); 
        handleCloseModal(); 
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Box display="flex" justifyContent="center" sx={{ mb: 2 }}>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleOpenModal}
                >
                    Añadir Receta
                </Button>
            </Box>

            <ModalNuevaReceta
                open={openModal}
                handleClose={handleCloseModal}
                receta={recetaToEdit}
                onSave={handleSave}
            />

            <Modal
                open={openModalIngredientes}
                onClose={handleCloseModalIngredientes}
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 600,
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <ModalAgregarIngredienteXReceta
                        open={openModalIngredientes}
                        handleClose={handleCloseModalIngredientes}
                        recetaId={selectedRecetaId}
                    />
                </Box>
            </Modal>

            <ModalModificarCantidad
                open={openModalModificarCantidad}
                handleClose={handleCloseModalModificarIngrediente}
                recetaId={selectedRecetaId}
                ingredienteId={selectedIngredienteId}
            />

            <TextField
                fullWidth
                variant="outlined"
                placeholder="Buscar receta por nombre"
                value={nombreRecetaBuscada}
                onChange={(e) => setNombreRecetaBuscada(e.target.value)}
                sx={{ mb: 2 }}
            />

            <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
                <Table stickyHeader>
                    <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell align="center">
                                <strong>Receta</strong>
                            </TableCell>
                            <TableCell align="center">
                                <strong>Descripción</strong>
                            </TableCell>
                            <TableCell align="center">
                                <strong>Porciones</strong>
                            </TableCell>
                            <TableCell align="center">
                                <strong>Costo Total</strong>
                            </TableCell>
                            <TableCell align="center">
                                <strong>Costo por Porción</strong>
                            </TableCell>
                            <TableCell align="center">
                                <strong>Porcentaje de Ganancia</strong>
                            </TableCell>
                            <TableCell align="center">
                                <strong>Precio de Venta</strong>
                            </TableCell>
                            <TableCell align="center">
                                <strong>Acciones</strong>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {recetasFiltradas.length > 0 ? (
                            recetasFiltradas.map((receta) => (
                                <React.Fragment key={receta.id}>
                                    <TableRow
                                        onClick={() => toggleReceta(receta.id)}
                                        style={{
                                            cursor: "pointer",
                                            backgroundColor: recetasExpandidas[
                                                receta.id
                                            ]
                                                ? "#e0f7fa"
                                                : "white",
                                        }}
                                    >
                                        <TableCell>
                                            {recetasExpandidas[receta.id] ? (
                                                <ExpandLessIcon />
                                            ) : (
                                                <ExpandMoreIcon />
                                            )}
                                        </TableCell>
                                        <TableCell align="center">
                                            {receta.nombreReceta}
                                        </TableCell>
                                        <TableCell align="center">
                                            {receta.descripcion}
                                        </TableCell>
                                        <TableCell align="center">
                                            {receta.porcionesRinde}
                                        </TableCell>
                                        <TableCell
                                            align="center"
                                            style={{ color: "green" }}
                                        >
                                            <strong>
                                                ${receta.costoTotal.toFixed(2)}
                                            </strong>
                                        </TableCell>
                                        <TableCell
                                            align="center"
                                            style={{ color: "blue" }}
                                        >
                                            <strong>
                                                $
                                                {receta.costoPorPorcion.toFixed(
                                                    2
                                                )}
                                            </strong>
                                        </TableCell>
                                        <TableCell align="center">
                                            <strong>
                                                {receta.porcentajeGanancia}
                                            </strong>
                                        </TableCell>
                                        <TableCell align="center">
                                            <strong>
                                                ${receta.precioVenta.toFixed(2)}
                                            </strong>
                                        </TableCell>
                                        <TableCell>
                                            <IconButton
                                                color="error"
                                                onClick={() =>
                                                    handleDeleteReceta(
                                                        receta.id
                                                    )
                                                }
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                            <IconButton
                                                color="primary"
                                                onClick={() =>
                                                    handleOpenEditModal(receta)
                                                }
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                color="secondary"
                                                onClick={() =>
                                                    handleOpenModalIngredientes(
                                                        receta.id
                                                    )
                                                }
                                            >
                                                <AddCircleIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell
                                            colSpan={9}
                                            style={{ padding: 0 }}
                                        >
                                            <Collapse
                                                in={
                                                    recetasExpandidas[receta.id]
                                                }
                                                timeout="auto"
                                                unmountOnExit
                                            >
                                                <Box margin={1}>
                                                    <Typography variant="h6">
                                                        Ingredientes:
                                                    </Typography>
                                                    <Table>
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell>
                                                                    <strong>
                                                                        Nombre
                                                                    </strong>
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    <strong>
                                                                        Cantidad
                                                                        Utilizada
                                                                        en
                                                                        Receta
                                                                    </strong>
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    <strong>
                                                                        Costo
                                                                    </strong>
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    <strong>
                                                                        Marca
                                                                    </strong>
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    <strong>
                                                                        Acciones
                                                                    </strong>
                                                                </TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {ingredientesPorReceta[
                                                                receta.id
                                                            ] &&
                                                            ingredientesPorReceta[
                                                                receta.id
                                                            ].length > 0 ? (
                                                                ingredientesPorReceta[
                                                                    receta.id
                                                                ].map(
                                                                    (
                                                                        ingrediente
                                                                    ) => (
                                                                        <TableRow
                                                                            key={
                                                                                ingrediente.id
                                                                            }
                                                                        >
                                                                            <TableCell>
                                                                                {
                                                                                    ingrediente.nombre
                                                                                }
                                                                            </TableCell>
                                                                            <TableCell align="center">
                                                                                {
                                                                                    ingrediente.cantidad
                                                                                }{" "}
                                                                                gr
                                                                            </TableCell>
                                                                            <TableCell align="center">
                                                                                $
                                                                                {ingrediente.costo.toFixed(
                                                                                    2
                                                                                )}
                                                                            </TableCell>
                                                                            <TableCell align="center">
                                                                                {
                                                                                    ingrediente.marca
                                                                                }
                                                                            </TableCell>
                                                                            <TableCell align="center">
                                                                                <IconButton
                                                                                    color="primary"
                                                                                    onClick={() =>
                                                                                        handleOpenModalModificarIngrediente(
                                                                                            receta.id,
                                                                                            ingrediente.id
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    <EditIcon />
                                                                                </IconButton>
                                                                                <IconButton
                                                                                    color="error"
                                                                                    onClick={() =>
                                                                                        handleDeleteIngrediente(
                                                                                            receta.id,
                                                                                            ingrediente.id
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    <DeleteIcon />
                                                                                </IconButton>
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    )
                                                                )
                                                            ) : (
                                                                <TableRow>
                                                                    <TableCell
                                                                        colSpan={
                                                                            5
                                                                        }
                                                                        align="center"
                                                                    >
                                                                        <Typography>
                                                                            No
                                                                            hay
                                                                            ingredientes
                                                                            para
                                                                            esta
                                                                            receta.
                                                                        </Typography>
                                                                    </TableCell>
                                                                </TableRow>
                                                            )}
                                                        </TableBody>
                                                    </Table>
                                                </Box>
                                            </Collapse>
                                        </TableCell>
                                    </TableRow>
                                </React.Fragment>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={9} align="center">
                                    <Typography>
                                        No se encontraron recetas.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default GestionRecetas;