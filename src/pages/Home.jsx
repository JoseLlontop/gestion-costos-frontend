import { Link } from 'react-router-dom';
import '../css/main.css';

const Home = () => {
  return (
    <seccion className="main">

        <seccion className="opciones">

            {/*Tiene como funcionalidad centrar en la pantalla*/}
            <div className="contenedor">

              <h3 className="titulo">Menu de Opciones</h3>

              <div className="contenedor-cada-opciones">

                  <div className="opcion">
                    <div className="imagen-opcion">
                      <Link to="/gestionIngredientes">
                           <img src="img/opciones/1.jpg" alt="Gestion de Ingredientes" />
                      </Link>
                    </div>
                    <div className="descripcion">
                    <Link to="/gestionIngredientes" className="no-subrayado">
                      <p className="nombre">Gestión de Ingredientes</p>
                    </Link>
                      <p className="detalle">Realiza el alta, baja y modificación de ingredientes de manera rápida y sencilla</p>
                    </div>
                </div>

                <div className="opcion">
                  <div className="imagen-opcion">
                      <img src="img/opciones/2.jpg" alt=""/>
                  </div>
                  <div className="descripcion">
                    <p className="nombre">Funcionalidad 2</p>
                    <p className="detalle">Descripcion de la Funcionalidad</p>
                  </div>
                </div> 

                <div className="opcion">
                  <div className="imagen-opcion">
                      <img src="img/opciones/3.jpg" alt=""/>
                  </div>
                  <div className="descripcion">
                    <p className="nombre">Funcionalidad 3</p>
                    <p className="detalle">Descripcion de la Funcionalidad</p>
                  </div>
                </div>  

                <div className="opcion">
                  <div className="imagen-opcion">
                      <img src="img/opciones/4.jpg" alt=""/>
                  </div>
                  <div className="descripcion">
                    <p className="nombre">Funcionalidad 4</p>
                    <p className="detalle">Descripcion de la Funcionalidad</p>
                  </div>
                </div>
                      
              </div>
            </div>
        </seccion>
    </seccion>
  );
};

export default Home;