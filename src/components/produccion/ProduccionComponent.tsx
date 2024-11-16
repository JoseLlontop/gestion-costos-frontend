import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper, IconButton, Modal, Divider } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { useApiRequest } from '../../hook/useApiRequest';
import { show_alerta } from '../../helpers/funcionSweetAlert';

interface Produccion {
  id?: number;
  cantidad_producida_mensualmente: number;
}

const API_URL = "http://localhost:8080/api/produccion";

const GestionProduccion = () => {
  const [producciones, setProducciones] = useState<Produccion[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [currentProduccion, setCurrentProduccion] = useState<Produccion | null>(null);
  const [cantidad, setCantidad] = useState("");

  // Fetch initial data
  const { data, isLoading, error } = useApiRequest<Produccion[]>(`${API_URL}/`, 'GET');

  useEffect(() => {
    if (!isLoading && !error && data) {
      setProducciones(data);
    }
  }, [data, isLoading, error]);

  // Guardar o modificar una producción
  const handleSaveProduccion = async () => {
    if (!cantidad) {
      show_alerta("La cantidad no puede estar vacía", "warning");
      return;
    }

    const nuevaProduccion: Produccion = {
      cantidad_producida_mensualmente: parseFloat(cantidad),
    };

    const method = currentProduccion ? 'PUT' : 'POST';
    const url = currentProduccion ? `${API_URL}/modificar/${currentProduccion.id}` : `${API_URL}/crear`;

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaProduccion),
      });

      if (!response.ok) {
        throw new Error('Error al guardar la producción');
      }

      const produccionGuardada = await response.json();

      // Actualizar la lista de producciones
      setProducciones((prevProducciones) =>
        currentProduccion
          ? prevProducciones.map((prod) =>
              prod.id === produccionGuardada.id ? produccionGuardada : prod
            )
          : [...prevProducciones, produccionGuardada]
      );

      show_alerta(
        currentProduccion ? 'Producción modificada con éxito' : 'Producción añadida con éxito',
        'success'
      );

      handleCloseModal();
    } catch (error) {
      console.error('Error al guardar la producción', error);
      show_alerta('Ocurrió un error al guardar la producción.', 'error');
    }
  };

  // Abrir el modal para agregar o editar una producción
  const handleOpenModal = (produccion: Produccion | null = null) => {
    setCurrentProduccion(produccion);
    setCantidad(produccion?.cantidad_producida_mensualmente.toString() || "");
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setCurrentProduccion(null);
    setCantidad("");
  };

  return (
    
    <Box sx={{ padding: 2 }}>

      <Divider />
      <br />
      <Typography variant="body1" align="left" sx={{ mb: 2 }}>
        Ingresa la cantidad producida mensualmente. Este valor es necesario para calcular el impacto de los costos fijos en los costos de producción de cada receta.
      </Typography>  
      {/* Lo comento porque solo hace falta agregar un valor de produccion */}
      {/* <Box display="flex" justifyContent="center" sx={{ mb: 2 }}>
        <Button
          
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenModal()}
        >
          Añadir Producción
        </Button>
      </Box> */}
      <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong></strong></TableCell>
              <TableCell><strong>Cantidad Producida Mensualmente</strong></TableCell>
              <TableCell><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {producciones.map((produccion, index) => (
              <TableRow key={produccion.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{produccion.cantidad_producida_mensualmente}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleOpenModal(produccion)}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal para Añadir/Editar Producción */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            {currentProduccion ? 'Editar Producción' : 'Nueva Producción'}
          </Typography>
          <TextField
            fullWidth
            label="Cantidad Producida Mensualmente"
            type="number"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Box display="flex" justifyContent="space-between">
            <Button variant="contained" color="primary" onClick={handleSaveProduccion}>
              Guardar
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default GestionProduccion;
