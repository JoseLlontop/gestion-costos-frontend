import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ModalNuevoIngrediente from '../../components/ingredientes/ModalNuevoIngrediente';
import { useApiRequest } from '../../hook/useApiRequest';
import { show_alerta } from '../../helpers/funcionSweetAlert';

interface Ingrediente {
  id: number;
  nombre: string;
  cantidad_paquete: number;
  unidad_medida: string;
  precio: number;
  marca: string;
}

const GestionIngredientes = () => {
  const [ingredientes, setIngredientes] = useState<Ingrediente[]>([]);
  const [nombreIngredienteBuscado, setNombreIngredienteBuscado] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [currentIngrediente, setCurrentIngrediente] = useState<Ingrediente | null>(null); // Estado para el ingrediente en edición

  const API_URL = "http://localhost:8080";

  const { data, isLoading, error } = useApiRequest(`${API_URL}/api/ingredientes/`, 'GET');

  useEffect(() => {
    if (!isLoading && !error) {
      setIngredientes(data || []);
    }
  }, [data, isLoading, error]);

  const ingredientesFiltrados = ingredientes.filter(ingrediente =>
    ingrediente.nombre?.toLowerCase().includes(nombreIngredienteBuscado.toLowerCase())
  );

  // Guardar o modificar un ingrediente
  const handleSaveIngrediente = async (ingrediente: Ingrediente) => {
    try {
      const url = ingrediente.id
        ? `${API_URL}/api/ingredientes/${ingrediente.id}` // Si tiene ID, es una actualización
        : `${API_URL}/api/ingredientes/crear`; // Si no tiene ID, es una creación

      const method = ingrediente.id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ingrediente),
      });

      if (!response.ok) {
        throw new Error('Error al guardar el ingrediente');
      }

      const ingredienteGuardado = await response.json();

      // Actualizar el estado de los ingredientes
      setIngredientes((prevIngredientes) =>
        ingrediente.id
          ? prevIngredientes.map((item) =>
              item.id === ingrediente.id ? ingredienteGuardado : item
            )
          : [...prevIngredientes, ingredienteGuardado]
      );

      setOpenModal(false); // Cerrar el modal después de guardar
      setCurrentIngrediente(null); // Limpiar el ingrediente actual
      show_alerta(ingrediente.id ? "Ingrediente modificado con éxito" : "Ingrediente guardado con éxito", "success");
    } catch (error) {
      console.error('Error al guardar el ingrediente', error);
      show_alerta("Ocurrió un error al guardar el ingrediente.", "error");
    }
  };

  // Eliminar un ingrediente
  const handleDeleteIngrediente = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/api/ingredientes/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setIngredientes(prevIngredientes => prevIngredientes.filter(ingrediente => ingrediente.id !== id));
        show_alerta("Ingrediente eliminado con éxito", "success");
      } else {
        show_alerta("Error al eliminar el ingrediente", "error");
      }
    } catch (error) {
      console.error("Error al eliminar el ingrediente:", error);
      show_alerta("Ocurrió un error inesperado.", "error");
    }
  };

  // Abrir el modal para editar un ingrediente existente
  const handleEditIngrediente = (ingrediente: Ingrediente) => {
    setCurrentIngrediente(ingrediente); // Establece el ingrediente actual para editar
    setOpenModal(true); // Abre el modal
  };

  // Cerrar el modal y limpiar el ingrediente actual
  const handleCloseModal = () => {
    setCurrentIngrediente(null); // Limpiar el ingrediente actual
    setOpenModal(false); // Cerrar el modal
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Box display="flex" justifyContent="center" sx={{ mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => {
            setCurrentIngrediente(null); // Limpiar el ingrediente actual al agregar uno nuevo
            setOpenModal(true); // Abre el modal
          }}
        >
          Añadir Ingrediente
        </Button>

        {/* Modal para añadir o editar ingrediente */}
        <ModalNuevoIngrediente
          open={openModal}
          onClose={handleCloseModal}
          onSave={handleSaveIngrediente}
          ingrediente={currentIngrediente} // Pasar el ingrediente actual al modal
        />
      </Box>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Buscar ingrediente por nombre"
        value={nombreIngredienteBuscado}
        onChange={(e) => setNombreIngredienteBuscado(e.target.value)}
        sx={{ mb: 2 }}
      />

      <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
        <Table stickyHeader>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell><strong>#</strong></TableCell>
              <TableCell><strong>Ingrediente</strong></TableCell>
              <TableCell><strong>Cantidad</strong></TableCell>
              <TableCell><strong>Unidad Medida</strong></TableCell>
              <TableCell><strong>Precio</strong></TableCell>
              <TableCell><strong>Marca</strong></TableCell>
              <TableCell><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ingredientesFiltrados.length > 0 ? (
              ingredientesFiltrados.map((ingrediente, i) => (
                <TableRow key={ingrediente.id}>
                  <TableCell>{(i + 1)}</TableCell>
                  <TableCell>{ingrediente.nombre}</TableCell>
                  <TableCell>{ingrediente.cantidad_paquete}</TableCell>
                  <TableCell>{ingrediente.unidad_medida}</TableCell>
                  <TableCell>${new Intl.NumberFormat("es-MX").format(ingrediente.precio)}</TableCell>
                  <TableCell>{ingrediente.marca}</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleEditIngrediente(ingrediente)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDeleteIngrediente(ingrediente.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body2">No se encontraron ingredientes con ese nombre.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {ingredientes.length === 0 && !isLoading && !error && (
        <Box display="flex" justifyContent="center" sx={{ mt: 3 }}>
          <Typography variant="body2" color="textSecondary">
            No hay ingredientes cargados todavía. ¡Empieza añadiendo un nuevo ingrediente!
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default GestionIngredientes;
