import React, { useState } from "react";
import { Receta, IngredienteReceta, Costo } from "../../models/types";
import { useApiRequest } from "../../hook/useApiRequest";
import {
    Box,
    Grid,
    Typography,
    Card,
    CardContent,
    TextField,
    Button,
    CircularProgress,
    Autocomplete,
    TextFieldProps,
    Divider,
} from "@mui/material";

const GestionGanancia: React.FC = () => {
    const [selectedReceta, setSelectedReceta] = useState<Receta | null>(null);
    const [margen, setMargen] = useState<number>(0);
    const [precioVenta, setPrecioVenta] = useState<number | null>(null);
    const [precio, setPrecio] = useState<number>(0);
    const [porcentajeGanancia, setPorcentajeGanancia] = useState<number | null>(
        null
    );

    // Hook para cargar todas las recetas disponibles
    const {
        data: recetas,
        isLoading: recetasLoading,
        error: recetasError,
    } = useApiRequest<Receta[]>("http://localhost:8080/api/recetas");

    // Hook para cargar los ingredientes de la receta seleccionada
    const {
        data: ingredientes,
        isLoading: ingredientesLoading,
        error: ingredientesError,
    } = useApiRequest<IngredienteReceta[]>(
        selectedReceta
            ? `http://localhost:8080/api/IngredientesXReceta/getxRecetaId=${selectedReceta.id}`
            : ""
    );

    // Hook para cargar todos los costos, inicializando como un arreglo vacío en caso de error o datos nulos
    const {
        data: costosFijos = [],
        isLoading: costosLoading,
        error: costosError,
    } = useApiRequest<Costo[]>("http://localhost:8080/api/costos/");

    const calcularPrecioVenta = () => {
        if (selectedReceta /*&& costosFijos */) {
            /* const totalCostosFijos = costosFijos.reduce(
                (acc, costo) => acc + costo.valor,
                0
            );*/
            const nuevoPrecio =
                selectedReceta.costoPorPorcion /*+ totalCostosFijos*/ *
                (1 + margen / 100);
            setPrecioVenta(nuevoPrecio);
        }
    };

    const calcularPorcentajeGanancia = () => {
        if (selectedReceta) {
            const nuevoPorcentajeGanancia =
                (precio * 100) / selectedReceta.costoPorPorcion - 100;

            setPorcentajeGanancia(nuevoPorcentajeGanancia);
        }
    };

    // Si se está cargando la información
    if (recetasLoading || ingredientesLoading || costosLoading) {
        return <CircularProgress />;
    }

    // Si hubo un error al cargar los datos
    if (recetasError || ingredientesError || costosError) {
        console.log(
            "Error al cargar los datos del servidor",
            recetasError,
            ingredientesError,
            costosError
        );
    }

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Typography variant="h4" gutterBottom>
                    Gestión de Ganancia por Receta
                </Typography>
            </Grid>

            <Grid item xs={12}>
                <Autocomplete
                    options={recetas || []}
                    getOptionLabel={(receta: Receta) => receta.nombreReceta}
                    onChange={(_, value) => setSelectedReceta(value)}
                    renderInput={(params: TextFieldProps) => (
                        <TextField
                            {...params}
                            label="Buscar Receta"
                            variant="outlined"
                        />
                    )}
                />
            </Grid>

            {selectedReceta && (
                <>
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography
                                    variant="h6"
                                    sx={{ marginBottom: 2 }}
                                >
                                    Informe: {selectedReceta.nombreReceta}
                                </Typography>
                                <Typography sx={{ marginBottom: 1 }}>
                                    <strong>Descripcion:</strong>{" "}
                                    {selectedReceta.descripcion}
                                </Typography>
                                <Typography>
                                    <strong style={{ marginLeft: "20px" }}>
                                        Porciones:
                                    </strong>{" "}
                                    {selectedReceta.porcionesRinde}
                                </Typography>
                                <Typography>
                                    <strong style={{ marginLeft: "20px" }}>
                                        Costo por Porción:
                                    </strong>{" "}
                                    ${selectedReceta.costoPorPorcion}
                                </Typography>
                                <Typography>
                                    <strong style={{ marginLeft: "20px" }}>
                                        Costo Total:
                                    </strong>{" "}
                                    ${selectedReceta.costoTotal}
                                </Typography>

                                {/* Mostrar detalles de los ingredientes como sección anidada */}
                                <Box
                                    sx={{
                                        padding: 2,
                                        marginTop: 3,
                                        marginLeft: 1,
                                        border: "1px solid #ddd",
                                        borderRadius: "5px",
                                        backgroundColor: "#f9f9f9",
                                    }}
                                >
                                    <Typography
                                        variant="h6"
                                        sx={{ marginBottom: 0 }}
                                    >
                                        Detalles de Ingredientes
                                    </Typography>
                                    <Grid container spacing={2}>
                                        {ingredientes?.map(
                                            (ingrediente, index) => (
                                                <Grid
                                                    item
                                                    xs={12}
                                                    sm={6}
                                                    md={4}
                                                    key={index}
                                                >
                                                    <Card>
                                                        <CardContent>
                                                            <Typography>
                                                                <strong>
                                                                    Nombre:
                                                                </strong>{" "}
                                                                {
                                                                    ingrediente.nombre
                                                                }
                                                            </Typography>
                                                            <Typography>
                                                                <strong>
                                                                    Marca:
                                                                </strong>{" "}
                                                                {
                                                                    ingrediente.marca
                                                                }
                                                            </Typography>
                                                            <Typography>
                                                                <strong>
                                                                    Cantidad:
                                                                </strong>{" "}
                                                                {
                                                                    ingrediente.cantidad
                                                                }
                                                            </Typography>
                                                            <Typography>
                                                                <strong>
                                                                    Precio:
                                                                </strong>{" "}
                                                                $
                                                                {
                                                                    ingrediente.costo
                                                                }
                                                            </Typography>
                                                        </CardContent>
                                                    </Card>
                                                </Grid>
                                            )
                                        )}
                                    </Grid>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Mostrar detalles de los costos fijos */}
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">
                                    Costos Adicionales
                                </Typography>
                                <Grid container spacing={2}>
                                    {costosFijos && costosFijos.length > 0 ? (
                                        costosFijos.map((costo, index) => (
                                            <Grid
                                                item
                                                xs={12}
                                                sm={6}
                                                md={4}
                                                key={index}
                                            >
                                                <Card>
                                                    <CardContent>
                                                        <Typography>
                                                            <strong>
                                                                Nombre:
                                                            </strong>{" "}
                                                            {costo.nombre}
                                                        </Typography>
                                                        <Typography>
                                                            <strong>
                                                                Tipo:
                                                            </strong>{" "}
                                                            {costo.tipo}
                                                        </Typography>
                                                        <Typography>
                                                            <strong>
                                                                Valor:
                                                            </strong>{" "}
                                                            ${costo.valor}
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        ))
                                    ) : (
                                        <Typography></Typography>
                                    )}
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Box
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="flex-start"
                                >
                                    {/* parte del calculo de precio de venta*/}
                                    <Box
                                        sx={{
                                            flexDirection: "column",
                                            display: "flex",
                                        }}
                                    >
                                        <Typography
                                            variant="h6"
                                            sx={{ marginBottom: 2 }}
                                        >
                                            Calcular Precio de Venta
                                        </Typography>
                                        <TextField
                                            label="Margen de Ganancia (%)"
                                            variant="outlined"
                                            type="number"
                                            value={margen}
                                            onChange={(e) =>
                                                setMargen(
                                                    parseFloat(e.target.value)
                                                )
                                            }
                                            helperText="Ingrese el porcentaje"
                                            sx={{ flexGrow: 1 }} // Permite que el TextField ocupe el espacio disponible
                                        />
                                        {precioVenta && (
                                            <Typography
                                                variant="h6"
                                                sx={{ marginTop: 1 }}
                                            >
                                                Precio de Venta: $
                                                {precioVenta.toFixed(2)}
                                            </Typography>
                                        )}
                                        <Box
                                            display="flex"
                                            justifyContent="flex-start"
                                            sx={{ marginTop: 1 }}
                                        >
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={calcularPrecioVenta}
                                                sx={{ marginRight: 1 }}
                                            >
                                                Calcular
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="success"
                                            >
                                                Aplicar Cambios
                                            </Button>
                                        </Box>
                                    </Box>
                                    <Divider
                                        orientation="vertical"
                                        flexItem
                                        sx={{ marginX: 10 }}
                                    />{" "}
                                    {/* Línea divisoria */}
                                    {/*parte de calculo de porcentaje de ganancias */}
                                    <Box
                                        sx={{
                                            flexDirection: "column",
                                            display: "flex",
                                        }}
                                    >
                                        <Typography
                                            variant="h6"
                                            sx={{ marginBottom: 2 }}
                                        >
                                            Calcular Porcentaje de Ganancia
                                        </Typography>
                                        <TextField
                                            label="Precio de venta ($)"
                                            variant="outlined"
                                            type="number"
                                            value={precio}
                                            onChange={(e) =>
                                                setPrecio(
                                                    parseFloat(e.target.value)
                                                )
                                            }
                                            helperText="Ingrese el precio de venta"
                                            sx={{ flexGrow: 1 }} // Permite que el TextField ocupe el espacio disponible
                                        />
                                        {porcentajeGanancia && (
                                            <Typography
                                                variant="h6"
                                                sx={{ marginTop: 1 }}
                                            >
                                                Porcentaje de Ganancia: %
                                                {porcentajeGanancia.toFixed(2)}
                                            </Typography>
                                        )}
                                        <Box
                                            display="flex"
                                            justifyContent="flex-start"
                                            sx={{ marginTop: 1 }}
                                        >
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={
                                                    calcularPorcentajeGanancia
                                                }
                                                sx={{ marginRight: 1 }}
                                            >
                                                Calcular
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="success"
                                            >
                                                Aplicar Cambios
                                            </Button>
                                        </Box>
                                    </Box>
                                    <Divider
                                        orientation="vertical"
                                        flexItem
                                        sx={{ marginX: 2 }}
                                    />{" "}
                                    {/* Línea divisoria */}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </>
            )}
        </Grid>
    );
};

export default GestionGanancia;
