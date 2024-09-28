import { Link } from 'react-router-dom';
import '../css/header.css'; // Puedes reutilizar el mismo archivo CSS

const Navbar = () => {
  return (
    <nav className="menu">
      <Link to="/">Inicio</Link>
      <Link to="#">Nosotros</Link>
      <Link to="#">Contacto</Link>
    </nav>
  );
};

export default Navbar;