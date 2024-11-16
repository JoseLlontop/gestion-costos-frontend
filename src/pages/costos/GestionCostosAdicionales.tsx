import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper, IconButton, Divider } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ModalNuevoCosto from '../../components/costos/ModalNuevoCosto';
import { useApiRequest } from '../../hook/useApiRequest';
import { show_alerta } from '../../helpers/funcionSweetAlert';
import GestionProduccion from '../../components/produccion/ProduccionComponent';

interface Costo {
  id: number;
  nombre: string;
  tipo: string;
  valor: number;
  totalCosto: number;
}

const GestionCostosAdicionales = () => {
  const [costos, setCostos] = useState<Costo[]>([]);
  const [nombreCostoBuscado, setNombreCostoBuscado] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [currentCosto, setCurrentCosto] = useState<Costo | null>(null);

  const API_URL = "http://localhost:8080";
  const { data, isLoading, error } = useApiRequest<Costo[]>(`${API_URL}/api/costos/`, 'GET');

  useEffect(() => {
    if (!isLoading && !error) {
      setCostos(data || []);
    }
  }, [data, isLoading, error]);

  const costosFiltrados = costos.filter(costo =>
    costo.nombre?.toLowerCase().includes(nombreCostoBuscado.toLowerCase())
  );

  const handleSaveCosto = async (costo: Costo) => {
    try {
      const url = costo.id
        ? `${API_URL}/api/costos/${costo.id}`
        : `${API_URL}/api/costos/crear`;
      const method = costo.id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(costo),
      });

      if (!response.ok) throw new Error('Error al guardar el costo');
      const costoGuardado = await response.json();

      setCostos((prevCostos) =>
        costo.id
          ? prevCostos.map((item) => (item.id === costo.id ? costoGuardado : item))
          : [...prevCostos, costoGuardado]
      );

      setOpenModal(false);
      setCurrentCosto(null);
      show_alerta(costo.id ? "Costo modificado con éxito" : "Costo guardado con éxito", "success");
    } catch (error) {
      console.error('Error al guardar el costo', error);
      show_alerta("Ocurrió un error al guardar el costo.", "error");
    }
  };

  const handleDeleteCosto = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/api/costos/${id}`, { method: 'DELETE' });
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

  const handleEditCosto = (costo: Costo) => {
    setCurrentCosto(costo);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setCurrentCosto(null);
    setOpenModal(false);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography
        variant="h4"
        align="center"
        sx={{
          fontWeight: 'bold',
          backgroundColor: '#233044',
          color: 'white',
          padding: '1rem',
          borderRadius: '8px',
          boxShadow: 3,
          marginBottom: '2rem',
        }}
      >
        Gestión de Costos Adicionales
      </Typography>

      <Typography variant="body1" align="left" sx={{ mb: 2 }}>
        En esta pestaña se agregan los costos adicionales del negocio, que pueden ser de tipo fijos o variables.
      </Typography>
      <GestionProduccion />

      <br />
      <Divider />
      <br />
      <Box display="flex" justifyContent="center" sx={{ mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => {
            setCurrentCosto(null);
            setOpenModal(true);
          }}
        >
          Añadir Costo
        </Button>
      </Box>

      <ModalNuevoCosto
        open={openModal}
        onClose={handleCloseModal}
        onSave={handleSaveCosto}
        costo={currentCosto}
      />

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
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell><strong>#</strong></TableCell>
              <TableCell><strong>Costo</strong></TableCell>
              <TableCell><strong>Tipo</strong></TableCell>
              <TableCell><strong>Valor</strong></TableCell>
              <TableCell><strong>Costo en cada receta</strong></TableCell>
              <TableCell><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {costosFiltrados.length > 0 ? (
              costosFiltrados.map((costo, i) => (
                <TableRow key={costo.id}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{costo.nombre}</TableCell>
                  <TableCell>{costo.tipo}</TableCell>
                  <TableCell>${new Intl.NumberFormat("es-MX").format(costo.valor)}</TableCell>
                  <TableCell>${new Intl.NumberFormat("es-MX").format(costo.totalCosto)}</TableCell>
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
                <TableCell colSpan={5} align="center">
                  <Typography variant="body2">No se encontraron costos con ese nombre.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default GestionCostosAdicionales;
