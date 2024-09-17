import '../css/footer.css';

const Footer = () => {
  return (
    <footer>
      <section className="redes-sociales">
        <div className="contenedor">
          <a className="facebook" href="#"><i className="fa fa-facebook"></i></a>
          <a className="instagram" href="#"><i className="fa fa-instagram"></i></a>
          <a className="twitter" href="#"><i className="fa fa-twitter"></i></a>
        </div>
      </section>
    </footer>
  );
};

export default Footer;