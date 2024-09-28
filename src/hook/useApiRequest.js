import { useEffect, useState } from 'react';
import axios from 'axios';

export const useApiRequest = (URL, method = 'GET', body = null) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const makeRequest = async () => {
      try {
        const config = {
          method,   // Método HTTP (GET, POST, PUT, etc.)
          url: URL, // URL de la API
          data: body, // Datos opcionales para métodos como POST o PUT
        };

        const response = await axios(config);
        setData(response.data);
      } catch (e) {
        setError(e.message);
      } finally {
        setIsLoading(false); // Finaliza el estado de carga
      }
    };

    makeRequest();
  }, [URL, method, body]); // Se ejecuta si la URL, método o body cambian

  return { data, isLoading, error };
};