export interface Receta {
    id: number;
    nombreReceta: string;
    descripcion: string;
    porcionesRinde: number;
    costoTotal: number;
    costoPorPorcion: number;
    porcentajeGanancia: number;
}

export interface IngredienteReceta {
    cantidad: number;
    costo: number;
    nombre: string;
    marca: string;
}
