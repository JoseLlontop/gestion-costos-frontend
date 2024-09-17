import '../css/header.css';

const Header = () => {
  return (
    <header>
      <div className="contenedor">
        <img src="img/logo.svg" alt="Logo" className="logo" />
         {/*Menu de navegacion (en flexbox no es necesario usar listas)*/}
        <nav className="menu">
          <a href="#">opcion 1</a>
          <a href="#">opcion 2</a>
          <a href="#">opcion 3</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
