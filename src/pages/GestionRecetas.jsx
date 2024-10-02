// Estilos 
import "bootstrap/dist/css/bootstrap.min.css"
import "@fortawesome/fontawesome-free/css/all.min.css"
import "bootstrap/dist/js/bootstrap.bundle"
import 'postcss';

import { useEffect, useState } from 'react';
import { useApiRequest } from '../hook/useApiRequest'; 

const GestionRecetas = () => {

    const [recetas, setRecetas] = useState([]);

    const { data, isLoading, error } = useApiRequest('http://localhost:8080/api/recetas', 'GET');

    useEffect(() => {
        if (!isLoading && !error) {
        setRecetas(data); 
          console.log(data);
        }
      }, [data, isLoading, error]);




    return (
        <div>
            <h1>GestionRecetas</h1>
            {recetas.map((receta,i) => (
            <li>{receta.nombreReceta}</li>

            ))}
        </div>
    )
}

export default GestionRecetas;