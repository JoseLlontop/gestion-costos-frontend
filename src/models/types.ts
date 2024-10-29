
export interface Receta {
    id: number;
    nombreReceta: string;
    descripcion: string;
    porcionesRinde: number;
    costoTotal: number;
    costoPorPorcion: number;
}

export interface IngredienteReceta {
    cantidad: number;
    costo: number;
    nombre: string;
    marca: string;
}

export interface Costo {
    id: number;
    nombre: string;
    tipo: string;
    valor: number;
}