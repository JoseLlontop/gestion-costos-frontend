import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ModalNuevoCosto from '../../components/costos/ModalNuevoCosto';
import { useApiRequest } from '../../hook/useApiRequest';
import { show_alerta } from '../../helpers/funcionSweetAlert';

interface Costo {
  id: number;
  nombre: string;
  tipo: string;
  valor: number;
}

const GestionCostosAdicionales = () => {
  const [costos, setCostos] = useState<Costo[]>([]);
  const [nombreCostoBuscado, setNombreCostoBuscado] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [currentCosto, setCurrentCosto] = useState<Costo | null>(null); // Estado para el costo en edición

  const API_URL = "http://localhost:8080";

  // Usa el tipo genérico <Costo[]> para que TypeScript sepa que `data` es un array de costos
  const { data, isLoading, error } = useApiRequest<Costo[]>(`${API_URL}/api/costos/`, 'GET');

  useEffect(() => {
    if (!isLoading && !error) {
      setCostos(data || []);
    }
  }, [data, isLoading, error]);

  const costosFiltrados = costos.filter(costo =>
    costo.nombre?.toLowerCase().includes(nombreCostoBuscado.toLowerCase())
  );

  // Guardar o modificar un costo
  const handleSaveCosto = async (costo: Costo) => {
    try {
      const url = costo.id
        ? `${API_URL}/api/costos/${costo.id}` // Si tiene ID, es una actualización
        : `${API_URL}/api/costos/crear`; // Si no tiene ID, es una creación

      const method = costo.id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(costo),
      });

      if (!response.ok) {
        throw new Error('Error al guardar el costo');
      }

      const costoGuardado = await response.json();

      // Actualizar el estado de los costos
      setCostos((prevCostos) =>
        costo.id
          ? prevCostos.map((item) =>
              item.id === costo.id ? costoGuardado : item
            )
          : [...prevCostos, costoGuardado]
      );

      setOpenModal(false); // Cerrar el modal después de guardar
      setCurrentCosto(null); // Limpiar el costo actual
      show_alerta(costo.id ? "Costo modificado con éxito" : "Costo guardado con éxito", "success");
    } catch (error) {
      console.error('Error al guardar el costo', error);
      show_alerta("Ocurrió un error al guardar el costo.", "error");
    }
  };

  // Eliminar un costo
  const handleDeleteCosto = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/api/costos/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCostos(prevCostos => prevCostos.filter(costo => costo.id !== id));
        show_alerta("Costo eliminado con éxito", "success");
      } else {
        show_alerta("Error al eliminar el costo", "error");
      }
    } catch (error) {
      console.error("Error al eliminar el costo:", error);
      show_alerta("Ocurrió un error inesperado.", "error");
    }
  };

  // Abrir el modal para editar un costo existente
  const handleEditCosto = (costo: Costo) => {
    setCurrentCosto(costo); // Establece el costo actual para editar
    setOpenModal(true); // Abre el modal
  };

  // Cerrar el modal y limpiar el costo actual
  const handleCloseModal = () => {
    setCurrentCosto(null); // Limpiar el costo actual
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
            setCurrentCosto(null); // Limpiar el costo actual al agregar uno nuevo
            setOpenModal(true); // Abre el modal
          }}
        >
          Añadir Costo
        </Button>

        {/* Modal para añadir o editar costo */}
        <ModalNuevoCosto
          open={openModal}
          onClose={handleCloseModal}
          onSave={handleSaveCosto}
          costo={currentCosto} // Pasar el costo actual al modal
        />
      </Box>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Buscar costo por nombre"
        value={nombreCostoBuscado}
        onChange={(e) => setNombreCostoBuscado(e.target.value)}
        sx={{ mb: 2 }}
      />

      <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
        <Table stickyHeader>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell><strong>#</strong></TableCell>
              <TableCell><strong>Costo</strong></TableCell>
              <TableCell><strong>Tipo</strong></TableCell>
              <TableCell><strong>Valor</strong></TableCell>
              <TableCell><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {costosFiltrados.length > 0 ? (
              costosFiltrados.map((costo, i) => (
                <TableRow key={costo.id}>
                  <TableCell>{(i + 1)}</TableCell>
                  <TableCell>{costo.nombre}</TableCell>
                  <TableCell>{costo.tipo}</TableCell>
                  <TableCell>${new Intl.NumberFormat("es-MX").format(costo.valor)}</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleEditCosto(costo)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDeleteCosto(costo.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body2">No se encontraron costos con ese nombre.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {costos.length === 0 && !isLoading && !error && (
        <Box display="flex" justifyContent="center" sx={{ mt: 3 }}>
          <Typography variant="body2" color="textSecondary">
            No hay costos cargados todavía. ¡Empieza añadiendo un nuevo costo!
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default GestionCostosAdicionales;
