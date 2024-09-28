import '../css/header.css';
import Navbar from './Navbar'; // Importamos el nuevo componente

const Header = () => {
  return (
    <header>
      <div className="contenedor">
        {/* Logo 
        <img src="img/logo.svg" alt="Logo" className="logo" /> */}
        {/* Componente de navegación */}
        <Navbar />
      </div>
    </header>
  );
};

export default Header;
