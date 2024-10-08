import React, { useEffect, useState } from 'react';
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
    Modal
} from '@mui/material';
import ModalNuevaReceta from '../components/ModalNuevaReceta';
import ModalAgregarIngredienteXReceta from '../components/ModalAgregarIngredienteXReceta';
import { useApiRequest } from '../hook/useApiRequest';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { show_alerta } from '../helpers/funcionSweetAlert';

const GestionRecetas = () => {
    const [recetas, setRecetas] = useState([]);
    const [nombreRecetaBuscada, setNombreRecetaBuscada] = useState("");
    const [recetasExpandidas, setRecetasExpandidas] = useState({});
    const [ingredientesPorReceta, setIngredientesPorReceta] = useState({});
    const [openModal, setOpenModal] = useState(false);
    const [openModalIngredientes, setOpenModalIngredientes] = useState(false);
    const [selectedRecetaId, setSelectedRecetaId] = useState(null);

    const { data, isLoading, error } = useApiRequest(
        `${import.meta.env.VITE_BACKEND_API_URL}:${import.meta.env.VITE_BACKEND_API_PORT}/api/recetas`,
        'GET'
    );

    useEffect(() => {
        if (!isLoading && !error) {
            setRecetas(Array.isArray(data) ? data : []);
        }
    }, [data, isLoading, error]);

    const recetasFiltradas = recetas.filter(receta =>
        receta.nombreReceta.toLowerCase().includes(nombreRecetaBuscada.toLowerCase())
    );

    const toggleReceta = async (id) => {
        setRecetasExpandidas(prevState => ({
            ...prevState,
            [id]: !prevState[id]
        }));

        if (!recetasExpandidas[id]) {
            try {
                const response = await fetch(`http://localhost:8080/api/IngredientesXReceta/getxRecetaId=${id}`);
                const ingredientes = await response.json();
                
                setIngredientesPorReceta(prevState => ({
                    ...prevState,
                    [id]: ingredientes
                }));
            } catch (error) {
                console.error("Error al obtener los ingredientes:", error);
            }
        }
    };

    const handleDeleteReceta = async (id) => {
        try {
            const response = await fetch(`http://localhost:8080/api/recetas/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setRecetas(prevRecetas => prevRecetas.filter(receta => receta.id !== id));
                show_alerta("Receta eliminada con éxito", "success");
            } else {
                show_alerta("Error al eliminar la receta", "error");
            }
        } catch (error) {
            console.error("Error al eliminar la receta:", error);
            show_alerta("Ocurrió un error inesperado.", "error");
        }
    };

    const handleDeleteIngrediente = (recetaId, ingredienteId) => {
        console.log(`Eliminar ingrediente con id: ${ingredienteId} de la receta con id: ${recetaId}`);
    };

    const handleEditIngrediente = (recetaId, ingredienteId) => {
        console.log(`Editar ingrediente con id: ${ingredienteId} de la receta con id: ${recetaId}`);
    };

    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    const handleOpenModalIngredientes = (recetaId) => {
        setSelectedRecetaId(recetaId);
        setOpenModalIngredientes(true);
    };
    const handleCloseModalIngredientes = () => setOpenModalIngredientes(false);

    const handleSave = () => {
        // Aquí puedes volver a hacer la llamada a la API para obtener las recetas actualizadas si es necesario
        fetchRecetas(); // Puedes implementar esta función para actualizar el estado
        handleCloseModal(); // Cerrar el modal después de guardar
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

            <ModalNuevaReceta open={openModal} handleClose={handleCloseModal} onSave={handleSave} />

            <Modal
                open={openModalIngredientes}
                onClose={handleCloseModalIngredientes}
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 600,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                }}>
                    <ModalAgregarIngredienteXReceta
                        open={openModalIngredientes}
                        handleClose={handleCloseModalIngredientes}
                        recetaId={selectedRecetaId}
                    />
                </Box>
            </Modal>

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
                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell><strong>Receta</strong></TableCell>
                            <TableCell><strong>Descripción</strong></TableCell>
                            <TableCell align="center"><strong>Porciones</strong></TableCell>
                            <TableCell align="center"><strong>Costo Total</strong></TableCell>
                            <TableCell align="center"><strong>Costo por Porción</strong></TableCell>
                            <TableCell><strong>Acciones</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {recetasFiltradas.length > 0 ? (
                            recetasFiltradas.map((receta) => (
                                <React.Fragment key={receta.id}>
                                    <TableRow onClick={() => toggleReceta(receta.id)} style={{ cursor: 'pointer', backgroundColor: recetasExpandidas[receta.id] ? '#e0f7fa' : 'white' }}>
                                        <TableCell>
                                            {recetasExpandidas[receta.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                        </TableCell>
                                        <TableCell>{receta.nombreReceta}</TableCell>
                                        <TableCell>{receta.descripcion}</TableCell>
                                        <TableCell align="center">{receta.porcionesRinde}</TableCell>
                                        <TableCell align="center" style={{ color: 'green' }}>
                                            <strong>${receta.costoTotal.toFixed(2)}</strong>
                                        </TableCell>
                                        <TableCell align="center" style={{ color: 'blue' }}>
                                            <strong>${receta.costoPorPorcion.toFixed(2)}</strong>
                                        </TableCell>
                                        <TableCell>
                                            <IconButton color="error" onClick={() => handleDeleteReceta(receta.id)}>
                                                <DeleteIcon />
                                            </IconButton>
                                            <IconButton color="primary" onClick={() => console.log(`Editar receta con id: ${receta.id}`)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton color="secondary" onClick={() => handleOpenModalIngredientes(receta.id)}>
                                                <AddCircleIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan={7} style={{ padding: 0 }}>
                                            <Collapse in={recetasExpandidas[receta.id]} timeout="auto" unmountOnExit>
                                                <Box margin={1}>
                                                    <Typography variant="h6">Ingredientes:</Typography>
                                                    <Table>
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell><strong>Nombre</strong></TableCell>
                                                                <TableCell align="center"><strong>Cantidad Utilizada en Receta</strong></TableCell>
                                                                <TableCell align="center"><strong>Costo</strong></TableCell>
                                                                <TableCell align="center"><strong>Marca</strong></TableCell>
                                                                <TableCell align="center"><strong>Acciones</strong></TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {ingredientesPorReceta[receta.id] && ingredientesPorReceta[receta.id].length > 0 ? (
                                                                ingredientesPorReceta[receta.id].map((ingrediente) => (
                                                                    <TableRow key={ingrediente.id}>
                                                                        <TableCell>{ingrediente.nombre}</TableCell>
                                                                        <TableCell align="center">{ingrediente.cantidad} gr</TableCell>
                                                                        <TableCell align="center">${ingrediente.costo.toFixed(2)}</TableCell>
                                                                        <TableCell align="center">{ingrediente.marca}</TableCell>
                                                                        <TableCell align="center">
                                                                            <IconButton color="primary" onClick={() => handleEditIngrediente(receta.id, ingrediente.id)}>
                                                                                <EditIcon />
                                                                            </IconButton>
                                                                            <IconButton color="error" onClick={() => handleDeleteIngrediente(receta.id, ingrediente.id)}>
                                                                                <DeleteIcon />
                                                                            </IconButton>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))
                                                            ) : (
                                                                <TableRow>
                                                                    <TableCell colSpan={5} align="center">
                                                                        <Typography>No hay ingredientes para esta receta.</Typography>
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
                                <TableCell colSpan={7} align="center">
                                    <Typography>No se encontraron recetas.</Typography>
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