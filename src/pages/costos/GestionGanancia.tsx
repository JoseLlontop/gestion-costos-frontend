import React, { useState } from 'react';
import { Receta, IngredienteReceta } from '../../models/types';
import { useApiRequest } from '../../hook/useApiRequest';
import {
  Grid, Card, CardContent, Typography, TextField, Button, CircularProgress, Autocomplete, TextFieldProps
} from '@mui/material';

const GestionGanancia: React.FC = () => {
  const [selectedReceta, setSelectedReceta] = useState<Receta | null>(null);
  const [margen, setMargen] = useState<number>(0);
  const [precioVenta, setPrecioVenta] = useState<number | null>(null);

  // Hook para cargar todas las recetas disponibles
  const { data: recetas, isLoading: recetasLoading, error: recetasError } =
    useApiRequest<Receta[]>("http://localhost:8080/api/recetas");

  // Hook para cargar los ingredientes de la receta seleccionada
  const { data: ingredientes, isLoading: ingredientesLoading, error: ingredientesError } =
    useApiRequest<IngredienteReceta[]>(
      selectedReceta ? `http://localhost:8080/api/IngredientesXReceta/getxRecetaId=${selectedReceta.id}` : ''
    );

  const calcularPrecioVenta = () => {
    if (selectedReceta) {
      const nuevoPrecio = selectedReceta.costoTotal * (1 + margen / 100);
      setPrecioVenta(nuevoPrecio);
    }
  };

  // Si se está cargando la información
  if (recetasLoading || ingredientesLoading) {
    return <CircularProgress />;
  }

  // Si hubo un error al cargar los datos
  if (recetasError || ingredientesError) {
    return <Typography color="error">Error al cargar los datos.</Typography>;
  }

  return (

    <Grid container spacing={3}>
      {/* Título del componente */}
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>
          Gestión de Ganancia por Receta
        </Typography>
      </Grid>

      {/* Buscador de recetas */}
      <Grid item xs={12}>
        <Autocomplete
          options={recetas || []}
          getOptionLabel={(receta: Receta) => receta.nombreReceta}
          onChange={(_, value) => setSelectedReceta(value)}
          renderInput={(params: TextFieldProps) => (
            <TextField {...params} label="Buscar Receta" variant="outlined" />
          )}
        />
      </Grid>

      {/* Mostrar detalles de la receta seleccionada */}
      {selectedReceta && (
        <>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ marginBottom: 1 }}>Detalles de la receta: {selectedReceta.nombreReceta}</Typography>
                <Typography sx={{ marginBottom: 1 }}> 
                  <strong>Descripcion:</strong>  {selectedReceta.descripcion}</Typography>
                <Typography>
                <strong style={{ marginLeft: '20px' }}>Porciones:</strong> {selectedReceta.porcionesRinde}
                </Typography>
                <Typography>
                  <strong style={{ marginLeft: '20px' }}>Costo por Porción:</strong> ${selectedReceta.costoPorPorcion}
                </Typography>
                <Typography>
                  <strong style={{ marginLeft: '20px' }}>Costo Total:</strong> ${selectedReceta.costoTotal}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Mostrar detalles de los ingredientes */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6">Detalles de Ingredientes</Typography>
                {ingredientes && (
                  <Grid container spacing={2}>
                    {ingredientes.map((ingrediente, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card>
                          <CardContent>
                            <Typography>
                              <strong>Nombre:</strong> {ingrediente.nombre}
                            </Typography>
                            <Typography>
                              <strong>Marca:</strong> {ingrediente.marca}
                            </Typography>
                            <Typography>
                              <strong>Cantidad:</strong> {ingrediente.cantidad}
                            </Typography>
                            <Typography>
                              <strong>Precio:</strong> ${ingrediente.costo}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </CardContent>
            </Card>
          </Grid>


          {/* Sección para calcular precio de venta */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ marginBottom: 2 }}>Calcular Precio de Venta</Typography>
                <TextField
                  label="Margen de Ganancia (%)"
                  variant="outlined"
                  type="number"
                  value={margen}
                  onChange={(e) => setMargen(parseFloat(e.target.value))}
                  helperText="Ingrese el porcentaje"
                />
                <Button variant="contained" color="primary" onClick={calcularPrecioVenta} sx={{ marginLeft: 2, marginTop: 1  }}>
                  Calcular
                </Button>
                {precioVenta && (
                  <Typography variant="h6" sx={{ marginTop: 2 }}>
                    Precio de Venta: ${precioVenta.toFixed(2)}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default GestionGanancia;
