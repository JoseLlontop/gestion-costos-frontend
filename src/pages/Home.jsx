import { Link } from 'react-router-dom';
import '../css/main.css';

const Home = () => {
  return (
    <section className="main">

        <section className="opciones">

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
                  <Link to="/gestionRecetas" className="no-subrayado">
                      <img src="img/opciones/2.jpg" alt=""/>
                  </Link>
                  </div>
                  <div className="descripcion">
                  <Link to="/gestionRecetas" className="no-subrayado">
                    <p className="nombre">Gestión de Recetas</p>
                  </Link>
                    <p className="detalle">Administra tus recetas, crea nuevas, modifica o elimina las existentes de manera fácil y rápida</p>
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
        </section>
    </section>
  );
};

export default Home;
