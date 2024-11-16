import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { useState, useEffect } from 'react';

import { useApiRequest } from '../../hook/useApiRequest';

const style = {
    position: 'absolute', 
    top: '50%', 
    left: '50%', 
    transform: 'translate(-50%, -50%)', 
    width: 600, 
    bgcolor: 'background.paper', 
    boxShadow: 24, 
    p: 4 
  };

  
  

function ModalUsarIngredienteDeReceta() {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => {
      setOpen(true);
    };
    const handleClose = () => {
      setOpen(false);
    };

    const API_URL = "http://localhost:8080";

    const { data, isLoading, error } = useApiRequest(
        `${API_URL}/api/recetas`,
        "GET"
    );

    const [recetas, setRecetas] = useState([]);
    useEffect(() => {
        if (!isLoading && !error) {
            setRecetas(data || []);
        }
    }, [data, isLoading, error]);
  
    return (
      <React.Fragment>
                    <Button
                        variant="outlined"
                        color="secondary"
                        fullWidth
                        onClick={() => {
                           handleOpen();
                        }}
                        sx={{ mb: 2 }}
                    >
                        Usar Ingredientes de Receta Existente
                    </Button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="child-modal-title"
          aria-describedby="child-modal-description"
        >
          <Box sx={{ ...style, width: 500 }}>
        
            {recetas.map((receta) => (
                               <Button  color="primary"
                               fullWidth>{receta.nombreReceta}</Button>
                            ))}
          </Box>
        </Modal>
      </React.Fragment>
    );
  }

  export default ModalUsarIngredienteDeReceta;